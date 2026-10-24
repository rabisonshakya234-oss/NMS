const ApiError = require('../utils/ApiError');

// Use after protect. Example: router.get('/', authorize('admin'), handler)
function authorize(...allowedRoles) {
  return async function (req, res, next) {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to do this'));
    }
    next();
  };
}

module.exports = { authorize };