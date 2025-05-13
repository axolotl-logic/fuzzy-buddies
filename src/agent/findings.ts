import AxePuppeteer from "@axe-core/puppeteer";
import type { AxeResults } from "axe-core";
import type { Page } from "puppeteer";
import type { Database, DBHandle, Transaction } from "~/server/db";
import { findingsTable } from "~/server/db/schema";
import { getOne } from "./utils";
import { eq } from "drizzle-orm";

export async function upsertAxeResults(db: DBHandle, results: AxeResults) {
  return await Promise.all(
    results.violations.map(async (v) => {
      const finding = { slug: v.id, description: v.description };
      await db.insert(findingsTable).values(finding).onConflictDoNothing();
      const findingId = getOne(
        await db
          .select({ id: findingsTable.id })
          .from(findingsTable)
          .where(eq(findingsTable.slug, finding.slug)),
      ).id;

      return { ...finding, id: findingId };
    }),
  );
}
