const { AppError } = require('../shared/errors');
const { error: errorResponse } = require('../shared/responses');
const config = require('../config/env');

/**
 * Central error handling middleware.
 * Catches all errors and returns standardized JSON responses.
 * Must be registered last in Express middleware chain.
 */
const errorHandler = (err, req, res, _next) => {
  // Log error in development
  if (config.isDev) {
    console.error('❌ Error:', err.message);
    if (err.stack) {
      console.error(err.stack);
    }
  }

  // Handle Prisma errors
  if (err.code === 'P2002') {
    return errorResponse(res, 409, 'CONFLICT', 'A record with this value already exists', null, req.requestId);
  }
  if (err.code === 'P2025') {
    return errorResponse(res, 404, 'NOT_FOUND', 'Record not found', null, req.requestId);
  }
  if (err.code === 'P2003') {
    return errorResponse(res, 400, 'FOREIGN_KEY_VIOLATION', 'Referenced record does not exist', null, req.requestId);
  }

  // Handle operational errors
  if (err instanceof AppError) {
    return errorResponse(res, err.statusCode, err.code, err.message, err.details, req.requestId);
  }

  // Handle Zod errors directly (shouldn't happen if validate middleware is used)
  if (err.name === 'ZodError') {
    const details = err.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return errorResponse(res, 400, 'VALIDATION_ERROR', 'Validation failed', details, req.requestId);
  }

  // Unexpected error — don't leak internals
  return errorResponse(
    res,
    500,
    'INTERNAL_SERVER_ERROR',
    config.isDev ? err.message : 'An unexpected error occurred',
    null,
    req.requestId
  );
};

module.exports = errorHandler;
