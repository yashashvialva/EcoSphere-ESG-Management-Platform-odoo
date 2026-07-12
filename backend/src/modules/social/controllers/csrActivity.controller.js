const csrActivityService = require('../services/csrActivity.service');
const { success, created, paginated } = require('../../../shared/responses');

class CsrActivityController {
  async createActivity(req, res, next) {
    try {
      const activity = await csrActivityService.createActivity(req.body, req.user.id);
      return created(res, activity, 'CSR Activity created successfully');
    } catch (error) {
      next(error);
    }
  }

  async getActivities(req, res, next) {
    try {
      const { status, categoryId, page, limit } = req.query;
      const result = await csrActivityService.getAllActivities(
        { status, categoryId }, 
        Number(page || 1), 
        Number(limit || 10)
      );
      
      return paginated(res, result.data, result.total, result.page, result.limit, 'CSR Activities retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getActivityById(req, res, next) {
    try {
      const activity = await csrActivityService.getActivity(req.params.id);
      return success(res, activity, 'CSR Activity retrieved');
    } catch (error) {
      next(error);
    }
  }

  async updateActivity(req, res, next) {
    try {
      const activity = await csrActivityService.updateActivity(req.params.id, req.body, req.user.id);
      return success(res, activity, 'CSR Activity updated');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CsrActivityController();
