const prisma = require('../../../config/prisma');

class ParticipationRepository {
  async create(data) {
    return prisma.employeeParticipation.create({
      data,
      include: {
        activity: true,
        employee: { select: { id: true, firstName: true, lastName: true } }
      }
    });
  }

  async findUnique(employeeId, activityId) {
    return prisma.employeeParticipation.findUnique({
      where: {
        employeeId_activityId: {
          employeeId,
          activityId
        }
      }
    });
  }

  async findById(id) {
    return prisma.employeeParticipation.findUnique({
      where: { id },
      include: {
        activity: true,
        employee: true
      }
    });
  }

  async updateStatus(id, status, pointsAwarded) {
    return prisma.employeeParticipation.update({
      where: { id },
      data: {
        approvalStatus: status,
        pointsEarned: pointsAwarded
      },
      include: {
        activity: true,
        employee: true
      }
    });
  }

  async findAllByActivity(activityId) {
    return prisma.employeeParticipation.findMany({
      where: { activityId },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true } }
      }
    });
  }
}

module.exports = new ParticipationRepository();
