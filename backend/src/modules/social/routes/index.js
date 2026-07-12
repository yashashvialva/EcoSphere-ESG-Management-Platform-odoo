const express = require('express');
const csrActivityRoutes = require('./csrActivity.routes');

const router = express.Router();

// Mount CSR Activity routes
router.use('/csr-activities', csrActivityRoutes);

// Other social module routes will be added here in future milestones
// router.use('/participation', participationRoutes);
// router.use('/training', trainingRoutes);
// router.use('/diversity-metrics', diversityMetricRoutes);

module.exports = router;
