const express = require('express');
const csrActivityController = require('../controllers/csrActivity.controller');
const authenticate = require('../../../middleware/authenticate.middleware');
const validate = require('../../../middleware/validate.middleware');
const { createCsrActivitySchema, updateCsrActivitySchema, queryCsrActivitiesSchema } = require('../validators/csr.validator');

const router = express.Router();

// All CSR routes require authentication
router.use(authenticate);

// Get all CSR activities with filtering and pagination
router.get('/', validate({ query: queryCsrActivitiesSchema }), csrActivityController.getActivities);

// Get a single CSR activity by ID
router.get('/:id', csrActivityController.getActivityById);

// Create a new CSR activity
router.post('/', validate({ body: createCsrActivitySchema }), csrActivityController.createActivity);

// Update a CSR activity
router.patch('/:id', validate({ body: updateCsrActivitySchema }), csrActivityController.updateActivity);

module.exports = router;
