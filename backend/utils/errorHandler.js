const ApiError = require('./ApiError');
const config = require('../config/env');

// For any /api URL that does not exist.
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// Every error ends here, so all error responses look the same.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || err.status || 500;
  let message = err.message;
  let errors = err.errors;

  if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path}`;
  } else if (err.name === 'ValidationError' && err.errors) {
    status = 400;
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    message = 'Validation failed';
  } else if (err.code === 11000) {
    status = 409;
    message = 'That value is already in use';
  } else if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Your session has expired, please log in again';
  } else if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Malformed JSON body';
  }

  if (status >= 500) {
    console.error(err);
    if (config.isProduction) message = 'Something went wrong on the server';
  }

  const body = { success: false, message };
  if (errors) body.errors = errors;
  res.status(status).json(body);
};

module.exports = { notFound, errorHandler };
