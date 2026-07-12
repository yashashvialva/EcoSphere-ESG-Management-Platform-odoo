const { ApiResponse } = require('../shared/responses/apiResponse');

/**
 * Zod validation middleware factory
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @param {'body' | 'query' | 'params'} source - Request property to validate
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json(
        ApiResponse.error('Validation failed.', 400, errors)
      );
    }

    // Replace the source with parsed (and transformed) data
    req[source] = result.data;
    next();
  };
};

module.exports = { validate };
