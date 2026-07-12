const prisma = require('../../config/prisma');

/**
 * Shared XP Service.
 * Provides transactional methods to award and deduct XP.
 * Used by Gamification and Social modules.
 */

const awardXp = async (employeeId, points, sourceType, sourceId, description) => {
  const result = await prisma.$transaction(async (tx) => {
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

  // 4. Automatically evaluate badges after XP is awarded (outside the main transaction to prevent long locks)
  await evaluateBadges(employeeId);

  return result;
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
  // 1. Get current employee XP
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: { id: true, totalXp: true }
  });

  if (!employee) return [];

  // 2. Fetch all active XP-based badges
  const xpBadges = await prisma.badge.findMany({
    where: { unlockMetric: 'TOTAL_XP', isActive: true },
    orderBy: { unlockValue: 'asc' }
  });

  if (xpBadges.length === 0) return [];

  // 3. Fetch badges the employee already has
  const existingBadges = await prisma.employeeBadge.findMany({
    where: { employeeId },
    select: { badgeId: true }
  });
  const existingBadgeIds = new Set(existingBadges.map(b => b.badgeId));

  const newlyAwarded = [];

  // 4. Evaluate each badge
  for (const badge of xpBadges) {
    if (!existingBadgeIds.has(badge.id)) {
      let isEligible = false;
      const requiredXp = parseFloat(badge.unlockValue.toString());
      const currentXp = employee.totalXp;

      if (badge.unlockOperator === '>=') isEligible = currentXp >= requiredXp;
      else if (badge.unlockOperator === '>') isEligible = currentXp > requiredXp;
      else if (badge.unlockOperator === '==') isEligible = currentXp === requiredXp;

      if (isEligible) {
        // Award the badge (inside a transaction to handle bonus XP if applicable)
        const awarded = await prisma.$transaction(async (tx) => {
          const empBadge = await tx.employeeBadge.create({
            data: {
              employeeId,
              badgeId: badge.id,
              triggerMetricValue: currentXp,
              sourceType: 'XP_EVALUATION'
            },
            include: { badge: true }
          });

          // Handle Bonus XP
          if (badge.bonusXp > 0) {
            const updatedEmp = await tx.employee.update({
              where: { id: employeeId },
              data: { totalXp: { increment: badge.bonusXp } }
            });

            await tx.xpLedger.create({
              data: {
                employeeId,
                transactionType: 'CREDIT',
                points: badge.bonusXp,
                sourceType: 'BADGE_BONUS',
                sourceId: empBadge.id,
                description: `Bonus XP for earning badge: ${badge.name}`,
                balanceAfter: updatedEmp.totalXp
              }
            });
          }
          return empBadge;
        });

        newlyAwarded.push(awarded);
      }
    }
  }

  return newlyAwarded;
};

module.exports = {
  awardXp,
  deductXp,
  evaluateBadges,
};
