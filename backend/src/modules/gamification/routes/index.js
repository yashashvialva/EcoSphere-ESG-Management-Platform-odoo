const express = require('express');
const challengeRoutes = require('./challenge.routes');
const leaderboardRoutes = require('./leaderboard.routes');
const badgeRoutes = require('./badge.routes');
const rewardRoutes = require('./reward.routes');

const router = express.Router();

// Challenge routes will be mounted in Milestone 2
router.use('/challenges', challengeRoutes);

// Badge routes will be mounted in Milestone 7 / 8
router.use('/badges', badgeRoutes);

// Reward routes will be mounted in Milestone 9 / 10
router.use('/rewards', rewardRoutes);

// Leaderboard routes will be mounted in Milestone 6
router.use('/leaderboard', leaderboardRoutes);

module.exports = router;
