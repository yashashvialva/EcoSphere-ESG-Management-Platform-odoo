const emissionFactorRepository = require('../repositories/emissionFactorRepository');
const { NotFoundError, ConflictError, AppError } = require('../../../../shared/errors/AppError');

class EmissionFactorService {
  async getEmissionFactors(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = query.search || '';

    const { data, total } = await emissionFactorRepository.findAll({ skip, take: limit, search });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async getEmissionFactorById(id) {
    const factor = await emissionFactorRepository.findById(id);
    if (!factor) {
      throw new NotFoundError('Emission Factor');
    }
    return factor;
  }

  async createEmissionFactor(data) {
    // Check if source+unit combination already exists
    const existing = await emissionFactorRepository.findBySourceAndUnit(data.source, data.unit);
    if (existing) {
      throw new ConflictError(`Emission factor for source '${data.source}' with unit '${data.unit}' already exists.`);
    }

    return emissionFactorRepository.create(data);
  }

  async updateEmissionFactor(id, data) {
    const factor = await emissionFactorRepository.findById(id);
    if (!factor) {
      throw new NotFoundError('Emission Factor');
    }

    // If updating source or unit, check for conflicts
    if ((data.source && data.source !== factor.source) || (data.unit && data.unit !== factor.unit)) {
      const sourceToCheck = data.source || factor.source;
      const unitToCheck = data.unit || factor.unit;
      
      const existing = await emissionFactorRepository.findBySourceAndUnit(sourceToCheck, unitToCheck);
      if (existing && existing.id !== id) {
        throw new ConflictError(`Emission factor for source '${sourceToCheck}' with unit '${unitToCheck}' already exists.`);
      }
    }

    return emissionFactorRepository.update(id, data);
  }

  async deleteEmissionFactor(id) {
    const factor = await emissionFactorRepository.findById(id);
    if (!factor) {
      throw new NotFoundError('Emission Factor');
    }

    try {
      await emissionFactorRepository.delete(id);
    } catch (error) {
      // Handle foreign key constraint errors
      if (error.code === 'P2003') {
        throw new AppError('Cannot delete emission factor because it is in use by carbon transactions or product profiles.', 409);
      }
      throw error;
    }
  }
}

module.exports = new EmissionFactorService();
