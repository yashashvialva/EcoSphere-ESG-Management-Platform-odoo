const bcrypt = require('bcrypt');

module.exports = async (prisma) => {
  console.log('Seeding users...');

  // Get Roles
  const adminRole = await prisma.role.findUnique({ where: { name: 'Administrator' } });
  const employeeRole = await prisma.role.findUnique({ where: { name: 'Employee' } });
  
  // Get Departments
  const hqDept = await prisma.department.findUnique({ where: { code: 'HQ' } });
  const itDept = await prisma.department.findUnique({ where: { code: 'IT' } }) || hqDept;

  if (adminRole && hqDept) {
    const adminPassword = await bcrypt.hash('Admin@123', 12);
    
    await prisma.employee.upsert({
      where: { email: 'admin@ecosphere.com' },
      update: {
        passwordHash: adminPassword
      },
      create: {
        firstName: 'System',
        lastName: 'Admin',
        email: 'admin@ecosphere.com',
        passwordHash: adminPassword,
        departmentId: hqDept.id,
        roleId: adminRole.id,
        isActive: true
      },
    });
  }
  
  if (employeeRole && itDept) {
    const employeePassword = await bcrypt.hash('password123', 10);
    
    // John Doe
    await prisma.employee.upsert({
      where: { email: 'john.doe@ecosphere.com' },
      update: {
        passwordHash: employeePassword
      },
      create: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@ecosphere.com',
        passwordHash: employeePassword,
        departmentId: itDept.id,
        roleId: employeeRole.id,
        isActive: true,
        totalXp: 100
      },
    });

    // Jane Smith
    await prisma.employee.upsert({
      where: { email: 'jane.smith@ecosphere.com' },
      update: {
        passwordHash: employeePassword
      },
      create: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@ecosphere.com',
        passwordHash: employeePassword,
        departmentId: itDept.id,
        roleId: employeeRole.id,
        isActive: true,
        totalXp: 250
      },
    });
  }
};
