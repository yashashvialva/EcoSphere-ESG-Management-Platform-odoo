module.exports = async (prisma) => {
  console.log('Seeding emission factors...');

  const emissionFactors = [
    { source: 'Electricity (Grid)', unit: 'kWh', factor: 0.85, description: 'Average grid mix' },
    { source: 'Natural Gas', unit: 'm3', factor: 2.02, description: 'Stationary combustion' },
    { source: 'Diesel Fuel', unit: 'L', factor: 2.68, description: 'Mobile combustion' },
    { source: 'Air Travel (Short Haul)', unit: 'km', factor: 0.15, description: 'Domestic flights' },
    { source: 'Air Travel (Long Haul)', unit: 'km', factor: 0.11, description: 'International flights' },
    { source: 'Water Supply', unit: 'm3', factor: 0.34, description: 'Municipal water' },
    { source: 'Waste (Landfill)', unit: 'kg', factor: 0.58, description: 'General waste' },
    { source: 'Waste (Recycled)', unit: 'kg', factor: 0.02, description: 'Recycled materials' },
  ];

  for (const ef of emissionFactors) {
    const existingEf = await prisma.emissionFactor.findFirst({
      where: {
        source: ef.source,
        unit: ef.unit
      }
    });

    if (existingEf) {
      await prisma.emissionFactor.update({
        where: { id: existingEf.id },
        data: ef
      });
    } else {
      await prisma.emissionFactor.create({
        data: ef
      });
    }
  }
};
