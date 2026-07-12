const diversityMetricService = require('../services/diversityMetric.service');
const { success, created } = require('../../../shared/responses');

class DiversityMetricController {
  async addMetric(req, res, next) {
    try {
      const metric = await diversityMetricService.addMetric(req.body);
      return created(res, metric, 'Diversity metric added successfully');
    } catch (error) {
      next(error);
    }
  }

  async getMetrics(req, res, next) {
    try {
      const { departmentId, metricType, startDate, endDate } = req.query;
      const metrics = await diversityMetricService.getMetrics({ departmentId, metricType, startDate, endDate });
      return success(res, metrics, 'Diversity metrics retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getDashboardSummary(req, res, next) {
    try {
      const { departmentId } = req.query;
      const summary = await diversityMetricService.getDashboardSummary(departmentId);
      return success(res, summary, 'Diversity dashboard summary retrieved');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DiversityMetricController();
