const dashboardRepository = require('../repositories/dashboardRepository');

class DashboardService {
  async getDashboardData(query, user) {
    const year = parseInt(query.year) || new Date().getFullYear();

    // Dept Heads scoped to their own department
    let departmentId = query.departmentId;
    if (user.roleName === 'Department Head') {
      departmentId = user.departmentId;
    }

    const [summary, monthlyEmissions, categoryBreakdown, departmentBreakdown, goalsOverview] = await Promise.all([
      dashboardRepository.getSummaryStats(departmentId),
      dashboardRepository.getEmissionsByMonth(year, departmentId),
      dashboardRepository.getEmissionsByCategory(departmentId),
      user.roleName !== 'Department Head'
        ? dashboardRepository.getEmissionsByDepartment()
        : Promise.resolve([]),
      dashboardRepository.getGoalsOverview(departmentId),
    ]);

    return {
      year,
      summary,
      monthlyEmissions,
      categoryBreakdown,
      departmentBreakdown,
      goalsOverview,
    };
  }
}

module.exports = new DashboardService();
