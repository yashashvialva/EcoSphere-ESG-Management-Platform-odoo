const { v4: uuidv4 } = require('uuid');

/**
 * Assigns a unique request ID to every incoming request.
 * Useful for tracing errors in logs.
 */
const requestId = (req, res, next) => {
  req.requestId = req.headers['x-request-id'] || uuidv4();
  res.setHeader('X-Request-Id', req.requestId);
  next();
};

module.exports = requestId;
