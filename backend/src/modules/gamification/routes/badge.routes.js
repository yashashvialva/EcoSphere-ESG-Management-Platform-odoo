const express = require('express');
const badgeController = require('../controllers/badge.controller');
const authenticate = require('../../../middleware/authenticate.middleware');

const router = express.Router();

router.use(authenticate);

// Get all badge templates
router.get('/', badgeController.getAllBadges);

// Get the current user's earned badges
router.get('/my-badges', badgeController.getMyBadges);

// Get a specific badge template
router.get('/:id', badgeController.getBadgeById);

module.exports = router;
