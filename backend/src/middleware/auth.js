const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const prisma = require('../config/prisma');
const { ApiResponse } = require('../shared/responses/apiResponse');

/**
 * Authentication middleware - verifies JWT token
 * Attaches user object to req.user
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(
        ApiResponse.error('Authentication required. Please provide a valid token.', 401)
      );
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, jwtConfig.secret);

    const employee = await prisma.employee.findUnique({
      where: { id: decoded.id },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
        department: true,
      },
    });

    if (!employee || !employee.isActive) {
      return res.status(401).json(
        ApiResponse.error('User not found or inactive.', 401)
      );
    }

    // Attach user with permissions to request
    req.user = {
      id: employee.id,
      email: employee.email,
      firstName: employee.firstName,
      lastName: employee.lastName,
      roleId: employee.roleId,
      roleName: employee.role.name,
      departmentId: employee.departmentId,
      departmentName: employee.department?.name,
      permissions: employee.role.permissions.map((rp) => rp.permission.code),
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json(
        ApiResponse.error('Invalid token.', 401)
      );
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json(
        ApiResponse.error('Token expired. Please login again.', 401)
      );
    }
    next(error);
  }
};

module.exports = { authenticate };
