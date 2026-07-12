const challengeRepository = require('../repositories/challenge.repository');
const { NotFoundError, BusinessRuleError } = require('../../../shared/errors');
const {
  CHALLENGE_STATUS,
  CHALLENGE_STATUS_TRANSITIONS,
} = require('../constants/gamification.constants');

class ChallengeService {
  async createChallenge(data, creatorId) {
    if (data.startDate && data.deadline && new Date(data.startDate) >= new Date(data.deadline)) {
      throw new BusinessRuleError('Start date must be before the deadline');
    }

    return challengeRepository.create({
      ...data,
      createdByEmployeeId: creatorId,
      status: data.status || CHALLENGE_STATUS.DRAFT,
    });
  }

  async getChallenge(id) {
    const challenge = await challengeRepository.findById(id);
    if (!challenge) {
      throw new NotFoundError('Challenge');
    }
    return challenge;
  }

  async getAllChallenges(filters, page, limit) {
    return challengeRepository.findAll(filters, page, limit);
  }

  async updateChallenge(id, data) {
    const challenge = await challengeRepository.findById(id);
    if (!challenge) {
      throw new NotFoundError('Challenge');
    }

    if (data.startDate || data.deadline) {
      const newStart = data.startDate ? new Date(data.startDate) : challenge.startDate;
      const newDeadline = data.deadline ? new Date(data.deadline) : challenge.deadline;
      if (newStart && newDeadline && newStart >= newDeadline) {
        throw new BusinessRuleError('Start date must be before the deadline');
      }
    }

    // Validate status transitions
    if (data.status && data.status !== challenge.status) {
      const allowedTransitions = CHALLENGE_STATUS_TRANSITIONS[challenge.status] || [];
      if (!allowedTransitions.includes(data.status)) {
        throw new BusinessRuleError(`Cannot transition challenge status from ${challenge.status} to ${data.status}`);
      }
      
      // If archiving, set archivedAt timestamp
      if (data.status === CHALLENGE_STATUS.ARCHIVED) {
        data.archivedAt = new Date();
      }
    }

    return challengeRepository.update(id, data);
  }

  async deleteChallenge(id) {
    const challenge = await challengeRepository.findById(id);
    if (!challenge) {
      throw new NotFoundError('Challenge');
    }
    
    // Instead of hard deleting, we typically archive. But if DELETE is explicitly called:
    if (challenge.status !== CHALLENGE_STATUS.DRAFT) {
      throw new BusinessRuleError('Only DRAFT challenges can be deleted. Archive active challenges instead.');
    }

    return challengeRepository.delete(id);
  }
}

module.exports = new ChallengeService();
