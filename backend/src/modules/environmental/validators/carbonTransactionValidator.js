const { z } = require('zod');

const createCarbonTransactionSchema = z.object({
  departmentId: z.string().uuid('Invalid department ID'),
  emissionFactorId: z.string().uuid('Invalid emission factor ID'),
  sourceType: z.enum(['PURCHASE', 'MANUFACTURING', 'FLEET', 'EXPENSE', 'MANUAL'], {
    errorMap: () => ({ message: 'Invalid source type' }),
  }),
  referenceId: z.string().max(100).optional(),
  quantity: z.number().positive('Quantity must be positive'),
  transactionDate: z.string().datetime({ message: 'Invalid transaction date' }),
});

module.exports = { createCarbonTransactionSchema };
