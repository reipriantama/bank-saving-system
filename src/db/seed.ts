import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { depositoTypes, customers, accounts } from './schema';
import { eq } from 'drizzle-orm';

async function main() {
  const direct = process.env.DIRECT_URL;

  if (!direct) throw new Error('DIRECT_URL is not set');

  const client = postgres(direct, { max: 1, prepare: false });

  const db = drizzle(client);

  // Deposito types
  await db
    .insert(depositoTypes)
    .values([
      { name: 'Bronze', yearlyReturn: '0.03' },
      { name: 'Silver', yearlyReturn: '0.05' },
      { name: 'Gold', yearlyReturn: '0.07' },
    ])
    .onConflictDoNothing();

  // Sample customer + account (Gold)
  const [cust] = await db
    .insert(customers)
    .values({ name: 'John Miller' })
    .returning();

  const [gold] = await db
    .select()
    .from(depositoTypes)
    .where(eq(depositoTypes.name, 'Gold'));

  if (cust && gold) {
    await db.insert(accounts).values({
      packet: 'Standard',
      balance: '1000000',
      customerId: cust.id,
      depositoTypeId: gold.id,
    });
  }

  await client.end({ timeout: 5 });
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

