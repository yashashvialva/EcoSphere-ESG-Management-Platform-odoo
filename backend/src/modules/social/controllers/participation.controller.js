const participationService = require('../services/participation.service');
const { success, created } = require('../../../shared/responses');

class ParticipationController {
  async joinActivity(req, res, next) {
    try {
      const { activityId, proofUrl } = req.body;
      const participation = await participationService.joinActivity(req.user.id, activityId, proofUrl);
      return created(res, participation, 'Successfully joined CSR Activity');
    } catch (error) {
      next(error);
    }
  }

  async evaluateParticipation(req, res, next) {
    try {
      const { id } = req.params;
      const { status, pointsAwarded } = req.body;
      const result = await participationService.evaluateParticipation(id, status, pointsAwarded, req.user.id);
      return success(res, result, `Participation ${status.toLowerCase()} successfully`);
    } catch (error) {
      next(error);
    }
  }

  async getActivityParticipations(req, res, next) {
    try {
      const { activityId } = req.params;
      const participations = await participationService.getParticipationsForActivity(activityId);
      return success(res, participations, 'Participations retrieved');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ParticipationController();
