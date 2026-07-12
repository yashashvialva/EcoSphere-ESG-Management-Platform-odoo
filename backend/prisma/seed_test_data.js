const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Social Module test data...');

  // 1. Fetch core roles and departments
  const employeeRole = await prisma.role.findFirst({ where: { name: 'Employee' } });
  const itDept = await prisma.department.findFirst({ where: { code: 'IT-01' } });
  
  if (!employeeRole || !itDept) {
    throw new Error('Please run main seed first using "npm run prisma:seed"');
  }

  // 2. Clean up previous test data to prevent duplicates
  await prisma.diversityMetric.deleteMany({});
  await prisma.trainingCompletion.deleteMany({});
  await prisma.training.deleteMany({});
  await prisma.employeeParticipation.deleteMany({});
  await prisma.csrActivity.deleteMany({});
  await prisma.employee.deleteMany({
    where: {
      email: { in: ['john.doe@ecosphere.com', 'jane.smith@ecosphere.com'] }
    }
  });

  console.log('🧹 Cleaned up existing test data.');

  // 3. Create 2 test employees
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const john = await prisma.employee.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@ecosphere.com',
      passwordHash,
      roleId: employeeRole.id,
      departmentId: itDept.id,
      totalXp: 100
    }
  });

  const jane = await prisma.employee.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@ecosphere.com',
      passwordHash,
      roleId: employeeRole.id,
      departmentId: itDept.id,
      totalXp: 250
    }
  });

  console.log('👤 Created test employees: John Doe and Jane Smith');

  // 4. Fetch CSR category
  let csrCategory = await prisma.category.findFirst({ where: { name: 'Environment', type: 'CSR_ACTIVITY' } });
  if (!csrCategory) {
    csrCategory = await prisma.category.create({
      data: { name: 'Environment', type: 'CSR_ACTIVITY' }
    });
  }

  // 5. Create CSR Activities
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  await prisma.csrActivity.create({
    data: {
      title: 'Annual Tree Plantation Drive',
      description: 'Join us to plant 500 saplings in the city forest area. Bring water, gloves, and sunscreen!',
      startDate: today,
      endDate: nextWeek,
      maxPoints: 800,
      status: 'PUBLISHED',
      categoryId: csrCategory.id
    }
  });

  await prisma.csrActivity.create({
    data: {
      title: 'E-Waste Recycling Camp',
      description: 'Bring your old chargers, phones, and batteries to recycle them safely. Earn green points!',
      startDate: today,
      endDate: nextWeek,
      maxPoints: 1200,
      status: 'PUBLISHED',
      categoryId: csrCategory.id
    }
  });

  console.log('🌳 Seeded CSR activities.');

  // 6. Fetch Training category
  let trainingCategory = await prisma.category.findFirst({ where: { name: 'Education', type: 'TRAINING' } });
  if (!trainingCategory) {
    trainingCategory = await prisma.category.create({
      data: { name: 'Education', type: 'TRAINING' }
    });
  }

  // 7. Create Training Modules
  await prisma.training.create({
    data: {
      title: 'Introduction to ESG Principles',
      description: 'Learn the core concepts of Environmental, Social, and Governance criteria and why they matter to our business.',
      pointsAwarded: 500,
      status: 'ACTIVE',
      categoryId: trainingCategory.id
    }
  });

  await prisma.training.create({
    data: {
      title: 'Workspace Diversity and Inclusion',
      description: 'Understanding cultural differences, micro-aggressions, and fostering a collaborative workplace for all.',
      pointsAwarded: 400,
      status: 'ACTIVE',
      categoryId: trainingCategory.id
    }
  });

  console.log('📚 Seeded training modules.');

  // 8. Seed Diversity Metrics for IT department
  await prisma.diversityMetric.createMany({
    data: [
      {
        departmentId: itDept.id,
        metricType: 'Gender',
        metricValue: 42.00,
        totalPopulation: 100,
        reportingDate: today,
        notes: 'Female'
      },
      {
        departmentId: itDept.id,
        metricType: 'Gender',
        metricValue: 54.00,
        totalPopulation: 100,
        reportingDate: today,
        notes: 'Male'
      },
      {
        departmentId: itDept.id,
        metricType: 'Gender',
        metricValue: 4.00,
        totalPopulation: 100,
        reportingDate: today,
        notes: 'Non-Binary'
      }
    ]
  });

  console.log('📊 Seeded diversity metrics.');
  console.log('🚀 Social Module test data successfully seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
