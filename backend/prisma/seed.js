const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'Administrator' },
    update: {},
    create: {
      name: 'Administrator',
      description: 'System Administrator with full access',
      isSystemRole: true,
    },
  });

  const employeeRole = await prisma.role.upsert({
    where: { name: 'Employee' },
    update: {},
    create: {
      name: 'Employee',
      description: 'Standard employee',
      isSystemRole: true,
    },
  });

  // 2. Organization Settings
  const orgSettings = await prisma.organizationSetting.create({
    data: {
      organizationName: 'EcoSphere Corp',
      environmentalWeight: 40,
      socialWeight: 30,
      governanceWeight: 30,
    },
  });

  // 3. Departments
  const hqDept = await prisma.department.upsert({
    where: { code: 'HQ-01' },
    update: {},
    create: {
      name: 'Headquarters',
      code: 'HQ-01',
    },
  });

  const itDept = await prisma.department.upsert({
    where: { code: 'IT-01' },
    update: {},
    create: {
      name: 'Information Technology',
      code: 'IT-01',
      parentDepartmentId: hqDept.id,
    },
  });

  // 4. Admin User
  const adminPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.employee.upsert({
    where: { email: 'admin@ecosphere.com' },
    update: {},
    create: {
      firstName: 'System',
      lastName: 'Admin',
      email: 'admin@ecosphere.com',
      passwordHash: adminPassword,
      roleId: adminRole.id,
      departmentId: hqDept.id,
    },
  });

  // 5. Categories
  await prisma.category.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Environment', type: 'CSR_ACTIVITY' },
      { name: 'Community', type: 'CSR_ACTIVITY' },
      { name: 'Education', type: 'TRAINING' },
      { name: 'Compliance', type: 'TRAINING' },
      { name: 'Sustainability', type: 'CHALLENGE' },
    ],
  });

  console.log('Seeding complete!');
  console.log('Admin credentials: admin@ecosphere.com / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
