const emissionFactorService = require('../services/emissionFactorService');
const { ApiResponse } = require('../../../shared/responses/apiResponse');

class EmissionFactorController {
  async getAll(req, res, next) {
    try {
      const result = await emissionFactorService.getEmissionFactors(req.query);
      res.status(200).json(
        ApiResponse.paginated(
          result.data,
          result.total,
          result.page,
          result.limit,
          'Emission factors retrieved successfully.'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const result = await emissionFactorService.getEmissionFactorById(req.params.id);
      res.status(200).json(
        ApiResponse.success(result, 'Emission factor retrieved successfully.')
      );
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const result = await emissionFactorService.createEmissionFactor(req.body);
      res.status(201).json(
        ApiResponse.success(result, 'Emission factor created successfully.', 201)
      );
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const result = await emissionFactorService.updateEmissionFactor(req.params.id, req.body);
      res.status(200).json(
        ApiResponse.success(result, 'Emission factor updated successfully.')
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await emissionFactorService.deleteEmissionFactor(req.params.id);
      res.status(200).json(
        ApiResponse.success(null, 'Emission factor deleted successfully.')
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmissionFactorController();
