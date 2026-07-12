/**
 * XP Service stub.
 * Owned by Developer 4 (Gamification), consumed by Social module.
 * These stubs follow the shared service contract and will be replaced.
 */

const awardXp = async (employeeId, points, sourceType, sourceId, description) => {
  console.log(`🏆 [XP STUB] Award ${points} XP to ${employeeId} | Source: ${sourceType} | ${description}`);
  // TODO: Replace with actual XP ledger credit + employee balance update
  return {
    id: 'stub-xp-ledger-id',
    employeeId,
    transactionType: 'CREDIT',
    points,
    sourceType,
    sourceId,
    description,
    balanceAfter: points, // stub value
  };
};

const deductXp = async (employeeId, points, sourceType, sourceId, description) => {
  console.log(`💸 [XP STUB] Deduct ${points} XP from ${employeeId} | Source: ${sourceType} | ${description}`);
  return {
    id: 'stub-xp-ledger-id',
    employeeId,
    transactionType: 'DEBIT',
    points,
    sourceType,
    sourceId,
    description,
    balanceAfter: 0,
  };
};

const evaluateBadges = async (employeeId) => {
  console.log(`🎖️ [BADGE STUB] Evaluating badges for employee ${employeeId}`);
  // TODO: Replace with actual badge evaluation logic
  return [];
};

module.exports = {
  awardXp,
  deductXp,
  evaluateBadges,
};
