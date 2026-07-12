const prisma = require('../../../config/prisma');

class EmployeeBadgeRepository {
  async awardBadge(data) {
    return prisma.employeeBadge.create({
      data,
      include: { badge: true }
    });
  }

  async findByEmployee(employeeId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      prisma.employeeBadge.count({ where: { employeeId } }),
      prisma.employeeBadge.findMany({
        where: { employeeId },
        skip,
        take: limit,
        include: { badge: true },
        orderBy: { awardedAt: 'desc' }
      })
    ]);

    return { total, data, page, limit };
  }

  async checkHasBadge(employeeId, badgeId) {
    const existing = await prisma.employeeBadge.findFirst({
      where: { employeeId, badgeId }
    });
    return !!existing;
  }
}

module.exports = new EmployeeBadgeRepository();
