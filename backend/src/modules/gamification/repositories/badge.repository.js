const prisma = require('../../../config/prisma');

class BadgeRepository {
  async create(data) {
    return prisma.badge.create({ data });
  }

  async findAll(filters = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    // Default to only showing active badges unless explicitly specified
    const where = {
      ...(filters.isActive !== undefined ? { isActive: filters.isActive } : { isActive: true }),
    };

    if (filters.unlockMetric) {
      where.unlockMetric = filters.unlockMetric;
    }

    const [total, data] = await Promise.all([
      prisma.badge.count({ where }),
      prisma.badge.findMany({
        where,
        skip,
        take: limit,
        orderBy: { unlockValue: 'asc' }
      })
    ]);

    return { total, data, page, limit };
  }

  async findById(id) {
    return prisma.badge.findUnique({ where: { id } });
  }

  async update(id, data) {
    return prisma.badge.update({
      where: { id },
      data
    });
  }
}

module.exports = new BadgeRepository();
