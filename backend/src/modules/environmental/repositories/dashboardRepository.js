const prisma = require('../../../config/prisma');

class DashboardRepository {
  /**
   * Get total emissions grouped by month for a given year.
   */
  async getEmissionsByMonth(year, departmentId) {
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year + 1}-01-01`);

    const where = {
      transaction_date: { gte: startDate, lt: endDate },
    };
    if (departmentId) where.department_id = departmentId;

    const transactions = await prisma.carbonTransaction.findMany({
      where,
      select: {
        transaction_date: true,
        emission_value: true,
      },
      orderBy: { transaction_date: 'asc' },
    });

    // Aggregate by month
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      totalEmissions: 0,
      count: 0,
    }));

    transactions.forEach((t) => {
      const month = new Date(t.transaction_date).getMonth();
      monthlyData[month].totalEmissions += Number(t.emission_value);
      monthlyData[month].count += 1;
    });

    return monthlyData;
  }

  /**
   * Get emissions breakdown by category (scope).
   */
  async getEmissionsByCategory(departmentId) {
    const where = {};
    if (departmentId) where.department_id = departmentId;

    const transactions = await prisma.carbonTransaction.findMany({
      where,
      include: {
        emission_factor: {
          select: { source: true },
        },
      },
    });

    const categoryMap = {};
    transactions.forEach((t) => {
      const category = t.emission_factor?.source || 'Unknown';
      if (!categoryMap[category]) {
        categoryMap[category] = { category, totalEmissions: 0, count: 0 };
      }
      categoryMap[category].totalEmissions += Number(t.emission_value);
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
      deptMap[deptName].totalEmissions += Number(t.emission_value);
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
    const profileWhere = {};
    if (departmentId) {
      txWhere.department_id = departmentId;
      goalWhere.department_id = departmentId;
      profileWhere.department_id = departmentId;
    }

    const [totalEmissionsResult, totalTransactions, activeGoals, productProfiles] = await Promise.all([
      prisma.carbonTransaction.aggregate({
        where: txWhere,
        _sum: { emission_value: true },
      }),
      prisma.carbonTransaction.count({ where: txWhere }),
      prisma.esgGoal.count({ where: { ...goalWhere, status: { in: ['ON_TRACK', 'AT_RISK'] } } }),
      prisma.productProfile.count({ where: profileWhere }),
    ]);

    return {
      totalEmissions: Number(totalEmissionsResult._sum.emission_value || 0),
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
    if (departmentId) where.department_id = departmentId;

    const goals = await prisma.esgGoal.findMany({
      where,
      include: { department: { select: { name: true } } },
      orderBy: { deadline: 'asc' },
      take: 10,
    });

    return goals.map((g) => ({
      id: g.id,
      department: g.department?.name || 'Organization',
      description: g.description,
      targetValue: Number(g.target_value),
      currentValue: Number(g.current_value),
      unit: g.unit,
      status: g.status,
      deadline: g.deadline,
      progress: g.target_value > 0 ? Math.round((Number(g.current_value) / Number(g.target_value)) * 100) : 0,
    }));
  }
}

module.exports = new DashboardRepository();
