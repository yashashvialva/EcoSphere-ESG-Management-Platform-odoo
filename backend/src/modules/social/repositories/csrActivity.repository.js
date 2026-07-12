const prisma = require('../../../config/prisma');

class CsrActivityRepository {
  async create(data) {
    return prisma.csrActivity.create({
      data,
      include: {
        category: true
      }
    });
  }

  async findById(id) {
    return prisma.csrActivity.findUnique({
      where: { id },
      include: {
        category: true,
        _count: { select: { participations: true } }
      }
    });
  }

  async findAll(filters, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.categoryId) where.categoryId = filters.categoryId;

    const [total, data] = await Promise.all([
      prisma.csrActivity.count({ where }),
      prisma.csrActivity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: 'asc' },
        include: {
          category: true,
          _count: { select: { participations: true } }
        }
      })
    ]);

    return { total, data, page, limit };
  }

  async update(id, data) {
    return prisma.csrActivity.update({
      where: { id },
      data,
      include: { category: true }
    });
  }
}

module.exports = new CsrActivityRepository();
