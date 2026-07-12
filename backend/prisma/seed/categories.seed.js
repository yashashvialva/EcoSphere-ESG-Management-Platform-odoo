module.exports = async (prisma) => {
  console.log('Seeding categories...');

  const categories = [
    { name: 'Tree Plantation', type: 'CSR' },
    { name: 'Waste Cleanup', type: 'CSR' },
    { name: 'Education Volunteering', type: 'CSR' },
    { name: 'Zero Waste Week', type: 'CHALLENGE' },
    { name: 'Cycle to Work', type: 'CHALLENGE' },
    { name: 'Energy Saving', type: 'CHALLENGE' },
    { name: 'ESG Onboarding', type: 'TRAINING' },
    { name: 'Carbon Accounting Basics', type: 'TRAINING' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { 
        name_type: {
          name: cat.name,
          type: cat.type
        }
      },
      update: cat,
      create: cat,
    });
  }
};
