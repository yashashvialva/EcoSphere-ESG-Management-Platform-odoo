const csrActivityRepository = require('../repositories/csrActivity.repository');
const { NotFoundError, BusinessRuleError } = require('../../../shared/errors');
const { CSR_STATUS } = require('../constants/csr.constants');

class CsrActivityService {
  async createActivity(data, organizerId) {
    if (new Date(data.startDate) >= new Date(data.endDate)) {
      throw new BusinessRuleError('Start date must be before end date');
    }

    return csrActivityRepository.create({
      ...data,
      organizerId,
      status: CSR_STATUS.DRAFT
    });
  }

  async updateActivity(id, data, employeeId) {
    const activity = await csrActivityRepository.findById(id);
    
    if (!activity) {
      throw new NotFoundError('CSR Activity not found');
    }

    // Only organizer or admins can update (Admin check would normally happen in middleware, but ensuring organizer here)
    // For hackathon, assuming any authorized user passed from controller is valid or handling it via roles.
    
    // Status transitions
    if (data.status && data.status !== activity.status) {
      if (activity.status === CSR_STATUS.COMPLETED || activity.status === CSR_STATUS.CANCELLED) {
        throw new BusinessRuleError(`Cannot change status of a ${activity.status} activity`);
      }
    }

    return csrActivityRepository.update(id, data);
  }

  async getActivity(id) {
    const activity = await csrActivityRepository.findById(id);
    if (!activity) {
      throw new NotFoundError('CSR Activity not found');
    }
    return activity;
  }

  async getAllActivities(filters, page, limit) {
    return csrActivityRepository.findAll(filters, page, limit);
  }
}

module.exports = new CsrActivityService();
