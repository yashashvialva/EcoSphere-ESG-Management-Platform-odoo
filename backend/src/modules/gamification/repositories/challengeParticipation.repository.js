const prisma = require('../../../config/prisma');

class ChallengeParticipationRepository {
  async create(data) {
    return prisma.challengeParticipation.create({
      data,
      include: {
        challenge: true,
        employee: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async findByChallenge(challengeId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [total, data] = await Promise.all([
      prisma.challengeParticipation.count({ where: { challengeId } }),
      prisma.challengeParticipation.findMany({
        where: { challengeId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          employee: { select: { id: true, firstName: true, lastName: true } },
          reviewedBy: { select: { id: true, firstName: true, lastName: true } },
        }
      })
    ]);

    return { total, data, page, limit };
  }

  async findByEmployee(employeeId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      prisma.challengeParticipation.count({ where: { employeeId } }),
      prisma.challengeParticipation.findMany({
        where: { employeeId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          challenge: true,
          reviewedBy: { select: { id: true, firstName: true, lastName: true } },
        }
      })
    ]);

    return { total, data, page, limit };
  }

  async findUnique(challengeId, employeeId) {
    return prisma.challengeParticipation.findUnique({
      where: {
        challengeId_employeeId: {
          challengeId,
          employeeId,
        },
      },
      include: {
        challenge: true,
        employee: { select: { id: true, firstName: true, lastName: true, email: true } },
        reviewedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async findById(id) {
    return prisma.challengeParticipation.findUnique({
      where: { id },
      include: {
        challenge: true,
        employee: { select: { id: true, firstName: true, lastName: true, email: true } },
        reviewedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async update(id, data) {
    return prisma.challengeParticipation.update({
      where: { id },
      data,
      include: {
        challenge: true,
        employee: { select: { id: true, firstName: true, lastName: true } },
        reviewedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }
}

module.exports = new ChallengeParticipationRepository();
