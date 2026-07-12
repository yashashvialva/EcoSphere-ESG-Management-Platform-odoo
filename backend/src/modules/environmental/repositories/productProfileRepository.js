const prisma = require('../../../config/prisma');

class ProductProfileRepository {
  async findAll({ skip, take, departmentId }) {
    // ProductEsgProfile doesn't have departmentId, so we ignore the filter
    const [data, total] = await Promise.all([
      prisma.productEsgProfile.findMany({
        skip,
        take,
        orderBy: { productName: 'asc' },
        include: {
          emissionFactor: true,
        },
      }),
      prisma.productEsgProfile.count(),
    ]);

    // Map to the shape the frontend expects
    const mapped = data.map(p => ({
      id: p.id,
      name: p.productName,
      description: `Recyclable: ${p.recyclable ? 'Yes' : 'No'}, Rating: ${p.sustainabilityRating}/5`,
      lifecycle_status: p.recyclable ? 'ACTIVE' : 'DESIGN',
      carbon_footprint: p.emissionFactor ? Number(p.emissionFactor.factor) : 0,
      department: null,
      ...p,
    }));

    return { data: mapped, total };
  }

  async findById(id) {
    const profile = await prisma.productEsgProfile.findUnique({
      where: { id },
      include: {
        emissionFactor: true,
      },
    });
    
    if (profile) {
      return {
        ...profile,
        name: profile.productName,
        description: `Recyclable: ${profile.recyclable ? 'Yes' : 'No'}, Rating: ${profile.sustainabilityRating}/5`,
        department: null,
      };
    }
    
    return profile;
  }

  async create(data) {
    // Find a default emission factor or create a mapping
    let emissionFactorId = data.emissionFactorId;
    if (!emissionFactorId) {
      const defaultFactor = await prisma.emissionFactor.findFirst();
      emissionFactorId = defaultFactor?.id;
    }
    
    return prisma.productEsgProfile.create({
      data: {
        productName: data.name || data.productName,
        emissionFactorId: emissionFactorId,
        recyclable: data.recyclable || false,
        sustainabilityRating: data.sustainabilityRating || 0,
      },
      include: {
        emissionFactor: true,
      },
    });
  }

  async update(id, data) {
    const updateData = {};
    if (data.name !== undefined) updateData.productName = data.name;
    if (data.productName !== undefined) updateData.productName = data.productName;
    if (data.recyclable !== undefined) updateData.recyclable = data.recyclable;
    if (data.sustainabilityRating !== undefined) updateData.sustainabilityRating = data.sustainabilityRating;

    return prisma.productEsgProfile.update({
      where: { id },
      data: updateData,
      include: {
        emissionFactor: true,
      },
    });
  }

  async delete(id) {
    return prisma.productEsgProfile.delete({
      where: { id },
    });
  }
}

module.exports = new ProductProfileRepository();
