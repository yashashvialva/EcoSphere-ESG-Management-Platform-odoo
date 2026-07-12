const express = require('express');
const challengeController = require('../controllers/challenge.controller');
const challengeParticipationController = require('../controllers/challengeParticipation.controller');
const authenticate = require('../../../middleware/authenticate.middleware');
const authorize = require('../../../middleware/authorize.middleware');
const validate = require('../../../middleware/validate.middleware');
const {
  createChallengeSchema,
  updateChallengeSchema,
  queryChallengesSchema,
  challengeIdParamSchema,
} = require('../validators/challenge.validator');
const {
  submitParticipationSchema,
  reviewParticipationSchema,
  queryParticipationSchema,
} = require('../validators/challengeParticipation.validator');

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

// ==========================================
// CHALLENGE PARTICIPATION ROUTES
// ==========================================

// Get participants for a challenge
router.get(
  '/:id/participants',
  validate(challengeIdParamSchema, 'params'),
  validate(queryParticipationSchema, 'query'),
  challengeParticipationController.getParticipants
);

// Join a challenge
router.post(
  '/:id/join',
  validate(challengeIdParamSchema, 'params'),
  challengeParticipationController.joinChallenge
);

// Submit proof for a challenge
router.post(
  '/:id/submit',
  validate(challengeIdParamSchema, 'params'),
  validate(submitParticipationSchema),
  challengeParticipationController.submitProof
);

// Approve a participation (requires MANAGER or ADMIN role)
router.patch(
  '/:id/approve',
  authorize('MANAGER', 'ADMIN'), // NOTE: Uses the authorize middleware
  validate(challengeIdParamSchema, 'params'),
  validate(reviewParticipationSchema),
  challengeParticipationController.approveParticipation
);

// Reject a participation (requires MANAGER or ADMIN role)
router.patch(
  '/:id/reject',
  authorize('MANAGER', 'ADMIN'),
  validate(challengeIdParamSchema, 'params'),
  validate(reviewParticipationSchema),
  challengeParticipationController.rejectParticipation
);

module.exports = router;
