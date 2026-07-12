const prisma = require('../../../config/prisma');

class EmissionFactorRepository {
  async findAll({ skip, take, search }) {
    const where = search
      ? {
          OR: [
            { source: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.emissionFactor.findMany({
        where,
        skip,
        take,
        orderBy: { source: 'asc' },
      }),
      prisma.emissionFactor.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id) {
    return prisma.emissionFactor.findUnique({
      where: { id },
    });
  }

  async findBySourceAndUnit(source, unit) {
    return prisma.emissionFactor.findFirst({
      where: { source, unit },
    });
  }

  async create(data) {
    return prisma.emissionFactor.create({
      data: {
        source: data.source,
        unit: data.unit,
        factor: data.factor,
        description: data.description,
      },
    });
  }

  async update(id, data) {
    return prisma.emissionFactor.update({
      where: { id },
      data: {
        source: data.source,
        unit: data.unit,
        factor: data.factor,
        description: data.description,
        isActive: data.isActive,
      },
    });
  }

  async delete(id) {
    return prisma.emissionFactor.delete({
      where: { id },
    });
  }
}

module.exports = new EmissionFactorRepository();
