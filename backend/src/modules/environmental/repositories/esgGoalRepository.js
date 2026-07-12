const prisma = require('../../../config/prisma');

class EsgGoalRepository {
  async findAll({ skip, take, departmentId }) {
    const where = {};
    if (departmentId) where.department_id = departmentId;

    const [data, total] = await Promise.all([
      prisma.esgGoal.findMany({
        where,
        skip,
        take,
        orderBy: { deadline: 'asc' },
        include: {
          department: true,
        },
      }),
      prisma.esgGoal.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id) {
    return prisma.esgGoal.findUnique({
      where: { id },
      include: {
        department: true,
      },
    });
  }

  async create(data) {
    return prisma.esgGoal.create({
      data: {
        department_id: data.departmentId,
        target_value: data.targetValue,
        current_value: 0,
        unit: data.unit,
        deadline: new Date(data.deadline),
        description: data.description,
        status: 'ON_TRACK',
      },
      include: {
        department: true,
      },
    });
  }

  async update(id, data) {
    const updateData = {};
    if (data.targetValue !== undefined) updateData.target_value = data.targetValue;
    if (data.currentValue !== undefined) updateData.current_value = data.currentValue;
    if (data.unit !== undefined) updateData.unit = data.unit;
    if (data.deadline !== undefined) updateData.deadline = new Date(data.deadline);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;

    return prisma.esgGoal.update({
      where: { id },
      data: updateData,
      include: {
        department: true,
      },
    });
  }

  async delete(id) {
    return prisma.esgGoal.delete({
      where: { id },
    });
  }
}

module.exports = new EsgGoalRepository();
