const { ValidationError } = require('../shared/errors');

/**
 * Zod validation middleware factory.
 * Validates req.body, req.params, and/or req.query against Zod schemas.
 *
 * Usage: validate({ body: createCsrActivitySchema })
 */
const validate = (schemas) => {
  return (req, res, next) => {
    const errors = [];

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        errors.push(
          ...result.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          }))
        );
      } else {
        req.body = result.data;
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        errors.push(
          ...result.error.issues.map(issue => ({
            field: `params.${issue.path.join('.')}`,
            message: issue.message,
          }))
        );
      } else {
        req.params = result.data;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        errors.push(
          ...result.error.issues.map(issue => ({
            field: `query.${issue.path.join('.')}`,
            message: issue.message,
          }))
        );
      } else {
        req.query = result.data;
      }
    }

    if (errors.length > 0) {
      return next(new ValidationError('Request validation failed', errors));
    }

    next();
  };
};

module.exports = validate;
