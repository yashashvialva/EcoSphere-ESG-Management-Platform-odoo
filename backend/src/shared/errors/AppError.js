/**
 * Custom application error class
 * Allows setting HTTP status codes for errors thrown in services
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found.`, 404);
    this.name = 'NotFoundError';
  }
}

class ConflictError extends AppError {
  constructor(message = 'A record with this value already exists.') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to perform this action.') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Invalid request.') {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

module.exports = {
  AppError,
  NotFoundError,
  ConflictError,
  ForbiddenError,
  BadRequestError,
};
