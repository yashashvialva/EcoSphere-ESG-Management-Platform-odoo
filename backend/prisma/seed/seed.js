const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seedPermissions = require('./permissions.seed');
const seedRoles = require('./roles.seed');
const seedDepartments = require('./departments.seed');
const seedUsers = require('./users.seed');
const seedCategories = require('./categories.seed');
const seedSettings = require('./settings.seed');
const seedEmissionFactors = require('./emission-factors.seed');

async function main() {
  console.log('Starting seed process...');

  try {
    await seedPermissions(prisma);
    await seedRoles(prisma);
    await seedDepartments(prisma);
    await seedUsers(prisma);
    await seedCategories(prisma);
    await seedSettings(prisma);
    await seedEmissionFactors(prisma);

    console.log('Seed process completed successfully.');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
