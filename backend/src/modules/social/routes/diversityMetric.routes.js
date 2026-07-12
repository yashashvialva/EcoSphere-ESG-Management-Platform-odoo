const express = require('express');
const diversityMetricController = require('../controllers/diversityMetric.controller');
const authenticate = require('../../../middleware/authenticate.middleware');
const validate = require('../../../middleware/validate.middleware');
const { createDiversityMetricSchema, queryDiversityMetricsSchema } = require('../validators/diversityMetric.validator');

const router = express.Router();

router.use(authenticate);

// Note: In a real app, adding metrics would be restricted by 'authorize' middleware to HR/Admins
router.post('/', validate({ body: createDiversityMetricSchema }), diversityMetricController.addMetric);
router.get('/', validate({ query: queryDiversityMetricsSchema }), diversityMetricController.getMetrics);
router.get('/summary', diversityMetricController.getDashboardSummary);

module.exports = router;
