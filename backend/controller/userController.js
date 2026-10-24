const asyncHandler = require('../utils/asyncHandler');
const userService = require('../service/userService');

async function getProfile(req, res) {
  const user = await userService.getProfile(req.user.id);
  res.json({ success: true, message: 'Profile fetched', data: { user } });
}

async function updateProfile(req, res) {
  const user = await userService.updateProfile(req.user.id, req.body);
  res.json({ success: true, message: 'Profile updated', data: { user } });
}

async function listUsers(req, res) {
  const data = await userService.listUsers(req.query);
  res.json({ success: true, message: 'Users fetched', data });
}

module.exports = { getProfile, updateProfile, listUsers };