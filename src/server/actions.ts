"use server";

import { db } from "./db";
import { getBuddyBySlug, listBuddies } from "./db/buddies";
import { getCampaignById, listCampaigns } from "./db/campaigns";
import { getActionsByCampaign } from "./db/actions";
import { listHints } from "./db/hints";
import { findingsTable } from "./db/schema";
import { launchCampaign } from "~/agent/fuzz";

export async function getBuddy(slug: string) {
  return await getBuddyBySlug(db, slug);
}

export async function getAllBuddies() {
  return await listBuddies(db);
}

export async function getCampaign(id: number) {
  return await getCampaignById(db, id);
}

export async function getAllCampaigns() {
  return await listCampaigns(db);
}

export async function getCampaignActions(id: number) {
  return await getActionsByCampaign(db, id);
}

export async function getAllHints() {
  return await listHints(db);
}

export async function getAllFindings() {
  return await db.select().from(findingsTable);
}

export async function startCampaign(startUrl: string) {
  return await launchCampaign(db, { startUrl, buddySlug: "clicky" });
}
