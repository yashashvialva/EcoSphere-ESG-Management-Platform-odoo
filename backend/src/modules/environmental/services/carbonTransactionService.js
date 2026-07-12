const carbonTransactionRepository = require('../repositories/carbonTransactionRepository');
const emissionFactorRepository = require('../repositories/emissionFactorRepository');
const { NotFoundError, BadRequestError } = require('../../../../shared/errors/AppError');

class CarbonTransactionService {
  async getTransactions(query, user) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Dept Heads can only see their own department's transactions
    let departmentId = query.departmentId;
    if (user.roleName === 'Department Head') {
      departmentId = user.departmentId;
    }

    const { data, total } = await carbonTransactionRepository.findAll({
      skip,
      take: limit,
      departmentId,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async createTransaction(data, user) {
    // Dept Heads can only create for their own department
    if (user.roleName === 'Department Head' && data.departmentId !== user.departmentId) {
      throw new BadRequestError('You can only create transactions for your own department.');
    }

    // Fetch emission factor to auto-calculate emission value
    const factor = await emissionFactorRepository.findById(data.emissionFactorId);
    if (!factor) {
      throw new NotFoundError('Emission Factor');
    }

    if (!factor.is_active) {
      throw new BadRequestError('Cannot use an inactive emission factor.');
    }

    // Business rule: emission_value = quantity * factor
    const emissionValue = Number(data.quantity) * Number(factor.factor);

    return carbonTransactionRepository.create({
      ...data,
      emissionValue,
    });
  }
}

module.exports = new CarbonTransactionService();
