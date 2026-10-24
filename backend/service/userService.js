const ApiError = require('../utils/ApiError');
const { cleanUser } = require('./authService');
const User = require('../model/userModel');

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return cleanUser(user);
};

const updateProfile = async (userId, { username }) => {
  username = username.trim();

  const taken = await User.findOne({ username });
  if (taken && taken._id.toString() !== userId) throw new ApiError(409, 'Username is already in use');

  const user = await User.findByIdAndUpdate(userId, { username }, { new: true, runValidators: true });
  if (!user) throw new ApiError(404, 'User not found');
  return cleanUser(user);
};

// Admin only
const listUsers = async ({ page, limit }) => {
  const users = await User.find({}).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit);
  const total = await User.countDocuments({});
  return { users: users.map(cleanUser), pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

module.exports = { getProfile, updateProfile, listUsers };
