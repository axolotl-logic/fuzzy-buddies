"use server";

import { db } from "~/server/db";
import { findingsTable, type NewFinding } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createFinding(data: Partial<NewFinding>) {
  await db.insert(findingsTable).values(data);
  revalidatePath("/findings");
}

export async function updateFinding(id: number, data: Partial<NewFinding>) {
  await db.update(findingsTable).set(data).where(eq(findingsTable.id, id));
  revalidatePath(`/findings/${id}`);
}

export async function deleteFinding(id: number) {
  await db.delete(findingsTable).where(eq(findingsTable.id, id));
  revalidatePath("/findings");
}
