const express = require('express');
const challengeController = require('../controllers/challenge.controller');
const authenticate = require('../../../middleware/authenticate.middleware');
const validate = require('../../../middleware/validate.middleware');
const {
  createChallengeSchema,
  updateChallengeSchema,
  queryChallengesSchema,
  challengeIdParamSchema,
} = require('../validators/challenge.validator');

const router = express.Router();

// All challenge routes require authentication
router.use(authenticate);

// Get all challenges with filtering
router.get('/', validate(queryChallengesSchema, 'query'), challengeController.getChallenges);

// Get a single challenge by ID
router.get('/:id', validate(challengeIdParamSchema, 'params'), challengeController.getChallengeById);

// Create a new challenge
router.post('/', validate(createChallengeSchema), challengeController.createChallenge);

// Update an existing challenge
router.patch(
  '/:id',
  validate(challengeIdParamSchema, 'params'),
  validate(updateChallengeSchema),
  challengeController.updateChallenge
);

// Delete an existing challenge
router.delete('/:id', validate(challengeIdParamSchema, 'params'), challengeController.deleteChallenge);

module.exports = router;
