const prisma = require('../../../config/prisma');

class RewardRepository {
  async create(data) {
    return prisma.reward.create({ data });
  }

  async findAll(filters = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where = {};
    
    if (filters.status) {
      where.status = filters.status;
    }
    
    if (filters.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }

    const [total, data] = await Promise.all([
      prisma.reward.count({ where }),
      prisma.reward.findMany({
        where,
        skip,
        take: limit,
        orderBy: { pointsRequired: 'asc' }
      })
    ]);

    return { total, data, page, limit };
  }

  async findById(id) {
    return prisma.reward.findUnique({ where: { id } });
  }

  async update(id, data) {
    return prisma.reward.update({
      where: { id },
      data
    });
  }
}

module.exports = new RewardRepository();
