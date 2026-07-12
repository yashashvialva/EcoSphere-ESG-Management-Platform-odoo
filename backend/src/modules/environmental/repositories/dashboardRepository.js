const prisma = require('../../../config/prisma');

class DashboardRepository {
  /**
   * Get total emissions grouped by month for a given year.
   */
  async getEmissionsByMonth(year, departmentId) {
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year + 1}-01-01`);

    const where = {
      transactionDate: { gte: startDate, lt: endDate },
    };
    if (departmentId) where.departmentId = departmentId;

    const transactions = await prisma.carbonTransaction.findMany({
      where,
      select: {
        transactionDate: true,
        emissionValue: true,
      },
      orderBy: { transactionDate: 'asc' },
    });

    // Aggregate by month
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      totalEmissions: 0,
      count: 0,
    }));

    transactions.forEach((t) => {
      const month = new Date(t.transactionDate).getMonth();
      monthlyData[month].totalEmissions += Number(t.emissionValue);
      monthlyData[month].count += 1;
    });

    return monthlyData;
  }

  /**
   * Get emissions breakdown by category (scope).
   */
  async getEmissionsByCategory(departmentId) {
    const where = {};
    if (departmentId) where.departmentId = departmentId;

    const transactions = await prisma.carbonTransaction.findMany({
      where,
      include: {
        emissionFactor: {
          select: { source: true },
        },
      },
    });

    const categoryMap = {};
    transactions.forEach((t) => {
      const category = t.emissionFactor?.source || 'Unknown';
      if (!categoryMap[category]) {
        categoryMap[category] = { category, totalEmissions: 0, count: 0 };
      }
      categoryMap[category].totalEmissions += Number(t.emissionValue);
      categoryMap[category].count += 1;
    });

    return Object.values(categoryMap);
  }

  /**
   * Get emissions breakdown by department.
   */
  async getEmissionsByDepartment() {
    const transactions = await prisma.carbonTransaction.findMany({
      include: {
        department: {
          select: { name: true, code: true },
        },
      },
    });

    const deptMap = {};
    transactions.forEach((t) => {
      const deptName = t.department?.name || 'Unknown';
      if (!deptMap[deptName]) {
        deptMap[deptName] = { department: deptName, code: t.department?.code, totalEmissions: 0, count: 0 };
      }
      deptMap[deptName].totalEmissions += Number(t.emissionValue);
      deptMap[deptName].count += 1;
    });

    return Object.values(deptMap);
  }

  /**
   * Get summary stats: total emissions, total transactions, active goals, products tracked.
   */
  async getSummaryStats(departmentId) {
    const txWhere = {};
    const goalWhere = {};
    if (departmentId) {
      txWhere.departmentId = departmentId;
      goalWhere.departmentId = departmentId;
    }

    const [totalEmissionsResult, totalTransactions, activeGoals, productProfiles] = await Promise.all([
      prisma.carbonTransaction.aggregate({
        where: txWhere,
        _sum: { emissionValue: true },
      }),
      prisma.carbonTransaction.count({ where: txWhere }),
      prisma.esgGoal.count({ where: { ...goalWhere, status: { in: ['ACTIVE', 'DRAFT'] } } }),
      prisma.productEsgProfile.count(),
    ]);

    return {
      totalEmissions: Number(totalEmissionsResult._sum.emissionValue || 0),
      totalTransactions,
      activeGoals,
      productProfiles,
    };
  }

  /**
   * Get ESG goals progress overview.
   */
  async getGoalsOverview(departmentId) {
    const where = {};
    if (departmentId) where.departmentId = departmentId;

    const goals = await prisma.esgGoal.findMany({
      where,
      include: { department: { select: { name: true } } },
      orderBy: { deadline: 'asc' },
      take: 10,
    });

    return goals.map((g) => ({
      id: g.id,
      department: g.department?.name || 'Organization',
      description: g.title,
      targetValue: Number(g.targetValue),
      currentValue: Number(g.achievedValue),
      unit: 'kg CO2',
      status: g.status,
      deadline: g.deadline,
      progress: Number(g.targetValue) > 0 ? Math.round((Number(g.achievedValue) / Number(g.targetValue)) * 100) : 0,
    }));
  }
}

module.exports = new DashboardRepository();
