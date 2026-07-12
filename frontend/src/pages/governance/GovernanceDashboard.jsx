import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, FileText, ClipboardCheck, AlertTriangle, Clock,
  ChevronRight, TrendingUp, CheckCircle, BarChart3,
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  getPolicies, getAudits,
  getOverdueComplianceIssues, getOverdueAcknowledgements,
  getComplianceIssues,
} from '../../services/governanceApi';
import { StatusBadge } from './components/GovernanceBadges';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function KpiCard({ icon: Icon, label, value, color, bgColor, link, loading }) {
  const inner = (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-emerald-100/50 border border-emerald-50 p-5 hover:shadow-md hover:border-emerald-100 transition-all h-full group">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-xl ${bgColor} group-hover:scale-105 transition-transform`}><Icon className={`h-5 w-5 ${color}`} /></div>
        {link && <ChevronRight className="h-4 w-4 text-emerald-200 group-hover:text-emerald-400 transition-colors" />}
      </div>
      {loading ? (
        <div className="h-8 w-16 bg-emerald-50 rounded animate-pulse mb-1" />
      ) : (
        <p className="text-3xl font-bold text-slate-800">{value}</p>
      )}
      <p className="text-sm text-slate-500 mt-1 font-medium">{label}</p>
    </div>
  );
  return link ? <Link to={link}>{inner}</Link> : inner;
}

function Skeleton({ rows = 4 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3 items-center">
          <div className="h-4 bg-emerald-50 rounded animate-pulse flex-1" />
          <div className="h-5 w-20 bg-emerald-50 rounded-full animate-pulse" />
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

  const policyStatusCounts = allPolicies.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const policyChartData = {
    labels: Object.keys(policyStatusCounts).map(l => l.replace(/_/g, ' ')),
    datasets: [{
      data: Object.values(policyStatusCounts),
      backgroundColor: ['#cbd5e1', '#34d399', '#94a3b8'],
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
      backgroundColor: ['#6ee7b7', '#fcd34d', '#fb923c', '#f87171'],
      borderRadius: 6,
      barPercentage: 0.6,
    }],
  };

  const chartOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 16, font: { size: 12, family: "'Inter', sans-serif" } } } } };
  const barOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1, font: { family: "'Inter', sans-serif" } }, grid: { color: '#f1f5f9' } }, x: { grid: { display: false }, ticks: { font: { family: "'Inter', sans-serif" } } } } };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex items-center gap-4 bg-gradient-to-r from-emerald-50 to-teal-50/30 p-6 rounded-2xl border border-emerald-100/50">
        <div className="p-3 bg-white rounded-xl shadow-sm shadow-emerald-100"><Shield className="h-7 w-7 text-emerald-600" /></div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Governance Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">Policies, audits, compliance and acknowledgements at a glance</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-1 text-sm text-red-600 hover:text-red-700 underline font-medium">Retry</button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard icon={FileText} label="Total Policies" value={kpi.policies} color="text-teal-600" bgColor="bg-teal-50" link="/governance/policies" loading={loading} />
        <KpiCard icon={ClipboardCheck} label="Active Audits" value={kpi.audits} color="text-emerald-600" bgColor="bg-emerald-50" link="/governance/audits" loading={loading} />
        <KpiCard icon={AlertTriangle} label="Overdue Issues" value={kpi.overdueIssues} color="text-rose-500" bgColor="bg-rose-50" link="/governance/compliance-issues" loading={loading} />
        <KpiCard icon={Clock} label="Pending Acks" value={kpi.pendingAcks} color="text-amber-500" bgColor="bg-amber-50" link="/governance/acknowledgements" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-emerald-100/50 border border-emerald-50 p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" /> Policy Status Distribution
          </h2>
          {loading ? <Skeleton rows={3} /> : allPolicies.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-300"><BarChart3 className="h-10 w-10 mb-2 opacity-50" /><p className="text-sm">No data yet</p></div>
          ) : (
            <div className="h-64"><Doughnut data={policyChartData} options={chartOpts} /></div>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-emerald-100/50 border border-emerald-50 p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" /> Issues by Severity
          </h2>
          {loading ? <Skeleton rows={3} /> : allIssues.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-300"><BarChart3 className="h-10 w-10 mb-2 opacity-50" /><p className="text-sm">No data yet</p></div>
          ) : (
            <div className="h-64"><Bar data={severityChartData} options={barOpts} /></div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-emerald-100/50 border border-emerald-50 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-slate-800">Recent Policies</h2>
            <Link to="/governance/policies" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">View all <ChevronRight className="h-4 w-4" /></Link>
          </div>
          {loading ? <Skeleton /> : recentPolicies.length === 0 ? (
            <div className="text-center py-8 text-slate-300"><FileText className="h-8 w-8 mx-auto mb-2 opacity-50" /><p className="text-sm">No policies yet</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-emerald-50">
                <thead><tr>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3">Title</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3">Date</th>
                  <th className="pb-3" />
                </tr></thead>
                <tbody className="divide-y divide-emerald-50">
                  {recentPolicies.map((p) => (
                    <tr key={p.id} className="hover:bg-emerald-50/50 transition-colors">
                      <td className="py-3 pr-3 text-sm font-medium text-slate-700 max-w-[180px] truncate">{p.title}</td>
                      <td className="py-3 pr-3"><StatusBadge status={p.status} /></td>
                      <td className="py-3 pr-3 text-sm text-slate-500 whitespace-nowrap">{p.effectiveDate ? new Date(p.effectiveDate).toLocaleDateString() : '—'}</td>
                      <td className="py-3 text-right"><Link to={`/governance/policies/${p.id}`} className="text-sm font-medium text-emerald-600 hover:text-emerald-700">View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-emerald-100/50 border border-emerald-50 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-slate-800">Recent Audits</h2>
            <Link to="/governance/audits" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">View all <ChevronRight className="h-4 w-4" /></Link>
          </div>
          {loading ? <Skeleton /> : recentAudits.length === 0 ? (
            <div className="text-center py-8 text-slate-300"><ClipboardCheck className="h-8 w-8 mx-auto mb-2 opacity-50" /><p className="text-sm">No audits yet</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-emerald-50">
                <thead><tr>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3">Title</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3">Type</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3">Status</th>
                  <th className="pb-3" />
                </tr></thead>
                <tbody className="divide-y divide-emerald-50">
                  {recentAudits.map((a) => (
                    <tr key={a.id} className="hover:bg-emerald-50/50 transition-colors">
                      <td className="py-3 pr-3 text-sm font-medium text-slate-700 max-w-[180px] truncate">{a.title}</td>
                      <td className="py-3 pr-3"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-700">{a.auditType?.replace(/_/g, ' ')}</span></td>
                      <td className="py-3 pr-3"><StatusBadge status={a.status} /></td>
                      <td className="py-3 text-right"><Link to={`/governance/audits/${a.id}`} className="text-sm font-medium text-emerald-600 hover:text-emerald-700">View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-emerald-100/50 border border-emerald-50 p-6">
        <h2 className="text-base font-semibold text-slate-800 mb-5">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Create Policy', href: '/governance/policies', icon: FileText, desc: 'Draft a new ESG policy' },
            { label: 'Schedule Audit', href: '/governance/audits', icon: ClipboardCheck, desc: 'Plan a governance audit' },
            { label: 'Report Issue', href: '/governance/compliance-issues', icon: AlertTriangle, desc: 'Log a compliance issue' },
            { label: 'My Acknowledgements', href: '/governance/acknowledgements', icon: CheckCircle, desc: 'View pending policies' },
          ].map((a) => {
            const Icon = a.icon;
            return (
              <Link key={a.label} to={a.href} className="flex items-start gap-4 p-5 rounded-xl border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group hover:-translate-y-0.5 hover:shadow-sm shadow-emerald-100">
                <Icon className="h-5 w-5 text-emerald-400 group-hover:text-emerald-600 mt-0.5 shrink-0 transition-colors" />
                <div>
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">{a.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{a.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
