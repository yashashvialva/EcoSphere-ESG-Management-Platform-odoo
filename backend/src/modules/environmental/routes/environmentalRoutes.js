const express = require('express');
const router = express.Router();
const emissionFactorController = require('../controllers/emissionFactorController');
const carbonTransactionController = require('../controllers/carbonTransactionController');
const esgGoalController = require('../controllers/esgGoalController');
const { validate } = require('../../../../middleware/validate');
const { authenticate } = require('../../../../middleware/auth');
const { authorize } = require('../../../../middleware/authorize');
const { createEmissionFactorSchema, updateEmissionFactorSchema } = require('../validators/emissionFactorValidator');
const { createCarbonTransactionSchema } = require('../validators/carbonTransactionValidator');
const { createEsgGoalSchema, updateEsgGoalSchema } = require('../validators/esgGoalValidator');

// Apply authentication to all routes
router.use(authenticate);

// Routes
router.get(
  '/emission-factors',
  authorize('environmental.read'),
  emissionFactorController.getAll
);

router.get(
  '/emission-factors/:id',
  authorize('environmental.read'),
  emissionFactorController.getById
);

router.post(
  '/emission-factors',
  authorize('environmental.manage'),
  validate(createEmissionFactorSchema),
  emissionFactorController.create
);

router.patch(
  '/emission-factors/:id',
  authorize('environmental.manage'),
  validate(updateEmissionFactorSchema),
  emissionFactorController.update
);

router.delete(
  '/emission-factors/:id',
  authorize('environmental.manage'),
  emissionFactorController.delete
);

// --- Carbon Transactions ---
router.get(
  '/carbon-transactions',
  authorize('environmental.read'),
  carbonTransactionController.getAll
);

router.post(
  '/carbon-transactions',
  authorize('environmental.manage'),
  validate(createCarbonTransactionSchema),
  carbonTransactionController.create
);

// --- ESG Goals ---
router.get(
  '/esg-goals',
  authorize('environmental.read'),
  esgGoalController.getAll
);

router.get(
  '/esg-goals/:id',
  authorize('environmental.read'),
  esgGoalController.getById
);

router.post(
  '/esg-goals',
  authorize('environmental.manage'),
  validate(createEsgGoalSchema),
  esgGoalController.create
);

router.patch(
  '/esg-goals/:id',
  authorize('environmental.manage'),
  validate(updateEsgGoalSchema),
  esgGoalController.update
);

router.delete(
  '/esg-goals/:id',
  authorize('environmental.manage'),
  esgGoalController.delete
);

module.exports = router;
