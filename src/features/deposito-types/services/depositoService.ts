import { db } from "@/db";
import { depositoTypes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFoundError, conflictError } from "@/lib/errors";
import { UpdateDepositoTypeInput } from "../types/depositoType";

export async function listDepositoTypes() {
  return await db.select().from(depositoTypes);
}

export async function getDepositoTypeById(id: string) {
  const [depositoType] = await db
    .select()
    .from(depositoTypes)
    .where(eq(depositoTypes.id, id));

  if (!depositoType) {
    throw notFoundError("Deposito Type", id);
  }

  return depositoType;
}

export async function createDepositoType(data: {
  name: string;
  yearlyReturn: string;
}) {
  try {
    const [depositoType] = await db
      .insert(depositoTypes)
      .values(data)
      .returning();

    return depositoType;
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "23505"
    ) {
      throw conflictError("Deposito Type with this name already exists");
    }
    throw error;
  }
}

export async function updateDepositoType(
  id: string,
  data: UpdateDepositoTypeInput
) {
  await getDepositoTypeById(id); // Throws if not found

  try {
    const [updated] = await db
      .update(depositoTypes)
      .set({
        name: data.name,
        yearlyReturn: data.yearlyReturn?.toString(),
      })
      .where(eq(depositoTypes.id, id))
      .returning();

    return updated;
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "23505"
    ) {
      throw conflictError("Deposito Type with this name already exists");
    }
    throw error;
  }
}

export async function deleteDepositoType(id: string): Promise<void> {
  await getDepositoTypeById(id); // Throws if not found
  await db.delete(depositoTypes).where(eq(depositoTypes.id, id));
}
