const prisma = require('../../../config/prisma');

class TrainingRepository {
  async create(data) {
    return prisma.training.create({
      data,
      include: { category: true }
    });
  }

  async findById(id) {
    return prisma.training.findUnique({
      where: { id },
      include: { category: true }
    });
  }

  async findAll() {
    return prisma.training.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async update(id, data) {
    return prisma.training.update({
      where: { id },
      data,
      include: { category: true }
    });
  }

  // Completions
  async createCompletion(employeeId, trainingId, score) {
    return prisma.trainingCompletion.create({
      data: {
        employeeId,
        trainingId,
        score,
        status: 'COMPLETED',
        completionPercentage: 100.00,
        completedAt: new Date()
      }
    });
  }

  async findCompletion(employeeId, trainingId) {
    return prisma.trainingCompletion.findUnique({
      where: {
        employeeId_trainingId: { employeeId, trainingId }
      }
    });
  }

  async getCompletionsForTraining(trainingId) {
    return prisma.trainingCompletion.findMany({
      where: { trainingId },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true } }
      }
    });
  }
}

module.exports = new TrainingRepository();
