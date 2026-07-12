const prisma = require('../../../config/prisma');

class ProductProfileRepository {
  async findAll({ skip, take, departmentId }) {
    const where = {};
    if (departmentId) where.department_id = departmentId;

    const [data, total] = await Promise.all([
      prisma.productProfile.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: {
          department: true,
        },
      }),
      prisma.productProfile.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id) {
    return prisma.productProfile.findUnique({
      where: { id },
      include: {
        department: true,
      },
    });
  }

  async create(data) {
    return prisma.productProfile.create({
      data: {
        department_id: data.departmentId,
        name: data.name,
        description: data.description,
        lifecycle_status: 'DESIGN',
        carbon_footprint: 0,
      },
      include: {
        department: true,
      },
    });
  }

  async update(id, data) {
    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.lifecycleStatus !== undefined) updateData.lifecycle_status = data.lifecycleStatus;
    if (data.carbonFootprint !== undefined) updateData.carbon_footprint = data.carbonFootprint;

    return prisma.productProfile.update({
      where: { id },
      data: updateData,
      include: {
        department: true,
      },
    });
  }

  async delete(id) {
    return prisma.productProfile.delete({
      where: { id },
    });
  }
}

module.exports = new ProductProfileRepository();
