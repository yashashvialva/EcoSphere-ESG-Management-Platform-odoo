const express = require('express');
const trainingController = require('../controllers/training.controller');
const authenticate = require('../../../middleware/authenticate.middleware');
const validate = require('../../../middleware/validate.middleware');
const { createTrainingSchema, updateTrainingSchema, completeTrainingSchema } = require('../validators/training.validator');

const router = express.Router();

router.use(authenticate);

router.get('/', trainingController.getTrainings);
router.post('/', validate(createTrainingSchema), trainingController.createTraining);
router.patch('/:id', validate(updateTrainingSchema), trainingController.updateTraining);
router.post('/:id/complete', validate(completeTrainingSchema), trainingController.completeTraining);

module.exports = router;
