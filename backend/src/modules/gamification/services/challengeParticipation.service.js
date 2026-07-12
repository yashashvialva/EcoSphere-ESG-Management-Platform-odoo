const challengeParticipationRepository = require('../repositories/challengeParticipation.repository');
const challengeRepository = require('../repositories/challenge.repository');
const { NotFoundError, BusinessRuleError } = require('../../../shared/errors');
const xpService = require('../../../shared/services/xpService');
const {
  CHALLENGE_STATUS,
  CHALLENGE_APPROVAL_STATUS,
  XP_SOURCE_TYPE,
} = require('../constants/gamification.constants');

class ChallengeParticipationService {
  async joinChallenge(challengeId, employeeId) {
    const challenge = await challengeRepository.findById(challengeId);
    if (!challenge) {
      throw new NotFoundError('Challenge');
    }

    if (challenge.status !== CHALLENGE_STATUS.ACTIVE) {
      throw new BusinessRuleError('You can only join active challenges');
    }

    const existingParticipation = await challengeParticipationRepository.findUnique(challengeId, employeeId);
    if (existingParticipation) {
      throw new BusinessRuleError('You are already participating in this challenge');
    }

    return challengeParticipationRepository.create({
      challengeId,
      employeeId,
      progressPercentage: 0,
      approvalStatus: CHALLENGE_APPROVAL_STATUS.NOT_SUBMITTED,
    });
  }

  async submitProof(challengeId, employeeId, proofFileUrl) {
    const challenge = await challengeRepository.findById(challengeId);
    if (!challenge) {
      throw new NotFoundError('Challenge');
    }

    const participation = await challengeParticipationRepository.findUnique(challengeId, employeeId);
    if (!participation) {
      throw new BusinessRuleError('You must join the challenge before submitting proof');
    }

    if (participation.approvalStatus === CHALLENGE_APPROVAL_STATUS.APPROVED) {
      throw new BusinessRuleError('This challenge participation has already been approved');
    }

    if (challenge.evidenceRequired && !proofFileUrl) {
      throw new BusinessRuleError('Proof file URL is required for this challenge');
    }

    return challengeParticipationRepository.update(participation.id, {
      proofFileUrl: proofFileUrl || null,
      approvalStatus: CHALLENGE_APPROVAL_STATUS.PENDING,
      submittedAt: new Date(),
      progressPercentage: 100, // Complete progress upon submission
    });
  }

  async approveParticipation(idOrChallengeId, reviewerId, employeeId = null) {
    let participation;
    
    // Support finding by either participation ID or (challengeId + employeeId)
    if (employeeId) {
      participation = await challengeParticipationRepository.findUnique(idOrChallengeId, employeeId);
    } else {
      participation = await challengeParticipationRepository.findById(idOrChallengeId);
    }

    if (!participation) {
      throw new NotFoundError('Challenge participation');
    }

    if (participation.approvalStatus === CHALLENGE_APPROVAL_STATUS.APPROVED) {
      throw new BusinessRuleError('This challenge participation has already been approved');
    }

    // Set participation as approved
    const updated = await challengeParticipationRepository.update(participation.id, {
      approvalStatus: CHALLENGE_APPROVAL_STATUS.APPROVED,
      reviewedAt: new Date(),
      reviewedByEmployeeId: reviewerId,
      xpAwarded: participation.challenge.xpReward,
      completionDate: new Date(),
      progressPercentage: 100,
    });

    // Award XP
    // Note: This calls the shared XP service stub (from Developer 3 / Feature 3 setup)
    await xpService.awardXp(
      participation.employeeId,
      participation.challenge.xpReward,
      XP_SOURCE_TYPE.CHALLENGE,
      participation.challenge.id,
      `Challenge completed: ${participation.challenge.title}`
    );

    return updated;
  }

  async rejectParticipation(idOrChallengeId, reviewerId, employeeId = null) {
    let participation;
    
    // Support finding by either participation ID or (challengeId + employeeId)
    if (employeeId) {
      participation = await challengeParticipationRepository.findUnique(idOrChallengeId, employeeId);
    } else {
      participation = await challengeParticipationRepository.findById(idOrChallengeId);
    }

    if (!participation) {
      throw new NotFoundError('Challenge participation');
    }

    if (participation.approvalStatus === CHALLENGE_APPROVAL_STATUS.APPROVED) {
      throw new BusinessRuleError('Cannot reject an already approved participation');
    }

    return challengeParticipationRepository.update(participation.id, {
      approvalStatus: CHALLENGE_APPROVAL_STATUS.REJECTED,
      reviewedAt: new Date(),
      reviewedByEmployeeId: reviewerId,
    });
  }

  async getParticipants(challengeId, page, limit) {
    return challengeParticipationRepository.findByChallenge(challengeId, page, limit);
  }
}

module.exports = new ChallengeParticipationService();
