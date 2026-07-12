const prisma = require('../../../config/prisma');

// Map environmental status strings to our GoalStatus enum values
const STATUS_MAP = {
  'ON_TRACK': 'ACTIVE',
  'AT_RISK': 'ACTIVE',
  'ACHIEVED': 'COMPLETED',
  'MISSED': 'EXPIRED',
};

const REVERSE_STATUS_MAP = {
  'DRAFT': 'ON_TRACK',
  'ACTIVE': 'ON_TRACK',
  'COMPLETED': 'ACHIEVED',
  'EXPIRED': 'MISSED',
};

class EsgGoalRepository {
  async findAll({ skip, take, departmentId }) {
    const where = {};
    if (departmentId) where.departmentId = departmentId;

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

    // Map the response to include environmental-style fields
    const mapped = data.map(g => ({
      ...g,
      target_value: g.targetValue,
      current_value: g.achievedValue,
      status: REVERSE_STATUS_MAP[g.status] || g.status,
    }));

    return { data: mapped, total };
  }

  async findById(id) {
    const goal = await prisma.esgGoal.findUnique({
      where: { id },
      include: {
        department: true,
      },
    });
    
    if (goal) {
      goal.target_value = goal.targetValue;
      goal.current_value = goal.achievedValue;
      goal.status = REVERSE_STATUS_MAP[goal.status] || goal.status;
    }
    
    return goal;
  }

  async create(data) {
    return prisma.esgGoal.create({
      data: {
        departmentId: data.departmentId,
        title: data.description || 'ESG Goal',
        targetValue: data.targetValue,
        achievedValue: 0,
        deadline: new Date(data.deadline),
        status: 'ACTIVE',
      },
      include: {
        department: true,
      },
    });
  }

  async update(id, data) {
    const updateData = {};
    if (data.targetValue !== undefined) updateData.targetValue = data.targetValue;
    if (data.currentValue !== undefined) updateData.achievedValue = data.currentValue;
    if (data.unit !== undefined) updateData.title = data.unit; // store unit info in title if needed
    if (data.deadline !== undefined) updateData.deadline = new Date(data.deadline);
    if (data.description !== undefined) updateData.title = data.description;
    if (data.status !== undefined) updateData.status = STATUS_MAP[data.status] || data.status;

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
