const productProfileRepository = require('../repositories/productProfileRepository');
const { NotFoundError, BadRequestError } = require('../../../shared/errors/AppError');

class ProductProfileService {
  async getProfiles(query, user) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Dept Heads can only see their own department's profiles
    let departmentId = query.departmentId;
    if (user.roleName === 'Department Head') {
      departmentId = user.departmentId;
    }

    const { data, total } = await productProfileRepository.findAll({
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

  async getProfileById(id) {
    const profile = await productProfileRepository.findById(id);
    if (!profile) {
      throw new NotFoundError('Product Profile');
    }
    return profile;
  }

  async createProfile(data, user) {
    if (user.roleName === 'Department Head' && data.departmentId !== user.departmentId) {
      throw new BadRequestError('You can only create product profiles for your own department.');
    }
    return productProfileRepository.create(data);
  }

  async updateProfile(id, data, user) {
    const profile = await productProfileRepository.findById(id);
    if (!profile) {
      throw new NotFoundError('Product Profile');
    }

    if (user.roleName === 'Department Head' && profile.department_id !== user.departmentId) {
      throw new BadRequestError('You can only update product profiles for your own department.');
    }

    return productProfileRepository.update(id, data);
  }

  async deleteProfile(id, user) {
    const profile = await productProfileRepository.findById(id);
    if (!profile) {
      throw new NotFoundError('Product Profile');
    }

    if (user.roleName === 'Department Head' && profile.department_id !== user.departmentId) {
      throw new BadRequestError('You can only delete product profiles for your own department.');
    }

    return productProfileRepository.delete(id);
  }
}

module.exports = new ProductProfileService();
