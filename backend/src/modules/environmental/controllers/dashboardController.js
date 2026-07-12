const dashboardService = require('../services/dashboardService');
const { ApiResponse } = require('../../../../shared/responses/apiResponse');

class DashboardController {
  async getDashboard(req, res, next) {
    try {
      const result = await dashboardService.getDashboardData(req.query, req.user);
      res.status(200).json(
        ApiResponse.success(result, 'Dashboard data retrieved successfully.')
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
