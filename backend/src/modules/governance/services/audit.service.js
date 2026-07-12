const prisma = require('../../../config/prisma');
const { NotFoundError, BusinessRuleError } = require('../../../shared/errors');
const { AUDIT_STATUS, PAGINATION_DEFAULTS } = require('../constants/governance.constants');

// ─── List Audits (paginated, filterable) ─────────────────────────

const getAllAudits = async (filters = {}, pagination = {}) => {
  const page = pagination.page || PAGINATION_DEFAULTS.page;
  const limit = pagination.limit || PAGINATION_DEFAULTS.limit;
  const skip = (page - 1) * limit;

  const where = {};
  if (filters.status) where.status = filters.status;
  if (filters.departmentId) where.departmentId = filters.departmentId;
  if (filters.auditType) where.auditType = filters.auditType;

  const [data, total] = await Promise.all([
    prisma.audit.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        department: { select: { id: true, name: true, code: true } },
        auditorEmployee: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    }),
    prisma.audit.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ─── Get Single Audit ────────────────────────────────────────────

const getAuditById = async (id) => {
  const audit = await prisma.audit.findUnique({
    where: { id },
    include: {
      department: { select: { id: true, name: true, code: true } },
      auditorEmployee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      complianceIssues: true,
    },
  });

  if (!audit) {
    throw new NotFoundError('Audit');
  }

  return audit;
};

// ─── Create Audit ────────────────────────────────────────────────

const createAudit = async (data) => {
  return prisma.audit.create({
    data,
    include: {
      department: { select: { id: true, name: true, code: true } },
      auditorEmployee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });
};

// ─── Update Audit (PLANNED or IN_PROGRESS only) ─────────────────

const updateAudit = async (id, data) => {
  const audit = await prisma.audit.findUnique({ where: { id } });

  if (!audit) {
    throw new NotFoundError('Audit');
  }

  if (![AUDIT_STATUS.PLANNED, AUDIT_STATUS.IN_PROGRESS].includes(audit.status)) {
    throw new BusinessRuleError(
      'Only PLANNED or IN_PROGRESS audits can be updated'
    );
  }

  return prisma.audit.update({
    where: { id },
    data,
    include: {
      department: { select: { id: true, name: true, code: true } },
      auditorEmployee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });
};

// ─── Update Audit Status (validated transitions) ─────────────────

const updateAuditStatus = async (id, newStatus, extra = {}) => {
  const audit = await prisma.audit.findUnique({ where: { id } });

  if (!audit) {
    throw new NotFoundError('Audit');
  }

  const validTransitions = {
    [AUDIT_STATUS.PLANNED]: [AUDIT_STATUS.IN_PROGRESS, AUDIT_STATUS.CANCELLED],
    [AUDIT_STATUS.IN_PROGRESS]: [AUDIT_STATUS.COMPLETED, AUDIT_STATUS.CANCELLED],
    [AUDIT_STATUS.COMPLETED]: [],
    [AUDIT_STATUS.CANCELLED]: [],
  };

  if (!validTransitions[audit.status]?.includes(newStatus)) {
    throw new BusinessRuleError(
      `Cannot transition audit from ${audit.status} to ${newStatus}`
    );
  }

  const updateData = { status: newStatus };

  if (newStatus === AUDIT_STATUS.COMPLETED) {
    if (extra.overallRating == null) {
      throw new BusinessRuleError(
        'Overall rating is required when completing an audit'
      );
    }
    updateData.completedDate = extra.completedDate || new Date();
    updateData.overallRating = extra.overallRating;
    if (extra.findingsSummary) {
      updateData.findingsSummary = extra.findingsSummary;
    }
  }

  return prisma.audit.update({
    where: { id },
    data: updateData,
    include: {
      department: { select: { id: true, name: true, code: true } },
      auditorEmployee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });
};

// ─── Get Audit Findings (related compliance issues) ──────────────

const getAuditFindings = async (auditId) => {
  const audit = await prisma.audit.findUnique({ where: { id: auditId } });

  if (!audit) {
    throw new NotFoundError('Audit');
  }

  return prisma.complianceIssue.findMany({
    where: { auditId },
    include: {
      ownerEmployee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      department: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

// ─── Get Audits by Department ────────────────────────────────────

const getAuditsByDepartment = async (departmentId) => {
  return prisma.audit.findMany({
    where: { departmentId },
    include: {
      department: { select: { id: true, name: true, code: true } },
      auditorEmployee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
    orderBy: { scheduledDate: 'desc' },
  });
};

module.exports = {
  getAllAudits,
  getAuditById,
  createAudit,
  updateAudit,
  updateAuditStatus,
  getAuditFindings,
  getAuditsByDepartment,
};
