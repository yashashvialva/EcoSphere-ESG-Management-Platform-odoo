const esgGoalService = require('../services/esgGoalService');
const { ApiResponse } = require('../../../shared/responses/apiResponse');

class EsgGoalController {
  async getAll(req, res, next) {
    try {
      const result = await esgGoalService.getGoals(req.query, req.user);
      res.status(200).json(
        ApiResponse.paginated(
          result.data,
          result.total,
          result.page,
          result.limit,
          'ESG Goals retrieved successfully.'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const result = await esgGoalService.getGoalById(req.params.id);
      res.status(200).json(
        ApiResponse.success(result, 'ESG Goal retrieved successfully.')
      );
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const result = await esgGoalService.createGoal(req.body, req.user);
      res.status(201).json(
        ApiResponse.success(result, 'ESG Goal created successfully.', 201)
      );
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const result = await esgGoalService.updateGoal(req.params.id, req.body, req.user);
      res.status(200).json(
        ApiResponse.success(result, 'ESG Goal updated successfully.')
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await esgGoalService.deleteGoal(req.params.id, req.user);
      res.status(200).json(
        ApiResponse.success(null, 'ESG Goal deleted successfully.')
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EsgGoalController();
