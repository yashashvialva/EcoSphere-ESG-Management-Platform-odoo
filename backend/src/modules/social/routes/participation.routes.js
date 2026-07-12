const express = require('express');
const participationController = require('../controllers/participation.controller');
const authenticate = require('../../../middleware/authenticate.middleware');
const validate = require('../../../middleware/validate.middleware');
const { createParticipationSchema, evaluateParticipationSchema } = require('../validators/participation.validator');

const router = express.Router();

router.use(authenticate);

// Employee joins an activity
router.post('/', validate({ body: createParticipationSchema }), participationController.joinActivity);

// Get all participations for an activity
router.get('/activity/:activityId', participationController.getActivityParticipations);

// Admin/Organizer evaluates a participation (Approves/Rejects)
router.patch('/:id/evaluate', validate({ body: evaluateParticipationSchema }), participationController.evaluateParticipation);

module.exports = router;
