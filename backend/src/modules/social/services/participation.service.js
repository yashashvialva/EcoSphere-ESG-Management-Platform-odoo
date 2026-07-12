const participationRepository = require('../repositories/participation.repository');
const csrActivityRepository = require('../repositories/csrActivity.repository');
const { BusinessRuleError, NotFoundError } = require('../../../shared/errors');
const { APPROVAL_STATUS, CSR_STATUS } = require('../constants/csr.constants');
const { awardXp } = require('../../../shared/services/xpService');
const notificationService = require('../../../shared/notifications/notificationService');
const prisma = require('../../../config/prisma'); // Required for fetching Org Settings

class ParticipationService {
  async joinActivity(employeeId, csrActivityId, proofUrl) {
    // 1. Check if activity exists and is open
    const activity = await csrActivityRepository.findById(csrActivityId);
    if (!activity) throw new NotFoundError('CSR Activity not found');
    if (activity.status !== CSR_STATUS.PUBLISHED) {
      throw new BusinessRuleError('Activity is not open for participation');
    }

    // 2. Check if already joined
    const existing = await participationRepository.findUnique(employeeId, csrActivityId);
    if (existing) {
      throw new BusinessRuleError('You have already joined this activity');
    }

    // 4. Evidence requirement check
    const orgSettings = await prisma.organizationSetting.findFirst();
    if (orgSettings?.csrEvidenceRequired && !proofUrl) {
      throw new BusinessRuleError('Proof of participation is required by organization settings');
    }

    // 5. Create
    return participationRepository.create({
      employeeId,
      csrActivityId,
      proofFile: proofUrl
    });
  }

  async evaluateParticipation(participationId, status, customPoints, evaluatorId) {
    const participation = await participationRepository.findById(participationId);
    if (!participation) throw new NotFoundError('Participation record not found');
    if (participation.approvalStatus !== APPROVAL_STATUS.PENDING) {
      throw new BusinessRuleError(`Participation is already ${participation.approvalStatus}`);
    }

    const points = customPoints !== undefined ? customPoints : participation.csrActivity.maxPoints;

    // Perform DB update
    const updated = await participationRepository.updateStatus(participationId, status, status === APPROVAL_STATUS.APPROVED ? points : null);

    // Side effects (using stubs from M1)
    if (status === APPROVAL_STATUS.APPROVED) {
      await awardXp(participation.employeeId, points, `Approved participation in ${participation.csrActivity.title}`);
      await notificationService.createNotification({
        employeeId: participation.employeeId,
        type: 'CSR_APPROVED',
        title: 'CSR Participation Approved',
        message: `Your participation in ${participation.csrActivity.title} was approved. You earned ${points} XP!`,
        relatedEntityType: 'CSR_ACTIVITY',
        relatedEntityId: participation.csrActivityId
      });
    } else {
      await notificationService.createNotification({
        employeeId: participation.employeeId,
        type: 'CSR_REJECTED',
        title: 'CSR Participation Rejected',
        message: `Your participation in ${participation.csrActivity.title} was rejected.`,
        relatedEntityType: 'CSR_ACTIVITY',
        relatedEntityId: participation.csrActivityId
      });
    }

    return updated;
  }

  async getParticipationsForActivity(activityId) {
    return participationRepository.findAllByActivity(activityId);
  }
}

module.exports = new ParticipationService();
