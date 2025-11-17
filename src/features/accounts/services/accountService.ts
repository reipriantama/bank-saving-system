import { db } from '@/db';
import { accounts, customers, depositoTypes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFoundError } from '@/lib/errors';

export async function listAccounts() {
  return await db
    .select({
      id: accounts.id,
      packet: accounts.packet,
      balance: accounts.balance,
      customerId: accounts.customerId,
      depositoTypeId: accounts.depositoTypeId,
      createdAt: accounts.createdAt,
      customer: {
        id: customers.id,
        name: customers.name,
      },
      depositoType: {
        id: depositoTypes.id,
        name: depositoTypes.name,
        yearlyReturn: depositoTypes.yearlyReturn,
      },
    })
    .from(accounts)
    .leftJoin(customers, eq(accounts.customerId, customers.id))
    .leftJoin(depositoTypes, eq(accounts.depositoTypeId, depositoTypes.id));
}

export async function getAccountById(id: string) {
  const [account] = await db
    .select({
      id: accounts.id,
      packet: accounts.packet,
      balance: accounts.balance,
      customerId: accounts.customerId,
      depositoTypeId: accounts.depositoTypeId,
      createdAt: accounts.createdAt,
      customer: {
        id: customers.id,
        name: customers.name,
      },
      depositoType: {
        id: depositoTypes.id,
        name: depositoTypes.name,
        yearlyReturn: depositoTypes.yearlyReturn,
      },
    })
    .from(accounts)
    .leftJoin(customers, eq(accounts.customerId, customers.id))
    .leftJoin(depositoTypes, eq(accounts.depositoTypeId, depositoTypes.id))
    .where(eq(accounts.id, id));

  if (!account) {
    throw notFoundError('Account', id);
  }

  return account;
}

export async function createAccount(data: {
  packet: string;
  balance: string;
  customerId: string;
  depositoTypeId: string;
}) {
  // Verify customer exists
  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, data.customerId));

  if (!customer) {
    throw notFoundError('Customer', data.customerId);
  }

  // Verify deposito type exists
  const [depositoType] = await db
    .select()
    .from(depositoTypes)
    .where(eq(depositoTypes.id, data.depositoTypeId));

  if (!depositoType) {
    throw notFoundError('Deposito Type', data.depositoTypeId);
  }

  const [account] = await db.insert(accounts).values(data).returning();

  return getAccountById(account.id);
}

export async function updateAccount(
  id: string,
  data: {
    packet?: string;
    customerId?: string;
    depositoTypeId?: string;
  }
) {
  await getAccountById(id); // Throws if not found

  // Verify customer exists if updating
  if (data.customerId) {
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, data.customerId));

    if (!customer) {
      throw notFoundError('Customer', data.customerId);
    }
  }

  // Verify deposito type exists if updating
  if (data.depositoTypeId) {
    const [depositoType] = await db
      .select()
      .from(depositoTypes)
      .where(eq(depositoTypes.id, data.depositoTypeId));

    if (!depositoType) {
      throw notFoundError('Deposito Type', data.depositoTypeId);
    }
  }

  await db.update(accounts).set(data).where(eq(accounts.id, id));

  return getAccountById(id);
}

export async function deleteAccount(id: string): Promise<void> {
  await getAccountById(id); // Throws if not found
  await db.delete(accounts).where(eq(accounts.id, id));
}

