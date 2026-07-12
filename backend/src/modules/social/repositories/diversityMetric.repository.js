const prisma = require('../../../config/prisma');

class DiversityMetricRepository {
  async create(data) {
    return prisma.diversityMetric.create({
      data,
      include: { department: true }
    });
  }

  async findAll(filters) {
    const where = {};
    if (filters.departmentId) where.departmentId = filters.departmentId;
    if (filters.metricType) where.metricType = filters.metricType;
    
    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = new Date(filters.startDate);
      if (filters.endDate) where.date.lte = new Date(filters.endDate);
    }

    return prisma.diversityMetric.findMany({
      where,
      include: { department: true },
      orderBy: { date: 'desc' }
    });
  }

  async getSummary(departmentId) {
    // This aggregates the most recent values per metricType and metricName
    // We can do this in code or via Prisma's groupBy depending on requirements.
    // For simplicity, fetch all and group in service, or use Prisma groupBy.
    const where = departmentId ? { departmentId } : {};
    
    return prisma.diversityMetric.findMany({
      where,
      orderBy: { date: 'desc' }
    });
  }
}

module.exports = new DiversityMetricRepository();
