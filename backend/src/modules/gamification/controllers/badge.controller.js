const badgeService = require('../services/badge.service');
const { success, paginated } = require('../../../shared/responses');

class BadgeController {
  async getAllBadges(req, res, next) {
    try {
      const { isActive, unlockMetric, page, limit } = req.query;
      
      const filters = {};
      if (isActive !== undefined) filters.isActive = isActive === 'true';
      if (unlockMetric) filters.unlockMetric = unlockMetric;

      const result = await badgeService.getAllBadges(
        filters,
        Number(page || 1),
        Number(limit || 10)
      );

      return paginated(res, result.data, result.total, result.page, result.limit, 'Badges retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getBadgeById(req, res, next) {
    try {
      const badge = await badgeService.getBadgeById(req.params.id);
      return success(res, badge, 'Badge retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getMyBadges(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await badgeService.getEmployeeBadges(
        req.user.id,
        Number(page || 1),
        Number(limit || 10)
      );

      return paginated(res, result.data, result.total, result.page, result.limit, 'My badges retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BadgeController();
