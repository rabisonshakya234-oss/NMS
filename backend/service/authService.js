const bcrypt = require('bcrypt');
const config = require('../config/env');
const ApiError = require('../utils/ApiError');
const sendEmail = require('../utils/sendEmail');
const { createLoginToken, hashToken, createResetToken } = require('../utils/token');
const User = require('../model/userModel');
const TokenBlacklist = require('../model/tokenBlacklistModel');

// Only send safe fields to the client (never the password or reset token).
const cleanUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
});

const register = async ({ username, email, password, confirmPassword }) => {
  if (password !== confirmPassword) throw new ApiError(400, 'Passwords do not match');

  email = email.trim().toLowerCase();
  username = username.trim();

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) throw new ApiError(409, 'Email or username is already in use');

  const hashed = await bcrypt.hash(password, config.saltRounds);

  // The existing schema requires confirmPassword, so we store the same hash (never the plain text).
  const user = await User.create({ username, email, password: hashed, confirmPassword: hashed });

  return { user: cleanUser(user), token: createLoginToken(user) };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  const passwordOk = user && (await bcrypt.compare(password, user.password));
  if (!passwordOk) throw new ApiError(401, 'Invalid email or password');

  return { user: cleanUser(user), token: createLoginToken(user) };
};

// Logout = remember the token's id so it can't be used again.
const logout = async (decodedToken) => {
  await TokenBlacklist.create({
    jti: decodedToken.jti,
    expiresAt: new Date(decodedToken.exp * 1000),
  });
};

const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) return; // do nothing, but the controller answers the same way

  const { token, hashedToken, expires } = createResetToken();
  await User.findByIdAndUpdate(user._id, { forgotPasswordToken: hashedToken, resetPasswordExpires: expires });

  const link = `${config.resetPageUrl}/${token}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      text:
        `Hi ${user.username},\n\nOpen this link to choose a new password ` +
        `(valid for ${config.resetTokenMinutes} minutes):\n${link}\n\n` +
        `If you did not ask for this, ignore this email.`,
      html:
        `<p>Hi,</p><p>Click the link below to choose a new password ` +
        `(valid for ${config.resetTokenMinutes} minutes):</p><p><a href="${link}">Reset password</a></p>` +
        `<p>If you did not ask for this, ignore this email.</p>`,
    });
  } catch (error) {
    console.error('Could not send reset email:', error.message);
    await User.findByIdAndUpdate(user._id, { $unset: { forgotPasswordToken: 1, resetPasswordExpires: 1 } });
    throw new ApiError(500, 'Could not send the reset email, please try again later');
  }
};

const resetPassword = async ({ token, password, confirmPassword }) => {
  if (password !== confirmPassword) throw new ApiError(400, 'Passwords do not match');

  const user = await User.findOne({
    forgotPasswordToken: hashToken(token),
    resetPasswordExpires: { $gt: new Date() },
  });
  if (!user) throw new ApiError(400, 'Reset link is invalid or has expired');

  const hashed = await bcrypt.hash(password, config.saltRounds);
  await User.findByIdAndUpdate(user._id, {
    $set: { password: hashed, confirmPassword: hashed },
    $unset: { forgotPasswordToken: 1, resetPasswordExpires: 1 }, // the link works only once
  });

  // Tell the user. If this email fails the password is already changed, so just log it.
  sendEmail({
    to: user.email,
    subject: 'Your password was changed',
    text: `Hi ${user.username},\n\nYour password was changed. If this was not you, reset it again right away.`,
    html: '<p>Your password was changed. If this was not you, reset it again right away.</p>',
  }).catch((error) => console.error('Could not send confirmation email:', error.message));
};

const changePassword = async (userId, { currentPassword, newPassword, confirmPassword }) => {
  if (newPassword !== confirmPassword) throw new ApiError(400, 'Passwords do not match');

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  const passwordOk = await bcrypt.compare(currentPassword, user.password);
  if (!passwordOk) throw new ApiError(400, 'Current password is incorrect');

  const hashed = await bcrypt.hash(newPassword, config.saltRounds);
  await User.findByIdAndUpdate(userId, { $set: { password: hashed, confirmPassword: hashed } });
};

module.exports = { register, login, logout, forgotPassword, resetPassword, changePassword, cleanUser };
