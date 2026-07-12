const express = require('express');
const router = express.Router();
const emissionFactorController = require('../controllers/emissionFactorController');
const carbonTransactionController = require('../controllers/carbonTransactionController');
const esgGoalController = require('../controllers/esgGoalController');
const productProfileController = require('../controllers/productProfileController');
const { validate } = require('../../../../middleware/validate');
const { authenticate } = require('../../../../middleware/auth');
const { authorize } = require('../../../../middleware/authorize');
const { createEmissionFactorSchema, updateEmissionFactorSchema } = require('../validators/emissionFactorValidator');
const { createCarbonTransactionSchema } = require('../validators/carbonTransactionValidator');
const { createEsgGoalSchema, updateEsgGoalSchema } = require('../validators/esgGoalValidator');
const { createProductProfileSchema, updateProductProfileSchema } = require('../validators/productProfileValidator');

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

// --- Product Profiles ---
router.get(
  '/product-profiles',
  authorize('environmental.read'),
  productProfileController.getAll
);

router.get(
  '/product-profiles/:id',
  authorize('environmental.read'),
  productProfileController.getById
);

router.post(
  '/product-profiles',
  authorize('environmental.manage'),
  validate(createProductProfileSchema),
  productProfileController.create
);

router.patch(
  '/product-profiles/:id',
  authorize('environmental.manage'),
  validate(updateProductProfileSchema),
  productProfileController.update
);

router.delete(
  '/product-profiles/:id',
  authorize('environmental.manage'),
  productProfileController.delete
);

module.exports = router;
