const jwt = require('jsonwebtoken');
const config = require('../config/env');
const prisma = require('../config/prisma');
const { AuthenticationError } = require('../shared/errors');

/**
 * Authentication middleware.
 * Verifies JWT, loads employee info, and attaches to req.user.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret);

    const employee = await prisma.employee.findUnique({
      where: { id: decoded.id },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
        department: true,
      },
    });

    if (!employee) {
      throw new AuthenticationError('Employee not found');
    }

    if (!employee.isActive) {
      throw new AuthenticationError('Account is deactivated');
    }

    // Attach user context
    req.user = {
      id: employee.id,
      email: employee.email,
      firstName: employee.firstName,
      lastName: employee.lastName,
      roleId: employee.roleId,
      roleName: employee.role?.name,
      departmentId: employee.departmentId,
      departmentName: employee.department?.name,
      permissions: employee.role?.rolePermissions?.map(rp => rp.permission.code) || [],
    };

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new AuthenticationError('Invalid or expired token'));
    }
    next(err);
  }
};

module.exports = authenticate;
