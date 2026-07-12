const rewardRepository = require('../repositories/reward.repository');
const rewardRedemptionRepository = require('../repositories/rewardRedemption.repository');
const xpService = require('../../../shared/services/xpService');
const prisma = require('../../../config/prisma');
const { NotFoundError, BusinessRuleError } = require('../../../shared/errors');

class RewardService {
  async getAllRewards(filters, page, limit) {
    return rewardRepository.findAll(filters, page, limit);
  }

  async getReward(id) {
    const reward = await rewardRepository.findById(id);
    if (!reward) {
      throw new NotFoundError('Reward');
    }
    return reward;
  }

  async getEmployeeRedemptions(employeeId, page, limit) {
    return rewardRedemptionRepository.findByEmployee(employeeId, page, limit);
  }

  async redeemReward(rewardId, employeeId) {
    // 1. Verify reward availability and employee XP
    const reward = await rewardRepository.findById(rewardId);
    if (!reward) {
      throw new NotFoundError('Reward');
    }
    
    if (reward.status !== 'ACTIVE' || reward.stock <= 0) {
      throw new BusinessRuleError('This reward is currently out of stock or inactive');
    }

    const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
    if (!employee) {
      throw new NotFoundError('Employee');
    }
    
    if (employee.totalXp < reward.pointsRequired) {
      throw new BusinessRuleError('Insufficient XP to redeem this reward');
    }

    // 2. Deduct XP via the shared XP service (operates in its own transaction)
    await xpService.deductXp(
      employeeId,
      reward.pointsRequired,
      'REWARD_REDEMPTION',
      reward.id,
      `Redeemed reward: ${reward.name}`
    );

    // 3. Log redemption and decrease stock in a transaction
    try {
      const redemption = await prisma.$transaction(async (tx) => {
        const newStock = reward.stock - 1;
        
        // Decrease stock and handle out-of-stock state
        await tx.reward.update({
          where: { id: rewardId },
          data: {
            stock: newStock,
            status: newStock === 0 ? 'OUT_OF_STOCK' : 'ACTIVE'
          }
        });

        // Create redemption log
        return tx.rewardRedemption.create({
          data: {
            employeeId,
            rewardId,
            pointsSpent: reward.pointsRequired,
            status: 'PENDING'
          },
          include: { reward: true }
        });
      });

      return redemption;
    } catch (error) {
      // 4. Compensating action: Refund XP if the redemption creation failed
      await xpService.awardXp(
        employeeId,
        reward.pointsRequired,
        'REWARD_REFUND',
        reward.id,
        `Refund for failed redemption of: ${reward.name}`
      );
      throw new Error(`Reward redemption failed and XP was refunded. Reason: ${error.message}`);
    }
  }
}

module.exports = new RewardService();
