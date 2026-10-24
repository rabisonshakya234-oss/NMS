// An error with an HTTP status code, e.g. throw new ApiError(404, 'Note not found')
class ApiError extends Error {
  constructor(statusCode, message, errors) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

module.exports = ApiError;
