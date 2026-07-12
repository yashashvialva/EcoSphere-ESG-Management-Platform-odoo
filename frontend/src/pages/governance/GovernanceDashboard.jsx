import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, FileText, ClipboardCheck, AlertTriangle, Clock,
  ChevronRight, TrendingUp, CheckCircle, XCircle, BarChart3,
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  getPolicies, getAudits,
  getOverdueComplianceIssues, getOverdueAcknowledgements,
  getComplianceIssues,
} from '../../services/governanceApi';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const STATUS_COLORS = {
  DRAFT: 'bg-gray-100 text-gray-700',
  PUBLISHED: 'bg-green-100 text-green-700',
  ARCHIVED: 'bg-slate-100 text-slate-600',
  PLANNED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  OPEN: 'bg-blue-100 text-blue-700',
  RESOLVED: 'bg-emerald-100 text-emerald-700',
  CLOSED: 'bg-gray-100 text-gray-600',
};

const SEVERITY_COLORS = {
  LOW: 'bg-green-100 text-green-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH: 'bg-orange-100 text-orange-700',
  CRITICAL: 'bg-red-100 text-red-700',
};

function Badge({ value, colorMap }) {
  const cls = colorMap?.[value] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {value?.replace(/_/g, ' ')}
    </span>
  );
}

function KpiCard({ icon: Icon, label, value, color, bgColor, link, loading }) {
  const inner = (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow h-full">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${bgColor}`}><Icon className={`h-5 w-5 ${color}`} /></div>
        {link && <ChevronRight className="h-4 w-4 text-gray-300" />}
      </div>
      {loading ? (
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-1" />
      ) : (
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      )}
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
  return link ? <Link to={link}>{inner}</Link> : inner;
}

function Skeleton({ rows = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3 items-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse flex-1" />
          <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function GovernanceDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [kpi, setKpi] = useState({ policies: 0, audits: 0, overdueIssues: 0, pendingAcks: 0 });
  const [recentPolicies, setRecentPolicies] = useState([]);
  const [recentAudits, setRecentAudits] = useState([]);
  const [allPolicies, setAllPolicies] = useState([]);
  const [allIssues, setAllIssues] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const [polRes, audRes, issOverdue, ackOverdue, polAll, issAll] = await Promise.all([
          getPolicies({ limit: 5 }),
          getAudits({ limit: 5 }),
          getOverdueComplianceIssues(),
          getOverdueAcknowledgements(),
          getPolicies({ limit: 100 }),
          getComplianceIssues({ limit: 100 }),
        ]);

        setRecentPolicies(polRes.data.data || []);
        setRecentAudits(audRes.data.data || []);
        setAllPolicies(polAll.data.data || []);
        setAllIssues(issAll.data.data || []);

        setKpi({
          policies: polRes.data.pagination?.total ?? 0,
          audits: audRes.data.pagination?.total ?? 0,
          overdueIssues: Array.isArray(issOverdue.data.data) ? issOverdue.data.data.length : 0,
          pendingAcks: Array.isArray(ackOverdue.data.data) ? ackOverdue.data.data.length : 0,
        });
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Failed to load governance data');
      }
      setLoading(false);
    };
    load();
  }, []);

  // ── Chart data ──
  const policyStatusCounts = allPolicies.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const policyChartData = {
    labels: Object.keys(policyStatusCounts),
    datasets: [{
      data: Object.values(policyStatusCounts),
      backgroundColor: ['#94a3b8', '#22c55e', '#64748b'],
      borderWidth: 0,
      hoverOffset: 6,
    }],
  };

  const severityCounts = allIssues.reduce((acc, i) => {
    acc[i.severity] = (acc[i.severity] || 0) + 1;
    return acc;
  }, {});

  const severityChartData = {
    labels: Object.keys(severityCounts),
    datasets: [{
      label: 'Issues',
      data: Object.values(severityCounts),
      backgroundColor: ['#22c55e', '#f59e0b', '#f97316', '#ef4444'],
      borderRadius: 6,
      barPercentage: 0.6,
    }],
  };

  const chartOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 16, font: { size: 12 } } } } };
  const barOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } }, x: { grid: { display: false } } } };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-primary-50 rounded-xl"><Shield className="h-6 w-6 text-primary-600" /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Governance Overview</h1>
          <p className="text-sm text-gray-500">Policies, audits, compliance and acknowledgements at a glance</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-1 text-sm text-red-600 hover:text-red-700 underline">Retry</button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard icon={FileText} label="Total Policies" value={kpi.policies} color="text-blue-600" bgColor="bg-blue-50" link="/governance/policies" loading={loading} />
        <KpiCard icon={ClipboardCheck} label="Active Audits" value={kpi.audits} color="text-green-600" bgColor="bg-green-50" link="/governance/audits" loading={loading} />
        <KpiCard icon={AlertTriangle} label="Overdue Issues" value={kpi.overdueIssues} color="text-red-600" bgColor="bg-red-50" link="/governance/compliance-issues" loading={loading} />
        <KpiCard icon={Clock} label="Pending Acknowledgements" value={kpi.pendingAcks} color="text-amber-600" bgColor="bg-amber-50" link="/governance/acknowledgements" loading={loading} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gray-400" /> Policy Status Distribution
          </h2>
          {loading ? <Skeleton rows={3} /> : allPolicies.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400"><BarChart3 className="h-10 w-10 mb-2 opacity-40" /><p className="text-sm">No data yet</p></div>
          ) : (
            <div className="h-56"><Doughnut data={policyChartData} options={chartOpts} /></div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-gray-400" /> Issues by Severity
          </h2>
          {loading ? <Skeleton rows={3} /> : allIssues.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400"><BarChart3 className="h-10 w-10 mb-2 opacity-40" /><p className="text-sm">No data yet</p></div>
          ) : (
            <div className="h-56"><Bar data={severityChartData} options={barOpts} /></div>
          )}
        </div>
      </div>

      {/* Recent Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Policies */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Recent Policies</h2>
            <Link to="/governance/policies" className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">View all <ChevronRight className="h-4 w-4" /></Link>
          </div>
          {loading ? <Skeleton /> : recentPolicies.length === 0 ? (
            <div className="text-center py-8 text-gray-400"><FileText className="h-8 w-8 mx-auto mb-2 opacity-40" /><p className="text-sm">No policies yet</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead><tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Title</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Status</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Date</th>
                  <th className="pb-3" />
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {recentPolicies.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 pr-3 text-sm font-medium text-gray-900 max-w-[180px] truncate">{p.title}</td>
                      <td className="py-3 pr-3"><Badge value={p.status} colorMap={STATUS_COLORS} /></td>
                      <td className="py-3 pr-3 text-sm text-gray-500 whitespace-nowrap">{p.effectiveDate ? new Date(p.effectiveDate).toLocaleDateString() : '—'}</td>
                      <td className="py-3 text-right"><Link to={`/governance/policies/${p.id}`} className="text-sm font-medium text-primary-600 hover:text-primary-700">View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Audits */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Recent Audits</h2>
            <Link to="/governance/audits" className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">View all <ChevronRight className="h-4 w-4" /></Link>
          </div>
          {loading ? <Skeleton /> : recentAudits.length === 0 ? (
            <div className="text-center py-8 text-gray-400"><ClipboardCheck className="h-8 w-8 mx-auto mb-2 opacity-40" /><p className="text-sm">No audits yet</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead><tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Title</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Type</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Status</th>
                  <th className="pb-3" />
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {recentAudits.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 pr-3 text-sm font-medium text-gray-900 max-w-[180px] truncate">{a.title}</td>
                      <td className="py-3 pr-3"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">{a.auditType?.replace(/_/g, ' ')}</span></td>
                      <td className="py-3 pr-3"><Badge value={a.status} colorMap={STATUS_COLORS} /></td>
                      <td className="py-3 text-right"><Link to={`/governance/audits/${a.id}`} className="text-sm font-medium text-primary-600 hover:text-primary-700">View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Create Policy', href: '/governance/policies', icon: FileText, desc: 'Draft a new ESG policy' },
            { label: 'Schedule Audit', href: '/governance/audits', icon: ClipboardCheck, desc: 'Plan a governance audit' },
            { label: 'Report Issue', href: '/governance/compliance-issues', icon: AlertTriangle, desc: 'Log a compliance issue' },
            { label: 'My Acknowledgements', href: '/governance/acknowledgements', icon: CheckCircle, desc: 'View pending policies' },
          ].map((a) => {
            const Icon = a.icon;
            return (
              <Link key={a.label} to={a.href} className="flex items-start gap-3 p-4 rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-colors group">
                <Icon className="h-5 w-5 text-gray-400 group-hover:text-primary-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-primary-700">{a.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
