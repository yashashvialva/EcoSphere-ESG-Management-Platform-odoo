const prisma = require('../../../config/prisma');

class RewardRedemptionRepository {
  async create(data) {
    return prisma.rewardRedemption.create({
      data,
      include: { reward: true }
    });
  }

  async findByEmployee(employeeId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      prisma.rewardRedemption.count({ where: { employeeId } }),
      prisma.rewardRedemption.findMany({
        where: { employeeId },
        skip,
        take: limit,
        include: { reward: true },
        orderBy: { redeemedAt: 'desc' }
      })
    ]);

    return { total, data, page, limit };
  }
  
  async findById(id) {
    return prisma.rewardRedemption.findUnique({
      where: { id },
      include: { 
        reward: true, 
        employee: { select: { id: true, firstName: true, lastName: true } } 
      }
    });
  }

  async update(id, data) {
    return prisma.rewardRedemption.update({
      where: { id },
      data,
      include: { reward: true }
    });
  }
}

module.exports = new RewardRedemptionRepository();
