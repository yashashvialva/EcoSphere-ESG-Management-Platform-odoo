const trainingRepository = require('../repositories/training.repository');
const { NotFoundError, BusinessRuleError } = require('../../../shared/errors');
const { CSR_STATUS } = require('../constants/csr.constants');
const { awardXp } = require('../../../shared/services/xpService');
const notificationService = require('../../../shared/notifications/notificationService');

class TrainingService {
  async createTraining(data) {
    return trainingRepository.create({
      ...data,
      status: CSR_STATUS.DRAFT
    });
  }

  async updateTraining(id, data) {
    const training = await trainingRepository.findById(id);
    if (!training) throw new NotFoundError('Training not found');
    return trainingRepository.update(id, data);
  }

  async getAllTrainings() {
    return trainingRepository.findAll();
  }

  async completeTraining(employeeId, trainingId, score) {
    const training = await trainingRepository.findById(trainingId);
    if (!training) throw new NotFoundError('Training not found');
    if (training.status !== 'ACTIVE') {
      throw new BusinessRuleError('Can only complete active trainings');
    }

    const existing = await trainingRepository.findCompletion(employeeId, trainingId);
    if (existing) {
      throw new BusinessRuleError('You have already completed this training');
    }

    const completion = await trainingRepository.createCompletion(employeeId, trainingId, score);

    // Side effect: Award XP
    if (training.pointsAwarded > 0) {
      await awardXp(employeeId, training.pointsAwarded, `Completed Training: ${training.title}`);
      await notificationService.createNotification({
        employeeId,
        type: 'TRAINING_COMPLETED',
        title: 'Training Completed',
        message: `You completed ${training.title} and earned ${training.pointsAwarded} XP!`,
        relatedEntityType: 'TRAINING',
        relatedEntityId: trainingId
      });
    }

    return completion;
  }
}

module.exports = new TrainingService();
