const badgeRepository = require('../repositories/badge.repository');
const employeeBadgeRepository = require('../repositories/employeeBadge.repository');
const { NotFoundError } = require('../../../shared/errors');

class BadgeService {
  async getAllBadges(filters, page, limit) {
    return badgeRepository.findAll(filters, page, limit);
  }

  async getBadgeById(id) {
    const badge = await badgeRepository.findById(id);
    if (!badge) {
      throw new NotFoundError('Badge');
    }
    return badge;
  }

  async getEmployeeBadges(employeeId, page, limit) {
    return employeeBadgeRepository.findByEmployee(employeeId, page, limit);
  }
}

module.exports = new BadgeService();
