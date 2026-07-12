const trainingService = require('../services/training.service');
const { success, created } = require('../../../shared/responses');

class TrainingController {
  async createTraining(req, res, next) {
    try {
      const training = await trainingService.createTraining(req.body);
      return created(res, training, 'Training created successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateTraining(req, res, next) {
    try {
      const training = await trainingService.updateTraining(req.params.id, req.body);
      return success(res, training, 'Training updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getTrainings(req, res, next) {
    try {
      const trainings = await trainingService.getAllTrainings();
      return success(res, trainings, 'Trainings retrieved');
    } catch (error) {
      next(error);
    }
  }

  async completeTraining(req, res, next) {
    try {
      const { id } = req.params;
      const { score } = req.body;
      const completion = await trainingService.completeTraining(req.user.id, id, score);
      return created(res, completion, 'Training completed successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TrainingController();
