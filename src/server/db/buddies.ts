import { eq } from "drizzle-orm";
import type { DBHandle } from "./index";
import { buddiesTable } from "./schema";
import type { Buddy, NewBuddy } from "~/types";

export async function upsertBuddy(
  db: DBHandle,
  buddy: NewBuddy,
): Promise<Buddy> {
  await db.insert(buddiesTable).values(buddy).onConflictDoNothing();

  const [existing] = await db
    .select()
    .from(buddiesTable)
    .where(eq(buddiesTable.slug, buddy.slug));

  if (!existing) {
    throw new Error(`Buddy ${buddy.slug} not found after upsert`);
  }

  return existing;
}

export async function getBuddyBySlug(
  db: DBHandle,
  slug: string,
): Promise<Buddy | undefined> {
  return await db.query.buddiesTable.findFirst({
    where: (buddies, { eq }) => eq(buddies.slug, slug),
  });
}

export async function listBuddies(db: DBHandle): Promise<Buddy[]> {
  return await db.select().from(buddiesTable);
}
