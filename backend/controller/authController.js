const asyncHandler = require('../utils/asyncHandler');
const authService = require('../service/authService');

async function register(req, res) {
  const data = await authService.register(req.body);
  res.status(201).json({ success: true, message: 'Registration successful', data });
}

async function login(req, res) {
  const data = await authService.login(req.body);
  res.json({ success: true, message: 'Login successful', data });
}

async function logout(req, res) {
  await authService.logout(req.token);
  res.json({ success: true, message: 'Logged out successfully' });
}

async function forgotPassword(req, res) {
  await authService.forgotPassword(req.body);
  // Same answer whether or not the email exists, so nobody can check who has an account.
  res.json({ success: true, message: 'If that email is registered, a reset link has been sent' });
}

async function resetPassword(req, res) {
  await authService.resetPassword({ token: req.params.token, ...req.body });
  res.json({ success: true, message: 'Password reset successfully, you can now log in' });
}

async function changePassword(req, res) {
  await authService.changePassword(req.user.id, req.body);
  res.json({ success: true, message: 'Password changed successfully' });
}

module.exports = { register, login, logout, forgotPassword, resetPassword, changePassword };