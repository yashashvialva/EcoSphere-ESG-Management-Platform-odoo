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

  // Prisma: Unique constraint violation
  if (err.code === 'P2002') {
    const fields = err.meta?.target?.join(', ') || 'field';
    return res.status(409).json(
      ApiResponse.error(`A record with this ${fields} already exists.`, 409)
    );
  }

  // Prisma: Record not found
  if (err.code === 'P2025') {
    return res.status(404).json(
      ApiResponse.error('Record not found.', 404)
    );
  }

  // Prisma: Foreign key constraint failed
  if (err.code === 'P2003') {
    return res.status(400).json(
      ApiResponse.error('Referenced record does not exist. Check the provided IDs.', 400)
    );
  }

  // Prisma: Invalid input value
  if (err.code === 'P2006' || err.code === 'P2007' || err.code === 'P2012') {
    return res.status(400).json(
      ApiResponse.error('Invalid data provided. Please check your input.', 400)
    );
  }

  // JSON parse error (malformed request body)
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json(
      ApiResponse.error('Invalid JSON in request body.', 400)
    );
  }

  // Payload too large
  if (err.type === 'entity.too.large') {
    return res.status(413).json(
      ApiResponse.error('Request body is too large.', 413)
    );
  }

  // Custom AppError
  if (err.statusCode) {
    return res.status(err.statusCode).json(
      ApiResponse.error(err.message, err.statusCode)
    );
  }

  // Default server error
  const statusCode = 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error.'
      : err.message || 'Internal server error.';

  res.status(statusCode).json(ApiResponse.error(message, statusCode));
};

module.exports = { errorHandler };

