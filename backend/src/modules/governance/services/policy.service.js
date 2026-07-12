const prisma = require('../../../config/prisma');
const { NotFoundError, ConflictError, BusinessRuleError } = require('../../../shared/errors');
const { POLICY_STATUS, PAGINATION_DEFAULTS } = require('../constants/governance.constants');

// ─── List Policies (paginated, filterable) ───────────────────────

const getAllPolicies = async (filters = {}, pagination = {}) => {
  const page = pagination.page || PAGINATION_DEFAULTS.page;
  const limit = pagination.limit || PAGINATION_DEFAULTS.limit;
  const skip = (page - 1) * limit;

  const where = {};
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { policyCode: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.esgPolicy.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        ownerEmployee: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    }),
    prisma.esgPolicy.count({ where }),
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

// ─── Get Single Policy ───────────────────────────────────────────

const getPolicyById = async (id) => {
  const policy = await prisma.esgPolicy.findUnique({
    where: { id },
    include: {
      ownerEmployee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      _count: { select: { acknowledgements: true } },
    },
  });

  if (!policy) {
    throw new NotFoundError('Policy');
  }

  return policy;
};

// ─── Create Policy ───────────────────────────────────────────────

const createPolicy = async (data) => {
  const existing = await prisma.esgPolicy.findUnique({
    where: { policyCode: data.policyCode },
  });

  if (existing) {
    throw new ConflictError('A policy with this code already exists');
  }

  return prisma.esgPolicy.create({
    data,
    include: {
      ownerEmployee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });
};

// ─── Update Policy (DRAFT only) ──────────────────────────────────

const updatePolicy = async (id, data) => {
  const policy = await prisma.esgPolicy.findUnique({ where: { id } });

  if (!policy) {
    throw new NotFoundError('Policy');
  }

  if (policy.status !== POLICY_STATUS.DRAFT) {
    throw new BusinessRuleError('Only DRAFT policies can be updated');
  }

  return prisma.esgPolicy.update({
    where: { id },
    data,
    include: {
      ownerEmployee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });
};

// ─── Update Policy Status (validated transitions) ────────────────

const updatePolicyStatus = async (id, newStatus) => {
  const policy = await prisma.esgPolicy.findUnique({ where: { id } });

  if (!policy) {
    throw new NotFoundError('Policy');
  }

  const validTransitions = {
    [POLICY_STATUS.DRAFT]: [POLICY_STATUS.PUBLISHED],
    [POLICY_STATUS.PUBLISHED]: [POLICY_STATUS.ARCHIVED],
    [POLICY_STATUS.ARCHIVED]: [],
  };

  if (!validTransitions[policy.status]?.includes(newStatus)) {
    throw new BusinessRuleError(
      `Cannot transition policy from ${policy.status} to ${newStatus}`
    );
  }

  const updateData = { status: newStatus };
  if (newStatus === POLICY_STATUS.ARCHIVED) {
    updateData.archivedAt = new Date();
  }

  return prisma.esgPolicy.update({
    where: { id },
    data: updateData,
    include: {
      ownerEmployee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });
};

// ─── Delete (Archive) Policy ─────────────────────────────────────

const deletePolicy = async (id) => {
  const policy = await prisma.esgPolicy.findUnique({ where: { id } });

  if (!policy) {
    throw new NotFoundError('Policy');
  }

  return prisma.esgPolicy.update({
    where: { id },
    data: {
      status: POLICY_STATUS.ARCHIVED,
      archivedAt: new Date(),
    },
  });
};

// ─── Acknowledgement Statistics ──────────────────────────────────

const getAcknowledgementStats = async (policyId) => {
  const policy = await prisma.esgPolicy.findUnique({
    where: { id: policyId },
  });

  if (!policy) {
    throw new NotFoundError('Policy');
  }

  const stats = await prisma.policyAcknowledgement.groupBy({
    by: ['status'],
    where: { policyId },
    _count: { status: true },
  });

  const total = stats.reduce((sum, s) => sum + s._count.status, 0);
  const acknowledged =
    stats.find((s) => s.status === 'ACKNOWLEDGED')?._count.status || 0;
  const pending =
    stats.find((s) => s.status === 'PENDING')?._count.status || 0;
  const overdue =
    stats.find((s) => s.status === 'OVERDUE')?._count.status || 0;

  return { policyId, total, acknowledged, pending, overdue };
};

module.exports = {
  getAllPolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  updatePolicyStatus,
  deletePolicy,
  getAcknowledgementStats,
};
