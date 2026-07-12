const prisma = require('../../../config/prisma');
const { NotFoundError, BusinessRuleError } = require('../../../shared/errors');
const {
  POLICY_STATUS,
  ACKNOWLEDGEMENT_STATUS,
  PAGINATION_DEFAULTS,
} = require('../constants/governance.constants');

// ─── List Acknowledgements (paginated, filterable) ───────────────

const getAllAcknowledgements = async (filters = {}, pagination = {}) => {
  const page = pagination.page || PAGINATION_DEFAULTS.page;
  const limit = pagination.limit || PAGINATION_DEFAULTS.limit;
  const skip = (page - 1) * limit;

  const where = {};
  if (filters.policyId) where.policyId = filters.policyId;
  if (filters.employeeId) where.employeeId = filters.employeeId;
  if (filters.status) where.status = filters.status;

  const [data, total] = await Promise.all([
    prisma.policyAcknowledgement.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        policy: {
          select: { id: true, title: true, policyCode: true, version: true },
        },
        employee: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    }),
    prisma.policyAcknowledgement.count({ where }),
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

// ─── Get Current User's Acknowledgements ─────────────────────────

const getMyAcknowledgements = async (employeeId) => {
  return prisma.policyAcknowledgement.findMany({
    where: { employeeId },
    orderBy: { createdAt: 'desc' },
    include: {
      policy: {
        select: {
          id: true,
          title: true,
          policyCode: true,
          version: true,
          acknowledgementDueDate: true,
        },
      },
    },
  });
};

// ─── Acknowledge a Policy ────────────────────────────────────────

const acknowledgePolicy = async (acknowledgementId, employeeId) => {
  const ack = await prisma.policyAcknowledgement.findUnique({
    where: { id: acknowledgementId },
  });

  if (!ack) {
    throw new NotFoundError('Acknowledgement');
  }

  if (ack.employeeId !== employeeId) {
    throw new BusinessRuleError(
      'You can only acknowledge your own assigned policies'
    );
  }

  if (ack.status === ACKNOWLEDGEMENT_STATUS.ACKNOWLEDGED) {
    throw new BusinessRuleError('Policy already acknowledged');
  }

  return prisma.policyAcknowledgement.update({
    where: { id: acknowledgementId },
    data: {
      status: ACKNOWLEDGEMENT_STATUS.ACKNOWLEDGED,
      acknowledgedAt: new Date(),
    },
    include: {
      policy: { select: { id: true, title: true, policyCode: true } },
    },
  });
};

// ─── Distribute Policy to Employees ──────────────────────────────

const distributePolicy = async (policyId, employeeIds) => {
  const policy = await prisma.esgPolicy.findUnique({
    where: { id: policyId },
  });

  if (!policy) {
    throw new NotFoundError('Policy');
  }

  if (policy.status !== POLICY_STATUS.PUBLISHED) {
    throw new BusinessRuleError('Only PUBLISHED policies can be distributed');
  }

  const records = employeeIds.map((employeeId) => ({
    policyId,
    employeeId,
    policyVersion: policy.version,
    status: ACKNOWLEDGEMENT_STATUS.PENDING,
  }));

  const result = await prisma.policyAcknowledgement.createMany({
    data: records,
    skipDuplicates: true,
  });

  return {
    distributed: result.count,
    policyId,
    policyVersion: policy.version,
  };
};

// ─── Get Overdue Acknowledgements ────────────────────────────────

const getOverdueAcknowledgements = async () => {
  return prisma.policyAcknowledgement.findMany({
    where: {
      status: ACKNOWLEDGEMENT_STATUS.PENDING,
      policy: {
        acknowledgementDueDate: { lt: new Date() },
      },
    },
    include: {
      policy: {
        select: {
          id: true,
          title: true,
          policyCode: true,
          acknowledgementDueDate: true,
        },
      },
      employee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
};

// ─── Send Reminder ───────────────────────────────────────────────

const sendReminder = async (acknowledgementId) => {
  const ack = await prisma.policyAcknowledgement.findUnique({
    where: { id: acknowledgementId },
  });

  if (!ack) {
    throw new NotFoundError('Acknowledgement');
  }

  if (ack.status === ACKNOWLEDGEMENT_STATUS.ACKNOWLEDGED) {
    throw new BusinessRuleError(
      'Cannot send reminder for already acknowledged policy'
    );
  }

  return prisma.policyAcknowledgement.update({
    where: { id: acknowledgementId },
    data: {
      reminderCount: { increment: 1 },
      lastRemindedAt: new Date(),
    },
    include: {
      policy: { select: { id: true, title: true } },
      employee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });
};

module.exports = {
  getAllAcknowledgements,
  getMyAcknowledgements,
  acknowledgePolicy,
  distributePolicy,
  getOverdueAcknowledgements,
  sendReminder,
};
