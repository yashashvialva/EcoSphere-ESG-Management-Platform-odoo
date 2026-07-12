const prisma = require('../../../config/prisma');

class ChallengeRepository {
  async create(data) {
    return prisma.challenge.create({
      data,
      include: {
        category: true,
        createdBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async findById(id) {
    return prisma.challenge.findUnique({
      where: { id },
      include: {
        category: true,
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        _count: { select: { participations: true } },
      },
    });
  }

  async findAll(filters = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.difficulty) where.difficulty = filters.difficulty;
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      prisma.challenge.count({ where }),
      prisma.challenge.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          createdBy: { select: { id: true, firstName: true, lastName: true } },
          _count: { select: { participations: true } },
        },
      }),
    ]);

    return { total, data, page, limit };
  }

  async update(id, data) {
    return prisma.challenge.update({
      where: { id },
      data,
      include: {
        category: true,
        createdBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async delete(id) {
    return prisma.challenge.delete({
      where: { id }
    });
  }
}

module.exports = new ChallengeRepository();
