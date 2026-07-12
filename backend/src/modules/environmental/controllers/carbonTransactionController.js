const carbonTransactionService = require('../services/carbonTransactionService');
const { ApiResponse } = require('../../../../shared/responses/apiResponse');

class CarbonTransactionController {
  async getAll(req, res, next) {
    try {
      const result = await carbonTransactionService.getTransactions(req.query, req.user);
      res.status(200).json(
        ApiResponse.paginated(
          result.data,
          result.total,
          result.page,
          result.limit,
          'Carbon transactions retrieved successfully.'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const result = await carbonTransactionService.createTransaction(req.body, req.user);
      res.status(201).json(
        ApiResponse.success(result, 'Carbon transaction recorded successfully.', 201)
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CarbonTransactionController();
