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
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { AlertCircle, TrendingDown, Activity, Target, Package, Leaf, RefreshCw } from 'lucide-react';
import environmentalApi from '../services/environmentalApi';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler
);

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Pastel eco palette for charts
const PIE_COLORS   = ['#9BBDAF', '#F8C7AE', '#FFF8C9', '#F27D88', '#836A78'];
const BAR_COLOR    = '#9BBDAF';
const LINE_COLOR   = '#F27D88';

const EnvironmentalDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => { fetchDashboard(); }, [year]);

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
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-border-main border-t-primary" />
          <p className="text-sm text-text-secondary font-medium">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-error/10 border border-error/20 p-5 rounded-2xl flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-error mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-error">Unable to load dashboard</p>
            <p className="text-xs text-error/80 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const { summary, monthlyEmissions, categoryBreakdown, departmentBreakdown, goalsOverview } = dashboardData;

  // ── Chart data ──────────────────────────────────────────
  const monthlyChartData = {
    labels: MONTH_LABELS,
    datasets: [{
      label: `Emissions (kg CO₂e) — ${year}`,
      data: monthlyEmissions.map(m => m.totalEmissions),
      backgroundColor: `${LINE_COLOR}22`,
      borderColor: LINE_COLOR,
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: LINE_COLOR,
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
    }],
  };

  const monthlyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => `${Number(ctx.raw).toLocaleString()} kg CO₂e` } },
    },
    scales: {
      x: { grid: { display: false }, border: { dash: [4, 4] } },
      y: { beginAtZero: true, grid: { color: '#ECE8E3' }, ticks: { callback: v => v.toLocaleString() } },
    },
  };

  const categoryChartData = {
    labels: categoryBreakdown.map(c => c.category),
    datasets: [{
      data: categoryBreakdown.map(c => c.totalEmissions),
      backgroundColor: PIE_COLORS,
      borderWidth: 3,
      borderColor: '#FCFBF7',
    }],
  };

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, font: { size: 12 } } },
      tooltip: {
        callbacks: {
          label: ctx => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = ((ctx.raw / total) * 100).toFixed(1);
            return `${ctx.label}: ${Number(ctx.raw).toLocaleString()} kg (${pct}%)`;
          },
        },
      },
    },
  };

  const deptChartData = {
    labels: departmentBreakdown.map(d => d.department),
    datasets: [{
      label: 'Emissions by Department',
      data: departmentBreakdown.map(d => d.totalEmissions),
      backgroundColor: PIE_COLORS,
      borderRadius: 8,
    }],
  };

  const deptChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => `${Number(ctx.raw).toLocaleString()} kg CO₂e` } },
    },
    scales: {
      x: { beginAtZero: true, grid: { color: '#ECE8E3' }, ticks: { callback: v => v.toLocaleString() } },
      y: { grid: { display: false } },
    },
  };

  // ── Stat cards ───────────────────────────────────────────
  const statCards = [
    {
      title: 'Total Emissions',
      value: `${Number(summary.totalEmissions).toLocaleString()} kg`,
      subtitle: 'CO₂e recorded this year',
      icon: TrendingDown,
      iconBg: '#9BBDAF22',
      iconColor: '#5E9E6F',
    },
    {
      title: 'Transactions',
      value: summary.totalTransactions,
      subtitle: 'Activities logged',
      icon: Activity,
      iconBg: '#7CA9D622',
      iconColor: '#7CA9D6',
    },
    {
      title: 'Active Goals',
      value: summary.activeGoals,
      subtitle: 'On-track or at-risk',
      icon: Target,
      iconBg: '#F5C75D22',
      iconColor: '#c49800',
    },
    {
      title: 'Products Tracked',
      value: summary.productProfiles,
      subtitle: 'Lifecycle profiles',
      icon: Package,
      iconBg: '#836A7822',
      iconColor: '#836A78',
    },
  ];

  const statusStyle = {
    ON_TRACK: 'chip-success',
    AT_RISK:  'chip-warning',
    ACHIEVED: 'chip-info',
    MISSED:   'chip-error',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Page Header ───────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl" style={{ background: '#9BBDAF22' }}>
            <Leaf className="h-6 w-6" style={{ color: '#5E9E6F' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Environmental Dashboard</h1>
            <p className="text-sm text-text-secondary mt-0.5">Real-time overview of your environmental performance</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <label htmlFor="year-select" className="text-sm font-medium text-text-secondary">Year</label>
          <select
            id="year-select"
            value={year}
            onChange={e => setYear(parseInt(e.target.value))}
            className="input-field w-28 py-2"
          >
            {[2023, 2024, 2025, 2026, 2027].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={fetchDashboard}
            className="p-2 rounded-xl border border-border-main hover:bg-background transition-all text-mauve hover:text-text-primary"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Stat Cards ────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map(card => (
          <div key={card.title} className="card flex items-start space-x-4">
            <div className="p-3 rounded-2xl flex-shrink-0" style={{ background: card.iconBg }}>
              <card.icon className="w-6 h-6" style={{ color: card.iconColor }} />
            </div>
            <div>
              <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">{card.title}</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{card.value}</p>
              <p className="text-xs text-text-secondary mt-0.5">{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Monthly Emissions Trend ────────────────── */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-text-primary">Monthly Emissions Trend</h2>
            <p className="text-xs text-text-secondary mt-0.5">kg CO₂e recorded per month</p>
          </div>
          <span className="chip-error">Live</span>
        </div>
        <div className="h-72">
          <Line data={monthlyChartData} options={monthlyChartOptions} />
        </div>
      </div>

      {/* ── Category + Department Breakdowns ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card">
          <h2 className="text-base font-semibold text-text-primary mb-1">Emissions by Category</h2>
          <p className="text-xs text-text-secondary mb-4">Distribution across emission types</p>
          {categoryBreakdown.length > 0 ? (
            <div className="h-72">
              <Doughnut data={categoryChartData} options={categoryChartOptions} />
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center">
              <p className="text-sm text-text-secondary">No category data available.</p>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-text-primary mb-1">Emissions by Department</h2>
          <p className="text-xs text-text-secondary mb-4">Top emitting departments this year</p>
          {departmentBreakdown.length > 0 ? (
            <div className="h-72">
              <Bar data={deptChartData} options={deptChartOptions} />
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center">
              <p className="text-sm text-text-secondary">No department data available.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Goals Overview Table ───────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-border-main overflow-hidden">
        <div className="px-6 py-4 border-b border-border-main flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-text-primary">ESG Goals Progress</h2>
            <p className="text-xs text-text-secondary mt-0.5">Track progress against sustainability targets</p>
          </div>
          <span className="chip-gray">{goalsOverview.length} goals</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr style={{ background: '#F8C7AE22' }}>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {goalsOverview.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-text-secondary">No goals set yet.</td>
                </tr>
              ) : (
                goalsOverview.map(goal => (
                  <tr
                    key={goal.id}
                    className="transition-colors duration-150"
                    onMouseEnter={e => e.currentTarget.style.background = '#FFF8C9'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-text-primary">{goal.department}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary max-w-xs truncate">{goal.description || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-border-main rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, goal.progress)}%`,
                              background: goal.progress >= 100 ? '#5E9E6F' : '#9BBDAF',
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-text-secondary">{goal.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={statusStyle[goal.status] || 'chip-gray'}>
                        {goal.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalDashboard;
