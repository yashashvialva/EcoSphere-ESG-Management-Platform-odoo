const express = require('express');
const rewardController = require('../controllers/reward.controller');
const authenticate = require('../../../middleware/authenticate.middleware');

const router = express.Router();

router.use(authenticate);

// Get the reward catalog
router.get('/', rewardController.getAllRewards);

// Get current user's redemptions
router.get('/my-redemptions', rewardController.getMyRedemptions);

// Get specific reward details
router.get('/:id', rewardController.getRewardById);

// Redeem a reward
router.post('/:id/redeem', rewardController.redeemReward);

module.exports = router;
