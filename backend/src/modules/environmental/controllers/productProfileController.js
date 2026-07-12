const productProfileService = require('../services/productProfileService');
const { ApiResponse } = require('../../../../shared/responses/apiResponse');

class ProductProfileController {
  async getAll(req, res, next) {
    try {
      const result = await productProfileService.getProfiles(req.query, req.user);
      res.status(200).json(
        ApiResponse.paginated(
          result.data,
          result.total,
          result.page,
          result.limit,
          'Product Profiles retrieved successfully.'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const result = await productProfileService.getProfileById(req.params.id);
      res.status(200).json(
        ApiResponse.success(result, 'Product Profile retrieved successfully.')
      );
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const result = await productProfileService.createProfile(req.body, req.user);
      res.status(201).json(
        ApiResponse.success(result, 'Product Profile created successfully.', 201)
      );
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const result = await productProfileService.updateProfile(req.params.id, req.body, req.user);
      res.status(200).json(
        ApiResponse.success(result, 'Product Profile updated successfully.')
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await productProfileService.deleteProfile(req.params.id, req.user);
      res.status(200).json(
        ApiResponse.success(null, 'Product Profile deleted successfully.')
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductProfileController();
