module.exports = async (prisma) => {
  console.log('Seeding organization settings...');

  const settings = await prisma.organizationSetting.findFirst();

  if (!settings) {
    await prisma.organizationSetting.create({
      data: {
        name: 'EcoSphere Corp',
        env_weight: 40.0,
        soc_weight: 30.0,
        gov_weight: 30.0,
        industry: 'Technology',
        fiscal_start: '01-01',
      },
    });
  }
};
