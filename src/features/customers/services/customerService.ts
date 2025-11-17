import { db } from '@/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFoundError, conflictError } from '@/lib/errors';

export async function listCustomers() {
  return await db.select().from(customers);
}

export async function getCustomerById(id: string) {
  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, id));

  if (!customer) {
    throw notFoundError('Customer', id);
  }

  return customer;
}

export async function createCustomer(data: { name: string }) {
  try {
    const [customer] = await db
      .insert(customers)
      .values(data)
      .returning();

    return customer;
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === '23505'
    ) {
      throw conflictError('Customer with this name already exists');
    }
    throw error;
  }
}

export async function updateCustomer(
  id: string,
  data: { name?: string }
): Promise<typeof customers.$inferSelect> {
  await getCustomerById(id); // Throws if not found

  try {
    const [updated] = await db
      .update(customers)
      .set(data)
      .where(eq(customers.id, id))
      .returning();

    return updated;
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === '23505'
    ) {
      throw conflictError('Customer with this name already exists');
    }
    throw error;
  }
}

export async function deleteCustomer(id: string): Promise<void> {
  await getCustomerById(id); // Throws if not found
  await db.delete(customers).where(eq(customers.id, id));
}

