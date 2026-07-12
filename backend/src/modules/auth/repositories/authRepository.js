const prisma = require('../../../config/prisma');

class AuthRepository {
  async findByEmail(email) {
    return prisma.employee.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
        department: true,
      },
    });
  }

  async findById(id) {
    return prisma.employee.findUnique({
      where: { id },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
        department: true,
      },
    });
  }

  async create(data) {
    return prisma.employee.create({
      data,
      include: {
        role: true,
        department: true,
      },
    });
  }

  async getDefaultRole() {
    return prisma.role.findFirst({
      where: { name: 'Employee' },
    });
  }
}

module.exports = new AuthRepository();
