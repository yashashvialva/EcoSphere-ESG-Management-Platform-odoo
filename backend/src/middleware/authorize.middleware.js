const { AuthorizationError } = require('../shared/errors');

/**
 * Authorization middleware factory.
 * Checks if the authenticated user has the required permission code.
 *
 * Usage: authorize('social.approve_participation')
 */
const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthorizationError('Authentication required before authorization'));
    }

    const userPermissions = req.user.permissions || [];

    // Admin bypass — administrators have all permissions
    if (req.user.roleName === 'Administrator') {
      return next();
    }

    const hasPermission = requiredPermissions.every(
      permission => userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return next(
        new AuthorizationError(
          `Missing required permission(s): ${requiredPermissions.join(', ')}`
        )
      );
    }

    next();
  };
};

module.exports = authorize;
