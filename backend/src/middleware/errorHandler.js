const { ApiResponse } = require('../shared/responses/apiResponse');

/**
 * Global error handler middleware
 * Must be registered last in Express middleware chain
 */
const errorHandler = (err, req, res, _next) => {
  console.error(`[ERROR] ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Prisma known request errors
  if (err.code === 'P2002') {
    return res.status(409).json(
      ApiResponse.error('A record with this value already exists.', 409)
    );
  }

  if (err.code === 'P2025') {
    return res.status(404).json(
      ApiResponse.error('Record not found.', 404)
    );
  }

  // Custom AppError
  if (err.statusCode) {
    return res.status(err.statusCode).json(
      ApiResponse.error(err.message, err.statusCode)
    );
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error.'
      : err.message || 'Internal server error.';

  res.status(statusCode).json(ApiResponse.error(message, statusCode));
};

module.exports = { errorHandler };
