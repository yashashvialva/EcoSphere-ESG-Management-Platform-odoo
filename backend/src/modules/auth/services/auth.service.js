const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../../config/prisma');
const config = require('../../../config/env');
const { AuthenticationError, ConflictError, NotFoundError } = require('../../../shared/errors');

const login = async (email, password) => {
  const employee = await prisma.employee.findUnique({
    where: { email },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: { permission: true },
          },
        },
      },
      department: true,
    },
  });

  if (!employee) {
    throw new AuthenticationError('Invalid email or password');
  }

  if (!employee.isActive) {
    throw new AuthenticationError('Account is deactivated');
  }

  const isValid = await bcrypt.compare(password, employee.passwordHash);
  if (!isValid) {
    throw new AuthenticationError('Invalid email or password');
  }

  const token = jwt.sign(
    { id: employee.id, email: employee.email, roleId: employee.roleId },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  const permissions = employee.role?.rolePermissions?.map(rp => rp.permission.code) || [];

  return {
    token,
    employee: {
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      role: employee.role?.name,
      department: employee.department?.name,
      departmentId: employee.departmentId,
      totalXp: employee.totalXp,
      permissions,
    },
  };
};

const register = async (data) => {
  const existing = await prisma.employee.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new ConflictError('An employee with this email already exists');
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const employee = await prisma.employee.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash,
      departmentId: data.departmentId,
      roleId: data.roleId,
    },
    include: {
      role: true,
      department: true,
    },
  });

  return {
    id: employee.id,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    role: employee.role?.name,
    department: employee.department?.name,
  };
};

const getMe = async (userId) => {
  const employee = await prisma.employee.findUnique({
    where: { id: userId },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: { permission: true },
          },
        },
      },
      department: true,
    },
  });

  if (!employee) {
    throw new NotFoundError('Employee');
  }

  const permissions = employee.role?.rolePermissions?.map(rp => rp.permission.code) || [];

  return {
    id: employee.id,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    role: employee.role?.name,
    roleId: employee.roleId,
    department: employee.department?.name,
    departmentId: employee.departmentId,
    totalXp: employee.totalXp,
    isActive: employee.isActive,
    permissions,
  };
};

module.exports = { login, register, getMe };
