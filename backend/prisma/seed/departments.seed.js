module.exports = async (prisma) => {
  console.log('Seeding departments...');

  const departments = [
    { name: 'Headquarters', code: 'HQ' },
    { name: 'Manufacturing', code: 'MFG' },
    { name: 'Logistics', code: 'LOG' },
    { name: 'Sales & Marketing', code: 'SM' },
    { name: 'Research & Development', code: 'RND' },
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { code: dept.code },
      update: dept,
      create: dept,
    });
  }
};
