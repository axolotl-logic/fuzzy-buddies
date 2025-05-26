import { eq } from "drizzle-orm";
import type { DBHandle } from "./index";
import { actionsTable } from "./schema";
import type { Action, NewAction } from "~/types";

export async function createAction(
  db: DBHandle,
  action: NewAction,
): Promise<Action> {
  const [result] = await db.insert(actionsTable).values(action).returning();

  if (!result) {
    throw new Error("Failed to create action");
  }

  return result;
}

export async function getActionsByCampaign(
  db: DBHandle,
  campaignId: number,
): Promise<Action[]> {
  return await db
    .select()
    .from(actionsTable)
    .where(eq(actionsTable.campaignId, campaignId));
}
