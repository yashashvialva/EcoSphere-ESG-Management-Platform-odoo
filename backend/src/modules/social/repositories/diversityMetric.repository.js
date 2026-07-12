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
      where.reportingDate = {};
      if (filters.startDate) where.reportingDate.gte = new Date(filters.startDate);
      if (filters.endDate) where.reportingDate.lte = new Date(filters.endDate);
    }

    return prisma.diversityMetric.findMany({
      where,
      include: { department: true },
      orderBy: { reportingDate: 'desc' }
    });
  }

  async getSummary(departmentId) {
    // This aggregates the most recent values per metricType and notes
    // We can do this in code or via Prisma's groupBy depending on requirements.
    // For simplicity, fetch all and group in service, or use Prisma groupBy.
    const where = departmentId ? { departmentId } : {};
    
    return prisma.diversityMetric.findMany({
      where,
      orderBy: { reportingDate: 'desc' }
    });
  }
}

module.exports = new DiversityMetricRepository();
