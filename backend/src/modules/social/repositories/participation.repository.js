const prisma = require('../../../config/prisma');

class ParticipationRepository {
  async create(data) {
    return prisma.employeeParticipation.create({
      data,
      include: {
        csrActivity: true,
        employee: { select: { id: true, firstName: true, lastName: true } }
      }
    });
  }

  async findUnique(employeeId, csrActivityId) {
    return prisma.employeeParticipation.findUnique({
      where: {
        employeeId_csrActivityId: {
          employeeId,
          csrActivityId
        }
      }
    });
  }

  async findById(id) {
    return prisma.employeeParticipation.findUnique({
      where: { id },
      include: {
        csrActivity: true,
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
        csrActivity: true,
        employee: true
      }
    });
  }

  async findAllByActivity(csrActivityId) {
    return prisma.employeeParticipation.findMany({
      where: { csrActivityId },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true } }
      }
    });
  }
}

module.exports = new ParticipationRepository();
