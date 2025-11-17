import { z } from 'zod';

// Customer schemas
export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
});

export const updateCustomerSchema = createCustomerSchema.partial();

// Deposito Type schemas
export const createDepositoTypeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  yearlyReturn: z
    .union([
      z.number().min(0, 'Yearly return must be positive').max(1, 'Yearly return cannot exceed 100%'),
      z
        .string()
        .min(1, 'Yearly return is required')
        .refine(
          (val) => {
            const num = parseFloat(val);
            return !isNaN(num) && num >= 0 && num <= 1;
          },
          { message: 'Yearly return must be between 0 and 1' }
        )
        .transform((val) => parseFloat(val))
    ])
    .transform((val) => typeof val === 'number' ? val : parseFloat(val)),
});

export const updateDepositoTypeSchema = createDepositoTypeSchema.partial();

// Account schemas
export const createAccountSchema = z.object({
  packet: z.string().min(1, 'Packet is required').max(255, 'Packet is too long'),
  balance: z
    .string()
    .min(1, 'Balance is required')
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0;
      },
      { message: 'Balance must be a positive number' }
    )
    .transform((val) => parseFloat(val))
    .pipe(z.number().min(0, 'Balance must be positive')),
  customerId: z.string().uuid('Customer ID must be a valid UUID'),
  depositoTypeId: z.string().uuid('Deposito Type ID must be a valid UUID'),
});

export const updateAccountSchema = z.object({
  packet: z.string().min(1).max(255).optional(),
  customerId: z.string().uuid().optional(),
  depositoTypeId: z.string().uuid().optional(),
});

// Transaction schemas
export const depositSchema = z.object({
  accountId: z.string().uuid('Account ID must be a valid UUID'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      { message: 'Amount must be a positive number' }
    )
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive('Amount must be positive')),
  date: z.preprocess(
    (val) => {
      if (val instanceof Date) return val;
      if (typeof val === 'string') {
        // Handle datetime-local format (YYYY-MM-DDTHH:mm) by converting to ISO string
        if (val.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
          return new Date(val).toISOString();
        }
        return val;
      }
      return val;
    },
    z
      .string()
      .datetime()
      .or(z.date())
      .transform((val) => (typeof val === 'string' ? new Date(val) : val))
  ),
});

export const withdrawSchema = z.object({
  accountId: z.string().uuid('Account ID must be a valid UUID'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      { message: 'Amount must be a positive number' }
    )
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive('Amount must be positive')),
  date: z.preprocess(
    (val) => {
      if (val instanceof Date) return val;
      if (typeof val === 'string') {
        // Handle datetime-local format (YYYY-MM-DDTHH:mm) by converting to ISO string
        if (val.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
          return new Date(val).toISOString();
        }
        return val;
      }
      return val;
    },
    z
      .string()
      .datetime()
      .or(z.date())
      .transform((val) => (typeof val === 'string' ? new Date(val) : val))
  ),
});

