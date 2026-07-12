const diversityMetricRepository = require('../repositories/diversityMetric.repository');
const prisma = require('../../../config/prisma');
const { NotFoundError } = require('../../../shared/errors');

class DiversityMetricService {
  async addMetric(data) {
    const department = await prisma.department.findUnique({ where: { id: data.departmentId } });
    if (!department) throw new NotFoundError('Department not found');

    return diversityMetricRepository.create(data);
  }

  async getMetrics(filters) {
    return diversityMetricRepository.findAll(filters);
  }

  async getDashboardSummary(departmentId) {
    const allMetrics = await diversityMetricRepository.getSummary(departmentId);
    
    // Group the raw metrics by metricType and notes, keeping only the latest date
    const latestMetrics = {};

    allMetrics.forEach(metric => {
      const key = `${metric.metricType}_${metric.notes || 'General'}_${metric.departmentId}`;
      if (!latestMetrics[key]) {
        latestMetrics[key] = metric;
      } else {
        if (new Date(metric.reportingDate) > new Date(latestMetrics[key].reportingDate)) {
          latestMetrics[key] = metric;
        }
      }
    });

    return Object.values(latestMetrics);
  }
}

module.exports = new DiversityMetricService();
