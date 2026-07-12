const { z } = require('zod');
const {
  CHALLENGE_STATUS,
  CHALLENGE_DIFFICULTY,
} = require('../constants/gamification.constants');

// ─── Create Challenge ────────────────────────────────────────────
const createChallengeSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(150, 'Title must not exceed 150 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters'),
  categoryId: z.string().uuid('Invalid category ID'),
  xpReward: z
    .number()
    .int('XP reward must be an integer')
    .nonnegative('XP reward must be 0 or greater'),
  difficulty: z.nativeEnum(CHALLENGE_DIFFICULTY, {
    errorMap: () => ({ message: 'Difficulty must be EASY, MEDIUM, or HARD' }),
  }),
  evidenceRequired: z.boolean().optional().default(false),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date string for start date',
    })
    .optional(),
  deadline: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date string for deadline',
    }),
}).refine(
  (data) => {
    if (data.startDate && data.deadline) {
      return new Date(data.startDate) < new Date(data.deadline);
    }
    return true;
  },
  {
    message: 'Deadline must be after start date',
    path: ['deadline'],
  }
);

// ─── Update Challenge ────────────────────────────────────────────
const updateChallengeSchema = z.object({
  title: z.string().min(5).max(150).optional(),
  description: z.string().min(10).optional(),
  categoryId: z.string().uuid().optional(),
  xpReward: z.number().int().nonnegative().optional(),
  difficulty: z.nativeEnum(CHALLENGE_DIFFICULTY).optional(),
  evidenceRequired: z.boolean().optional(),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date string for start date',
    })
    .optional()
    .nullable(),
  deadline: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date string for deadline',
    })
    .optional(),
  status: z.nativeEnum(CHALLENGE_STATUS).optional(),
}).refine(
  (data) => {
    if (data.startDate && data.deadline) {
      return new Date(data.startDate) < new Date(data.deadline);
    }
    return true;
  },
  {
    message: 'Deadline must be after start date',
    path: ['deadline'],
  }
);

// ─── Query Challenges ────────────────────────────────────────────
const queryChallengesSchema = z.object({
  status: z.nativeEnum(CHALLENGE_STATUS).optional(),
  difficulty: z.nativeEnum(CHALLENGE_DIFFICULTY).optional(),
  categoryId: z.string().uuid().optional(),
  search: z.string().optional(),
  page: z
    .string()
    .regex(/^\d+$/, 'Page must be a positive integer')
    .transform(Number)
    .optional()
    .default('1'),
  limit: z
    .string()
    .regex(/^\d+$/, 'Limit must be a positive integer')
    .transform(Number)
    .optional()
    .default('10'),
});

// ─── Params (UUID validation) ────────────────────────────────────
const challengeIdParamSchema = z.object({
  id: z.string().uuid('Invalid challenge ID'),
});

module.exports = {
  createChallengeSchema,
  updateChallengeSchema,
  queryChallengesSchema,
  challengeIdParamSchema,
};
