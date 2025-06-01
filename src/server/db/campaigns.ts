import { eq } from "drizzle-orm";
import { type DBHandle } from "./index";
import { campaignsTable } from "./schema";
import type { Campaign } from "@/types";

export async function createCampaign(
  db: DBHandle,
  startUrl: string,
  depth: number,
): Promise<Campaign> {
  const [campaign] = await db
    .insert(campaignsTable)
    .values({ startUrl, depth, status: "started" })
    .returning();

  if (!campaign) {
    throw new Error("Failed to create campaign");
  }

  return campaign;
}

export async function finalizeCampaign(
  db: DBHandle,
  id: number,
): Promise<void> {
  await db
    .update(campaignsTable)
    .set({ status: "stopped", endedAt: new Date() })
    .where(eq(campaignsTable.id, id));
}

export async function getCampaignById(
  db: DBHandle,
  id: number,
): Promise<Campaign | undefined> {
  return await db.query.campaignsTable.findFirst({
    where: (campaigns, { eq }) => eq(campaigns.id, id),
  });
}

export async function listCampaigns(db: DBHandle): Promise<Campaign[]> {
  return await db.query.campaignsTable.findMany({
    orderBy: (campaigns, { desc }) => [desc(campaigns.startedAt)],
  });
}

export async function getCampaignsByUrl(
  db: DBHandle,
  startUrl: string,
): Promise<Campaign[]> {
  return await db.query.campaignsTable.findMany({
    where: (campaigns, { eq }) => eq(campaigns.startUrl, startUrl),
    orderBy: (campaigns, { desc }) => [desc(campaigns.startedAt)],
  });
}
