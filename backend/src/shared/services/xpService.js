const prisma = require('../../config/prisma');

/**
 * Shared XP Service.
 * Provides transactional methods to award and deduct XP.
 * Used by Gamification and Social modules.
 */

const awardXp = async (employeeId, points, sourceType, sourceId, description) => {
  return prisma.$transaction(async (tx) => {
    // 1. Get current employee to ensure they exist and get current XP
    const employee = await tx.employee.findUnique({
      where: { id: employeeId },
      select: { id: true, totalXp: true }
    });

    if (!employee) {
      throw new Error(`Employee with ID ${employeeId} not found`);
    }

    const newTotalXp = employee.totalXp + points;

    // 2. Update employee total XP
    await tx.employee.update({
      where: { id: employeeId },
      data: { totalXp: newTotalXp }
    });

    // 3. Create secure XP Ledger audit entry
    const ledgerEntry = await tx.xpLedger.create({
      data: {
        employeeId,
        transactionType: 'CREDIT',
        points,
        sourceType,
        sourceId,
        description,
        balanceAfter: newTotalXp
      }
    });

    return ledgerEntry;
  });
};

const deductXp = async (employeeId, points, sourceType, sourceId, description) => {
  return prisma.$transaction(async (tx) => {
    // 1. Get current employee
    const employee = await tx.employee.findUnique({
      where: { id: employeeId },
      select: { id: true, totalXp: true }
    });

    if (!employee) {
      throw new Error(`Employee with ID ${employeeId} not found`);
    }

    // Floor XP at 0 (prevent negative XP)
    const newTotalXp = Math.max(0, employee.totalXp - points);
    const actualPointsDeducted = employee.totalXp - newTotalXp;

    // 2. Update employee total XP
    await tx.employee.update({
      where: { id: employeeId },
      data: { totalXp: newTotalXp }
    });

    // 3. Create XP Ledger audit entry
    const ledgerEntry = await tx.xpLedger.create({
      data: {
        employeeId,
        transactionType: 'DEBIT',
        points: actualPointsDeducted,
        sourceType,
        sourceId,
        description,
        balanceAfter: newTotalXp
      }
    });

    return ledgerEntry;
  });
};

const evaluateBadges = async (employeeId) => {
  // Stub for now. Will be implemented in Milestone 7.
  console.log(`🎖️ [BADGE STUB] Evaluating badges for employee ${employeeId}`);
  return [];
};

module.exports = {
  awardXp,
  deductXp,
  evaluateBadges,
};
