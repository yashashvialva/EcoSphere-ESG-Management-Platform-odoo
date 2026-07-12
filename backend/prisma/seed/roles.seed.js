module.exports = async (prisma) => {
  console.log('Seeding roles...');

  const rolesData = [
    { name: 'Administrator', description: 'Full system access' },
    { name: 'ESG Manager', description: 'Manages ESG modules across organization' },
    { name: 'Department Head', description: 'Manages department specific ESG data' },
    { name: 'Auditor', description: 'Read-only access and audit rights' },
    { name: 'Employee', description: 'Basic access to participate in ESG initiatives' },
  ];

  for (const roleData of rolesData) {
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: roleData,
      create: roleData,
    });
    
    // Assign permissions to Employee role as an example
    if (role.name === 'Employee') {
      const perms = await prisma.permission.findMany({
        where: {
          code: {
             in: ['gamification.reward.redeem', 'gamification.read', 'environmental.read', 'social.read', 'social.approve']
          }
        }
      });
      
      for (const p of perms) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: p.id
            }
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: p.id
          }
        });
      }
    }
  }
};
