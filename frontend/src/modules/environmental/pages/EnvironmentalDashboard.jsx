import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement,
  LineElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler 
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { AlertCircle, TrendingDown, Activity, Target, Package } from 'lucide-react';
import environmentalApi from '../services/environmentalApi';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CHART_COLORS = [
  'rgba(16, 185, 129, 0.8)',   // emerald
  'rgba(59, 130, 246, 0.8)',   // blue
  'rgba(249, 115, 22, 0.8)',   // orange
  'rgba(168, 85, 247, 0.8)',   // purple
  'rgba(236, 72, 153, 0.8)',   // pink
  'rgba(20, 184, 166, 0.8)',   // teal
  'rgba(245, 158, 11, 0.8)',   // amber
  'rgba(99, 102, 241, 0.8)',   // indigo
];

const EnvironmentalDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchDashboard();
  }, [year]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await environmentalApi.getDashboard({ year });
      setDashboardData(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 p-4 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const { summary, monthlyEmissions, categoryBreakdown, departmentBreakdown, goalsOverview } = dashboardData;

  // --- Chart Data ---
  const monthlyChartData = {
    labels: MONTH_LABELS,
    datasets: [{
      label: `Emissions (kg CO₂e) — ${year}`,
      data: monthlyEmissions.map((m) => m.totalEmissions),
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: 'rgba(16, 185, 129, 1)',
      pointRadius: 4,
    }],
  };

  const monthlyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${Number(ctx.raw).toLocaleString()} kg CO₂e`,
        },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { callback: (v) => v.toLocaleString() } },
    },
  };

  const categoryChartData = {
    labels: categoryBreakdown.map((c) => c.category),
    datasets: [{
      data: categoryBreakdown.map((c) => c.totalEmissions),
      backgroundColor: CHART_COLORS.slice(0, categoryBreakdown.length),
      borderWidth: 2,
      borderColor: '#fff',
    }],
  };

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 16, usePointStyle: true },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = ((ctx.raw / total) * 100).toFixed(1);
            return `${ctx.label}: ${Number(ctx.raw).toLocaleString()} kg CO₂e (${pct}%)`;
          },
        },
      },
    },
  };

  const deptChartData = {
    labels: departmentBreakdown.map((d) => d.department),
    datasets: [{
      label: 'Emissions by Department (kg CO₂e)',
      data: departmentBreakdown.map((d) => d.totalEmissions),
      backgroundColor: CHART_COLORS.slice(0, departmentBreakdown.length),
      borderRadius: 6,
    }],
  };

  const deptChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${Number(ctx.raw).toLocaleString()} kg CO₂e`,
        },
      },
    },
    scales: {
      x: { beginAtZero: true, ticks: { callback: (v) => v.toLocaleString() } },
    },
  };

  // Summary stat cards
  const statCards = [
    {
      title: 'Total Emissions',
      value: `${Number(summary.totalEmissions).toLocaleString()} kg`,
      subtitle: 'CO₂e recorded',
      icon: TrendingDown,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Transactions',
      value: summary.totalTransactions,
      subtitle: 'Activities logged',
      icon: Activity,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Active Goals',
      value: summary.activeGoals,
      subtitle: 'On-track or at-risk',
      icon: Target,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Products Tracked',
      value: summary.productProfiles,
      subtitle: 'Lifecycle profiles',
      icon: Package,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Environmental Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time overview of your environmental performance.</p>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="year-select" className="text-sm font-medium text-gray-600">Year:</label>
          <select
            id="year-select"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="input-field w-28"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.title} className="card flex items-start">
            <div className={`p-3 rounded-xl mr-4 ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Emissions Trend */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Emissions Trend</h2>
        <div className="h-80">
          <Line data={monthlyChartData} options={monthlyChartOptions} />
        </div>
      </div>

      {/* Two-column: Category Breakdown + Department Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Emissions by Category</h2>
          {categoryBreakdown.length > 0 ? (
            <div className="h-72">
              <Doughnut data={categoryChartData} options={categoryChartOptions} />
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-12">No category data available.</p>
          )}
        </div>

        {/* Department Breakdown */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Emissions by Department</h2>
          {departmentBreakdown.length > 0 ? (
            <div className="h-72">
              <Bar data={deptChartData} options={deptChartOptions} />
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-12">No department data available.</p>
          )}
        </div>
      </div>

      {/* Goals Overview Table */}
      <div className="card overflow-hidden p-0">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">ESG Goals Progress</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {goalsOverview.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">No goals set yet.</td>
                </tr>
              ) : (
                goalsOverview.map((goal) => {
                  const statusClasses = {
                    ON_TRACK: 'bg-green-100 text-green-800',
                    AT_RISK: 'bg-yellow-100 text-yellow-800',
                    ACHIEVED: 'bg-blue-100 text-blue-800',
                    MISSED: 'bg-red-100 text-red-800',
                  };
                  return (
                    <tr key={goal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{goal.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{goal.description || '—'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className={`h-2 rounded-full ${goal.progress >= 100 ? 'bg-green-500' : 'bg-primary-500'}`}
                              style={{ width: `${Math.min(100, goal.progress)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{goal.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[goal.status] || ''}`}>
                          {goal.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalDashboard;
