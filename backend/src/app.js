const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const requestId = require('./middleware/requestId.middleware');
const notFound = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');

// Module imports
const authRoutes = require('./modules/auth');
const governanceRoutes = require('./modules/governance');

const app = express();

// ─── Global Middleware ───────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(requestId);

// ─── Health Check ────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'EcoSphere API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─── API Routes ──────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/governance', governanceRoutes);
// Social module routes will be added in Milestone 2

// ─── Error Handling ──────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
