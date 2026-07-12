const rewardService = require('../services/reward.service');
const { success, created, paginated } = require('../../../shared/responses');

class RewardController {
  async getAllRewards(req, res, next) {
    try {
      const { status, search, page, limit } = req.query;
      const filters = {};
      
      if (status) filters.status = status;
      if (search) filters.search = search;

      const result = await rewardService.getAllRewards(
        filters,
        Number(page || 1),
        Number(limit || 10)
      );

      return paginated(res, result.data, result.total, result.page, result.limit, 'Rewards retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getRewardById(req, res, next) {
    try {
      const reward = await rewardService.getReward(req.params.id);
      return success(res, reward, 'Reward retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getMyRedemptions(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await rewardService.getEmployeeRedemptions(
        req.user.id,
        Number(page || 1),
        Number(limit || 10)
      );

      return paginated(res, result.data, result.total, result.page, result.limit, 'My redemptions retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async redeemReward(req, res, next) {
    try {
      const redemption = await rewardService.redeemReward(req.params.id, req.user.id);
      return created(res, redemption, 'Reward redeemed successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RewardController();
