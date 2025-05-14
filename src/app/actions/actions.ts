"use server";

import { db } from "~/server/db";
import { actionsTable, type NewAction } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createAction(data: NewAction) {
  await db.insert(actionsTable).values(data);
  revalidatePath("/actions");
}

export async function updateAction(id: number, data: Partial<NewAction>) {
  await db.update(actionsTable).set(data).where(eq(actionsTable.id, id));
  revalidatePath(`/actions/${id}`);
}

export async function deleteAction(id: number) {
  await db.delete(actionsTable).where(eq(actionsTable.id, id));
  revalidatePath("/actions");
}
