import { eq } from "drizzle-orm";
import type { DBHandle } from "./index";
import { actionsFindingsTable, findingsTable } from "./schema";
import type { Finding, NewFinding } from "~/types";
import type { AxeResults } from "axe-core";

export async function upsertFinding(
  db: DBHandle,
  finding: NewFinding,
): Promise<Finding> {
  await db.insert(findingsTable).values(finding).onConflictDoNothing();

  const [existing] = await db
    .select()
    .from(findingsTable)
    .where(eq(findingsTable.slug, finding.slug));

  if (!existing) {
    throw new Error(`Finding ${finding.slug} not found after upsert`);
  }

  return existing;
}

export async function getFindingBySlug(
  db: DBHandle,
  slug: string,
): Promise<Finding | undefined> {
  return await db.query.findingsTable.findFirst({
    where: (findings, { eq }) => eq(findings.slug, slug),
  });
}

export async function createActionFinding(
  db: DBHandle,
  params: {
    campaignId: number;
    actionId: number;
    findingId: number;
  },
): Promise<void> {
  await db.insert(actionsFindingsTable).values(params);
}

export async function upsertAxeResults(db: DBHandle, results: AxeResults) {
  return await Promise.all(
    results.violations.map(async (v) => {
      return await upsertFinding(db, {
        slug: v.id,
        description: v.help,
        name: v.description,
        moreInfoURL: v.helpUrl,
      });
    }),
  );
}
