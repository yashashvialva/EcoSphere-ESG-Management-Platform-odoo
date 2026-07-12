const esgGoalRepository = require('../repositories/esgGoalRepository');
const { NotFoundError, BadRequestError } = require('../../../shared/errors/AppError');

class EsgGoalService {
  async getGoals(query, user) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Dept Heads can only see their own department's goals
    let departmentId = query.departmentId;
    if (user.roleName === 'Department Head') {
      departmentId = user.departmentId;
    }

    const { data, total } = await esgGoalRepository.findAll({
      skip,
      take: limit,
      departmentId,
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async getGoalById(id) {
    const goal = await esgGoalRepository.findById(id);
    if (!goal) {
      throw new NotFoundError('ESG Goal');
    }
    return goal;
  }

  async createGoal(data, user) {
    if (user.roleName === 'Department Head' && data.departmentId !== user.departmentId) {
      throw new BadRequestError('You can only create goals for your own department.');
    }
    return esgGoalRepository.create(data);
  }

  async updateGoal(id, data, user) {
    const goal = await esgGoalRepository.findById(id);
    if (!goal) {
      throw new NotFoundError('ESG Goal');
    }

    if (user.roleName === 'Department Head' && goal.department_id !== user.departmentId) {
      throw new BadRequestError('You can only update goals for your own department.');
    }

    return esgGoalRepository.update(id, data);
  }

  async deleteGoal(id, user) {
    const goal = await esgGoalRepository.findById(id);
    if (!goal) {
      throw new NotFoundError('ESG Goal');
    }

    if (user.roleName === 'Department Head' && goal.department_id !== user.departmentId) {
      throw new BadRequestError('You can only delete goals for your own department.');
    }

    return esgGoalRepository.delete(id);
  }
}

module.exports = new EsgGoalService();
