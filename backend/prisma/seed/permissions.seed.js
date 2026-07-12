module.exports = async (prisma) => {
  console.log('Seeding permissions...');

  const permissions = [
    // Auth & Users
    { code: 'users.read', description: 'Read users', module: 'Auth' },
    { code: 'users.manage', description: 'Manage users', module: 'Auth' },
    
    // Environmental
    { code: 'environmental.read', description: 'Read environmental data', module: 'Environmental' },
    { code: 'environmental.manage', description: 'Manage environmental data', module: 'Environmental' },
    
    // Social
    { code: 'social.read', description: 'Read social data', module: 'Social' },
    { code: 'social.manage', description: 'Manage social data', module: 'Social' },
    { code: 'social.approve', description: 'Approve CSR participations', module: 'Social' },
    
    // Governance
    { code: 'governance.read', description: 'Read governance data', module: 'Governance' },
    { code: 'governance.manage', description: 'Manage governance data', module: 'Governance' },
    
    // Gamification
    { code: 'gamification.read', description: 'Read gamification data', module: 'Gamification' },
    { code: 'gamification.manage', description: 'Manage gamification data', module: 'Gamification' },
    { code: 'gamification.reward.redeem', description: 'Redeem rewards', module: 'Gamification' },
    
    // Reports
    { code: 'reports.read', description: 'View reports', module: 'Reports' },
    { code: 'reports.export', description: 'Export reports', module: 'Reports' },
    
    // Settings
    { code: 'settings.manage', description: 'Manage organization settings', module: 'Settings' }
  ];

  for (const perm of permissions) {
    const action = perm.code.split('.').pop();
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: { ...perm, action },
      create: { ...perm, action },
    });
  }
};
