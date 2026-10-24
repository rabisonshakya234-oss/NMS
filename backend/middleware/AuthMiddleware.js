const ApiError = require('../utils/ApiError');
const { verifyLoginToken } = require('../utils/token');
const User = require('../model/userModel');
const TokenBlacklist = require('../model/tokenBlacklistModel');

// Checks the "Authorization: Bearer <token>" header and sets req.user.
async function protect(req, res, next) {
  try {
    const [type, token] = (req.headers.authorization || '').split(' ');
    if (type !== 'Bearer' || !token) throw new ApiError(401, 'Please log in first');

    const decoded = verifyLoginToken(token); // throws if invalid or expired

    const loggedOut = await TokenBlacklist.exists({ jti: decoded.jti });
    if (loggedOut) throw new ApiError(401, 'You are logged out, please log in again');

    const user = await User.findById(decoded.id);
    if (!user) throw new ApiError(401, 'This user no longer exists');

    req.user = { id: user._id.toString(), role: user.role };
    req.token = decoded; // needed by logout
    next();
  } catch (error) {
    next(error); // sends the error to the error handler (this is what asyncHandler did for us)
  }
}

module.exports = { protect };