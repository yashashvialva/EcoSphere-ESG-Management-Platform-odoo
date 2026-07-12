const bcrypt = require('bcrypt');

module.exports = async (prisma) => {
  console.log('Seeding users...');

  // Get Admin Role
  const adminRole = await prisma.role.findUnique({ where: { name: 'Administrator' } });
  
  // Get HQ Department
  const hqDept = await prisma.department.findUnique({ where: { code: 'HQ' } });

  if (adminRole && hqDept) {
    const passwordHash = await bcrypt.hash('Admin@123', 12);
    
    await prisma.employee.upsert({
      where: { email: 'admin@ecosphere.com' },
      update: {
        password_hash: passwordHash
      },
      create: {
        first_name: 'System',
        last_name: 'Admin',
        email: 'admin@ecosphere.com',
        password_hash: passwordHash,
        department_id: hqDept.id,
        role_id: adminRole.id,
        is_active: true
      },
    });
  }
};
