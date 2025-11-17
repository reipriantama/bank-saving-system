import { db } from '@/db';
import { transactions, accounts, depositoTypes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFoundError, badRequestError } from '@/lib/errors';
import { calculateEndingBalance } from '@/lib/calc';
import { differenceInMonths } from 'date-fns';

export async function deposit(data: {
  accountId: string;
  amount: string;
  date: Date;
}) {
  const [account] = await db
    .select({
      id: accounts.id,
      balance: accounts.balance,
      createdAt: accounts.createdAt,
    })
    .from(accounts)
    .where(eq(accounts.id, data.accountId));

  if (!account) {
    throw notFoundError('Account', data.accountId);
  }

  const currentBalance = parseFloat(account.balance);
  const depositAmount = parseFloat(data.amount);
  const newBalance = (currentBalance + depositAmount).toFixed(2);

  // Update account balance
  await db
    .update(accounts)
    .set({ balance: newBalance })
    .where(eq(accounts.id, data.accountId));

  // Create transaction record
  const [transaction] = await db
    .insert(transactions)
    .values({
      type: 'deposit',
      amount: data.amount,
      date: data.date,
      accountId: data.accountId,
    })
    .returning();

  return transaction;
}

export async function withdraw(data: {
  accountId: string;
  amount: string;
  date: Date;
}) {
  const [account] = await db
    .select({
      id: accounts.id,
      balance: accounts.balance,
      createdAt: accounts.createdAt,
      depositoTypeId: accounts.depositoTypeId,
    })
    .from(accounts)
    .where(eq(accounts.id, data.accountId));

  if (!account) {
    throw notFoundError('Account', data.accountId);
  }

  const [depositoType] = await db
    .select()
    .from(depositoTypes)
    .where(eq(depositoTypes.id, account.depositoTypeId));

  if (!depositoType) {
    throw notFoundError('Deposito Type', account.depositoTypeId);
  }

  const currentBalance = parseFloat(account.balance);
  const withdrawAmount = parseFloat(data.amount);

  if (withdrawAmount > currentBalance) {
    throw badRequestError(
      'Insufficient balance',
      `Current balance: ${currentBalance}, Requested: ${withdrawAmount}`
    );
  }

  // Calculate months from account creation to withdrawal date
  const months = differenceInMonths(data.date, account.createdAt);

  // Calculate ending balance with interest
  const yearlyReturn = parseFloat(depositoType.yearlyReturn);
  const endingBalance = calculateEndingBalance(
    currentBalance,
    yearlyReturn,
    months
  );

  // Deduct withdrawal amount
  const newBalance = (endingBalance - withdrawAmount).toFixed(2);

  // Update account balance
  await db
    .update(accounts)
    .set({ balance: newBalance })
    .where(eq(accounts.id, data.accountId));

  // Create transaction record
  const [transaction] = await db
    .insert(transactions)
    .values({
      type: 'withdraw',
      amount: data.amount,
      date: data.date,
      accountId: data.accountId,
    })
    .returning();

  return {
    transaction,
    calculation: {
      startingBalance: currentBalance,
      months,
      yearlyReturn,
      monthlyReturn: yearlyReturn / 12,
      endingBalance,
    },
  };
}

export async function getAccountTransactions(accountId: string) {
  const [account] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.id, accountId));

  if (!account) {
    throw notFoundError('Account', accountId);
  }

  return await db
    .select()
    .from(transactions)
    .where(eq(transactions.accountId, accountId))
    .orderBy(transactions.date);
}

