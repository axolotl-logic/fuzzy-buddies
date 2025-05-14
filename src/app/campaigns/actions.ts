"use server";

import { db } from "~/server/db";
import { campaignsTable, type NewCampaign } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createCampaign(data: NewCampaign) {
  await db.insert(campaignsTable).values(data);
  revalidatePath("/campaigns");
}

export async function updateCampaign(id: number, data: Partial<NewCampaign>) {
  await db.update(campaignsTable).set(data).where(eq(campaignsTable.id, id));
  revalidatePath(`/campaigns/${id}`);
}

export async function deleteCampaign(id: number) {
  await db.delete(campaignsTable).where(eq(campaignsTable.id, id));
  revalidatePath("/campaigns");
}
