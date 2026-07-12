const prisma = require('../../../config/prisma');
const { NotFoundError, BusinessRuleError } = require('../../../shared/errors');
const { COMPLIANCE_STATUS, PAGINATION_DEFAULTS } = require('../constants/governance.constants');

// ─── List Compliance Issues (paginated, filterable) ──────────────

const getAllComplianceIssues = async (filters = {}, pagination = {}) => {
  const page = pagination.page || PAGINATION_DEFAULTS.page;
  const limit = pagination.limit || PAGINATION_DEFAULTS.limit;
  const skip = (page - 1) * limit;

  const where = {};
  if (filters.status) where.status = filters.status;
  if (filters.severity) where.severity = filters.severity;
  if (filters.departmentId) where.departmentId = filters.departmentId;
  if (filters.auditId) where.auditId = filters.auditId;

  const [data, total] = await Promise.all([
    prisma.complianceIssue.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        department: { select: { id: true, name: true, code: true } },
        ownerEmployee: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        audit: { select: { id: true, title: true } },
      },
    }),
    prisma.complianceIssue.count({ where }),
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

// ─── Get Single Compliance Issue ─────────────────────────────────

const getComplianceIssueById = async (id) => {
  const issue = await prisma.complianceIssue.findUnique({
    where: { id },
    include: {
      department: { select: { id: true, name: true, code: true } },
      ownerEmployee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      createdByEmployee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      audit: { select: { id: true, title: true, auditType: true } },
    },
  });

  if (!issue) {
    throw new NotFoundError('Compliance Issue');
  }

  return issue;
};

// ─── Create Compliance Issue ─────────────────────────────────────

const createComplianceIssue = async (data) => {
  return prisma.complianceIssue.create({
    data,
    include: {
      department: { select: { id: true, name: true, code: true } },
      ownerEmployee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });
};

// ─── Update Compliance Issue (OPEN or IN_PROGRESS only) ──────────

const updateComplianceIssue = async (id, data) => {
  const issue = await prisma.complianceIssue.findUnique({ where: { id } });

  if (!issue) {
    throw new NotFoundError('Compliance Issue');
  }

  if (![COMPLIANCE_STATUS.OPEN, COMPLIANCE_STATUS.IN_PROGRESS].includes(issue.status)) {
    throw new BusinessRuleError(
      'Only OPEN or IN_PROGRESS issues can be updated'
    );
  }

  return prisma.complianceIssue.update({
    where: { id },
    data,
    include: {
      department: { select: { id: true, name: true, code: true } },
      ownerEmployee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });
};

// ─── Update Compliance Issue Status (validated transitions) ──────

const updateComplianceIssueStatus = async (id, newStatus) => {
  const issue = await prisma.complianceIssue.findUnique({ where: { id } });

  if (!issue) {
    throw new NotFoundError('Compliance Issue');
  }

  const validTransitions = {
    [COMPLIANCE_STATUS.OPEN]: [COMPLIANCE_STATUS.IN_PROGRESS, COMPLIANCE_STATUS.CLOSED],
    [COMPLIANCE_STATUS.IN_PROGRESS]: [COMPLIANCE_STATUS.RESOLVED, COMPLIANCE_STATUS.CLOSED],
    [COMPLIANCE_STATUS.RESOLVED]: [COMPLIANCE_STATUS.CLOSED],
    [COMPLIANCE_STATUS.CLOSED]: [],
  };

  if (!validTransitions[issue.status]?.includes(newStatus)) {
    throw new BusinessRuleError(
      `Cannot transition compliance issue from ${issue.status} to ${newStatus}`
    );
  }

  return prisma.complianceIssue.update({
    where: { id },
    data: { status: newStatus },
    include: {
      department: { select: { id: true, name: true, code: true } },
      ownerEmployee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });
};

// ─── Resolve Compliance Issue ────────────────────────────────────

const resolveComplianceIssue = async (id, resolutionData) => {
  const issue = await prisma.complianceIssue.findUnique({ where: { id } });

  if (!issue) {
    throw new NotFoundError('Compliance Issue');
  }

  if (![COMPLIANCE_STATUS.OPEN, COMPLIANCE_STATUS.IN_PROGRESS].includes(issue.status)) {
    throw new BusinessRuleError(
      'Only OPEN or IN_PROGRESS issues can be resolved'
    );
  }

  return prisma.complianceIssue.update({
    where: { id },
    data: {
      status: COMPLIANCE_STATUS.RESOLVED,
      resolutionNotes: resolutionData.resolutionNotes,
      resolvedAt: new Date(),
    },
    include: {
      department: { select: { id: true, name: true, code: true } },
      ownerEmployee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });
};

// ─── Get Issues by Department ────────────────────────────────────

const getComplianceIssuesByDepartment = async (departmentId) => {
  return prisma.complianceIssue.findMany({
    where: { departmentId },
    include: {
      ownerEmployee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      audit: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

// ─── Get Overdue Issues ──────────────────────────────────────────

const getOverdueComplianceIssues = async () => {
  return prisma.complianceIssue.findMany({
    where: {
      dueDate: { lt: new Date() },
      status: {
        in: [COMPLIANCE_STATUS.OPEN, COMPLIANCE_STATUS.IN_PROGRESS],
      },
    },
    include: {
      department: { select: { id: true, name: true, code: true } },
      ownerEmployee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      audit: { select: { id: true, title: true } },
    },
    orderBy: { dueDate: 'asc' },
  });
};

module.exports = {
  getAllComplianceIssues,
  getComplianceIssueById,
  createComplianceIssue,
  updateComplianceIssue,
  updateComplianceIssueStatus,
  resolveComplianceIssue,
  getComplianceIssuesByDepartment,
  getOverdueComplianceIssues,
};
