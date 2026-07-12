const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./modules/auth/routes/authRoutes');

const app = express();

// ─── Global Middleware ───────────────────────────────────────
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ────────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── API Routes ──────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);

// Module routes will be added here as they are built:
// app.use('/api/v1/environmental', environmentalRoutes);
// app.use('/api/v1/social', socialRoutes);
// app.use('/api/v1/governance', governanceRoutes);
// app.use('/api/v1/gamification', gamificationRoutes);
// app.use('/api/v1/dashboard', dashboardRoutes);
// app.use('/api/v1/reports', reportRoutes);
// app.use('/api/v1/settings', settingsRoutes);

// ─── 404 Handler ─────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route ${req.originalUrl} not found.`,
  });
});

// ─── Global Error Handler ────────────────────────────────────
app.use(errorHandler);

module.exports = app;
