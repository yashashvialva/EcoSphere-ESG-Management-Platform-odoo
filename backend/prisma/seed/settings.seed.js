module.exports = async (prisma) => {
  console.log('Seeding organization settings...');

  const settings = await prisma.organizationSetting.findFirst();

  if (!settings) {
    await prisma.organizationSetting.create({
      data: {
        organizationName: 'EcoSphere Corp',
        environmentalWeight: 40.0,
        socialWeight: 30.0,
        governanceWeight: 30.0,
        defaultCurrency: 'USD',
        timezone: 'UTC',
      },
    });
  }
};
