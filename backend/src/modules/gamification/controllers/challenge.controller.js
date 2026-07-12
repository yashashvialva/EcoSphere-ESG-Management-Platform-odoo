const challengeService = require('../services/challenge.service');
const { success, created, paginated, noContent } = require('../../../shared/responses');

class ChallengeController {
  async createChallenge(req, res, next) {
    try {
      const challenge = await challengeService.createChallenge(req.body, req.user.id);
      return created(res, challenge, 'Challenge created successfully');
    } catch (error) {
      next(error);
    }
  }

  async getChallenges(req, res, next) {
    try {
      const { status, difficulty, categoryId, search, page, limit } = req.query;
      const result = await challengeService.getAllChallenges(
        { status, difficulty, categoryId, search },
        Number(page || 1),
        Number(limit || 10)
      );
      return paginated(res, result.data, result.total, result.page, result.limit, 'Challenges retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getChallengeById(req, res, next) {
    try {
      const challenge = await challengeService.getChallenge(req.params.id);
      return success(res, challenge, 'Challenge retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateChallenge(req, res, next) {
    try {
      const challenge = await challengeService.updateChallenge(req.params.id, req.body);
      return success(res, challenge, 'Challenge updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteChallenge(req, res, next) {
    try {
      await challengeService.deleteChallenge(req.params.id);
      return noContent(res, 'Challenge deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ChallengeController();
