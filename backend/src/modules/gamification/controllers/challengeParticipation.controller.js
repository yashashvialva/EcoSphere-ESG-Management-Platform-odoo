const challengeParticipationService = require('../services/challengeParticipation.service');
const { success, created, paginated } = require('../../../shared/responses');

class ChallengeParticipationController {
  async joinChallenge(req, res, next) {
    try {
      const participation = await challengeParticipationService.joinChallenge(req.params.id, req.user.id);
      return created(res, participation, 'Successfully joined the challenge');
    } catch (error) {
      next(error);
    }
  }

  async submitProof(req, res, next) {
    try {
      const { proofFileUrl } = req.body;
      const participation = await challengeParticipationService.submitProof(req.params.id, req.user.id, proofFileUrl);
      return success(res, participation, 'Proof submitted successfully');
    } catch (error) {
      next(error);
    }
  }

  async approveParticipation(req, res, next) {
    try {
      const { employeeId } = req.body;
      const participation = await challengeParticipationService.approveParticipation(req.params.id, req.user.id, employeeId);
      return success(res, participation, 'Participation approved and XP awarded');
    } catch (error) {
      next(error);
    }
  }

  async rejectParticipation(req, res, next) {
    try {
      const { employeeId } = req.body;
      const participation = await challengeParticipationService.rejectParticipation(req.params.id, req.user.id, employeeId);
      return success(res, participation, 'Participation rejected');
    } catch (error) {
      next(error);
    }
  }

  async getParticipants(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await challengeParticipationService.getParticipants(
        req.params.id,
        Number(page || 1),
        Number(limit || 10)
      );
      return paginated(res, result.data, result.total, result.page, result.limit, 'Participants retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ChallengeParticipationController();
