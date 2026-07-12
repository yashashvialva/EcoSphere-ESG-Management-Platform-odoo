const { ApiResponse } = require('../shared/responses/apiResponse');

/**
 * Authorization middleware - checks if user has required permissions
 * @param  {...string} requiredPermissions - Permission codes to check
 */
const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(
        ApiResponse.error('Authentication required.', 401)
      );
    }

    // Admin bypasses all permission checks
    if (req.user.roleName === 'Administrator') {
      return next();
    }

    const hasPermission = requiredPermissions.some((permission) =>
      req.user.permissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json(
        ApiResponse.error('You do not have permission to perform this action.', 403)
      );
    }

    next();
  };
};

module.exports = { authorize };
