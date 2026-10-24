const rateLimit = require('express-rate-limit');
const ApiError = require('./ApiError');
const config = require('../config/env');

const makeLimiter = (minutes, limit, message, extraOptions = {}) =>
  rateLimit({
    windowMs: minutes * 60 * 1000,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => next(new ApiError(429, message)),
    ...extraOptions,
  });

// Login / register / reset password
const authLimiter = makeLimiter(15, 20, 'Too many attempts, try again in 15 minutes');

// Forgot password (stops email spam)
const forgotPasswordLimiter = makeLimiter(60, 5, 'Too many reset requests, try again in an hour');

// "Ask Your Notes": the free Gemini key has low limits, so each logged-in user gets a small allowance.
const aiLimiter = makeLimiter(1, config.gemini.requestsPerMinute, 'You are asking too fast, wait a minute and try again', {
  keyGenerator: (req) => req.user.id, // runs after login, so req.user exists
});

module.exports = { authLimiter, forgotPasswordLimiter, aiLimiter };
