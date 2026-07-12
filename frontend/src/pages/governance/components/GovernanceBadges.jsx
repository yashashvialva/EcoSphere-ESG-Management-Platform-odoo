export const STATUS_COLORS = {
  DRAFT: 'bg-gray-100 text-gray-700',
  PUBLISHED: 'bg-green-100 text-green-700',
  ARCHIVED: 'bg-slate-100 text-slate-600',
  PLANNED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  OPEN: 'bg-blue-100 text-blue-700',
  RESOLVED: 'bg-emerald-100 text-emerald-700',
  CLOSED: 'bg-gray-100 text-gray-700',
};

export const SEVERITY_COLORS = {
  LOW: 'bg-green-100 text-green-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH: 'bg-orange-100 text-orange-700',
  CRITICAL: 'bg-red-100 text-red-700',
};

export const TYPE_COLORS = {
  INTERNAL: 'bg-purple-100 text-purple-700',
  EXTERNAL: 'bg-blue-100 text-blue-700',
  COMPLIANCE: 'bg-indigo-100 text-indigo-700',
  ESG: 'bg-emerald-100 text-emerald-700',
};

export function StatusBadge({ status }) {
  const cls = STATUS_COLORS[status] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
}

export function SeverityBadge({ severity }) {
  const cls = SEVERITY_COLORS[severity] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {severity}
    </span>
  );
}

export function TypeBadge({ type }) {
  const cls = TYPE_COLORS[type] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {type?.replace(/_/g, ' ')}
    </span>
  );
}
