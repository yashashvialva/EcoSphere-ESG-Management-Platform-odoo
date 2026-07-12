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

  // 6. Badges (Gamification)
  await prisma.badge.upsert({
    where: { name: 'Bronze Achiever' },
    update: {},
    create: {
      name: 'Bronze Achiever',
      description: 'Awarded for accumulating 500 XP.',
      unlockMetric: 'TOTAL_XP',
      unlockOperator: '>=',
      unlockValue: 500,
      bonusXp: 50
    }
  });
  await prisma.badge.upsert({
    where: { name: 'Silver Achiever' },
    update: {},
    create: {
      name: 'Silver Achiever',
      description: 'Awarded for accumulating 1500 XP.',
      unlockMetric: 'TOTAL_XP',
      unlockOperator: '>=',
      unlockValue: 1500,
      bonusXp: 150
    }
  });

  // 7. Rewards (Gamification)
  const existingReward = await prisma.reward.findFirst({ where: { name: 'Eco Coffee Mug' } });
  if (!existingReward) {
    await prisma.reward.createMany({
      data: [
        { name: 'Eco Coffee Mug', description: 'Reusable bamboo coffee mug with company logo.', pointsRequired: 500, stock: 50 },
        { name: 'Extra WFH Day', description: 'Redeem an extra Work From Home day.', pointsRequired: 2000, stock: 10 },
        { name: '$50 Sustainable Store Card', description: 'Digital gift card for sustainable stores.', pointsRequired: 5000, stock: 5 },
      ]
    });
  }

  // 8. Challenges (Gamification)
  const sustainabilityCategory = await prisma.category.findFirst({
    where: { name: 'Sustainability', type: 'CHALLENGE' },
  });

  if (sustainabilityCategory) {
    await prisma.challenge.upsert({
      where: { id: 'c101c101-c101-c101-c101-c101c101c101' },
      update: {},
      create: {
        id: 'c101c101-c101-c101-c101-c101c101c101',
        title: 'Zero Waste Week',
        description: 'Go a full week without using single-use plastics. Upload a picture of your reusable setup.',
        categoryId: sustainabilityCategory.id,
        xpReward: 150,
        difficulty: 'MEDIUM',
        evidenceRequired: true,
        startDate: new Date(),
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
        status: 'ACTIVE',
        createdByEmployeeId: adminUser.id,
      }
    });

    await prisma.challenge.upsert({
      where: { id: 'c202c202-c202-c202-c202-c202c202c202' },
      update: {},
      create: {
        id: 'c202c202-c202-c202-c202-c202c202c202',
        title: 'Energy Saver Month',
        description: 'Turn off all unnecessary lights and monitors at the end of the day for a month.',
        categoryId: sustainabilityCategory.id,
        xpReward: 300,
        difficulty: 'EASY',
        evidenceRequired: false,
        startDate: new Date(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
        status: 'ACTIVE',
        createdByEmployeeId: adminUser.id,
      }
    });
  }

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
