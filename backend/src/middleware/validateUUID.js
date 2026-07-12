const { ApiResponse } = require('../shared/responses/apiResponse');

/**
 * UUID format validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Middleware to validate that route params with 'id' are valid UUIDs.
 * Prevents Prisma errors from malformed IDs hitting the database layer.
 */
const validateUUID = (...paramNames) => {
  return (req, res, next) => {
    for (const param of paramNames) {
      const value = req.params[param];
      if (value && !UUID_REGEX.test(value)) {
        return res.status(400).json(
          ApiResponse.error(`Invalid ${param} format. Must be a valid UUID.`, 400)
        );
      }
    }
    next();
  };
};

module.exports = { validateUUID };
