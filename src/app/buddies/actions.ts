"use server";

import { db } from "~/server/db";
import { buddiesTable, type NewBuddy } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createBuddy(data: NewBuddy) {
  await db.insert(buddiesTable).values(data);
  revalidatePath("/buddies");
}

export async function updateBuddy(id: number, data: Partial<NewBuddy>) {
  await db.update(buddiesTable).set(data).where(eq(buddiesTable.id, id));
  revalidatePath(`/buddies/${id}`);
}

export async function deleteBuddy(id: number) {
  await db.delete(buddiesTable).where(eq(buddiesTable.id, id));
  revalidatePath("/buddies");
}
