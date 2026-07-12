const express = require('express');
const leaderboardController = require('../controllers/leaderboard.controller');
const authenticate = require('../../../middleware/authenticate.middleware');

const router = express.Router();

// Ensure all endpoints are authenticated
router.use(authenticate);

// GET /api/v1/gamification/leaderboard -> Get global employee rankings by XP
router.get('/', leaderboardController.getGlobalLeaderboard);

// GET /api/v1/gamification/leaderboard/my-ledger -> Get current user's XP transaction history
router.get('/my-ledger', leaderboardController.getMyXpLedger);

module.exports = router;
