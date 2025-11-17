import {
  pgTable,
  uuid,
  text,
  numeric,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const txnTypeEnum = pgEnum('txn_type', ['deposit', 'withdraw']);

export const customers = pgTable('customers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
});

export const depositoTypes = pgTable('deposito_types', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  // store as decimal fraction: e.g., 0.03 (3%), 0.05, 0.07
  yearlyReturn: numeric('yearly_return', { precision: 12, scale: 6 })
    .notNull(),
});

export const accounts = pgTable('accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  packet: text('packet').notNull(),
  balance: numeric('balance', { precision: 18, scale: 2 })
    .notNull()
    .default('0'),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),
  depositoTypeId: uuid('deposito_type_id')
    .notNull()
    .references(() => depositoTypes.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at', { withTimezone: false })
    .notNull()
    .defaultNow(),
});

export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: txnTypeEnum('type').notNull(),
  amount: numeric('amount', { precision: 18, scale: 2 }).notNull(),
  date: timestamp('date', { withTimezone: false }).notNull(),
  accountId: uuid('account_id')
    .notNull()
    .references(() => accounts.id, { onDelete: 'cascade' }),
});

export const customersRelations = relations(customers, ({ many }) => ({
  accounts: many(accounts),
}));

export const depositoTypesRelations = relations(depositoTypes, ({ many }) => ({
  accounts: many(accounts),
}));

export const accountsRelations = relations(accounts, ({ many, one }) => ({
  customer: one(customers, {
    fields: [accounts.customerId],
    references: [customers.id],
  }),
  depositoType: one(depositoTypes, {
    fields: [accounts.depositoTypeId],
    references: [depositoTypes.id],
  }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
}));

