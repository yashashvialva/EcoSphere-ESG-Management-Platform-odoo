const { NotFoundError } = require('../shared/errors');

/**
 * Catches requests to undefined routes and passes a 404 to the error handler.
 */
const notFound = (req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl}`));
};

module.exports = notFound;
