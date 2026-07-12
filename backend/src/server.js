const app = require('./app');
const env = require('./config/env');
const logger = require('./shared/logger');

const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`EcoSphere API server running on port ${PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
  logger.info(`Health check: http://localhost:${PORT}/api/v1/health`);
});
