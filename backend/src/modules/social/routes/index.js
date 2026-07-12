const express = require('express');
const csrActivityRoutes = require('./csrActivity.routes');
const participationRoutes = require('./participation.routes');
const trainingRoutes = require('./training.routes');
const diversityMetricRoutes = require('./diversityMetric.routes');

const router = express.Router();

// Mount all Social Module routes
router.use('/csr-activities', csrActivityRoutes);
router.use('/participation', participationRoutes);
router.use('/training', trainingRoutes);
router.use('/diversity-metrics', diversityMetricRoutes);

module.exports = router;
