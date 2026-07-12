const prisma = require('../../../config/prisma');
const { paginated } = require('../../../shared/responses');

class LeaderboardController {
  async getGlobalLeaderboard(req, res, next) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [total, data] = await Promise.all([
        // Assuming isActive exists on the Employee model, otherwise we just count all
        prisma.employee.count(),
        prisma.employee.findMany({
          orderBy: { totalXp: 'desc' },
          skip,
          take: limit,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            department: true,
            totalXp: true,
            currentLevel: true
          }
        })
      ]);

      return paginated(res, data, total, page, limit, 'Global leaderboard retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getMyXpLedger(req, res, next) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const [total, data] = await Promise.all([
        prisma.xpLedger.count({ where: { employeeId: req.user.id } }),
        prisma.xpLedger.findMany({
          where: { employeeId: req.user.id },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        })
      ]);

      return paginated(res, data, total, page, limit, 'XP Ledger history retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LeaderboardController();
