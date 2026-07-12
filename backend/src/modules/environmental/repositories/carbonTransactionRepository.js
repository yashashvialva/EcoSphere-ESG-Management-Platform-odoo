const prisma = require('../../../../config/prisma');

class CarbonTransactionRepository {
  async findAll({ skip, take, departmentId, dateFrom, dateTo }) {
    const where = {};
    if (departmentId) where.department_id = departmentId;
    if (dateFrom || dateTo) {
      where.transaction_date = {};
      if (dateFrom) where.transaction_date.gte = new Date(dateFrom);
      if (dateTo) where.transaction_date.lte = new Date(dateTo);
    }

    const [data, total] = await Promise.all([
      prisma.carbonTransaction.findMany({
        where,
        skip,
        take,
        orderBy: { transaction_date: 'desc' },
        include: {
          emission_factor: true,
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
        emission_factor: true,
        department: true,
      },
    });
  }

  async create(data) {
    return prisma.carbonTransaction.create({
      data: {
        department_id: data.departmentId,
        emission_factor_id: data.emissionFactorId,
        source_type: data.sourceType,
        reference_id: data.referenceId,
        quantity: data.quantity,
        emission_value: data.emissionValue,
        transaction_date: new Date(data.transactionDate),
      },
      include: {
        emission_factor: true,
        department: true,
      },
    });
  }
}

module.exports = new CarbonTransactionRepository();
