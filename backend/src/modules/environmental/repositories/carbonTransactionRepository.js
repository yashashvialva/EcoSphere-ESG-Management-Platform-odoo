const prisma = require('../../../config/prisma');

class CarbonTransactionRepository {
  async findAll({ skip, take, departmentId, dateFrom, dateTo }) {
    const where = {};
    if (departmentId) where.departmentId = departmentId;
    if (dateFrom || dateTo) {
      where.transactionDate = {};
      if (dateFrom) where.transactionDate.gte = new Date(dateFrom);
      if (dateTo) where.transactionDate.lte = new Date(dateTo);
    }

    const [data, total] = await Promise.all([
      prisma.carbonTransaction.findMany({
        where,
        skip,
        take,
        orderBy: { transactionDate: 'desc' },
        include: {
          emissionFactor: true,
          department: true,
        },
      }),
      prisma.carbonTransaction.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id) {
    return prisma.carbonTransaction.findUnique({
      where: { id },
      include: {
        emissionFactor: true,
        department: true,
      },
    });
  }

  async create(data) {
    return prisma.carbonTransaction.create({
      data: {
        departmentId: data.departmentId,
        emissionFactorId: data.emissionFactorId,
        sourceType: data.sourceType,
        referenceId: data.referenceId,
        quantity: data.quantity,
        emissionValue: data.emissionValue,
        transactionDate: new Date(data.transactionDate),
      },
      include: {
        emissionFactor: true,
        department: true,
      },
    });
  }
}

module.exports = new CarbonTransactionRepository();
