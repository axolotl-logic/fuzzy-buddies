"use server";

import puppeteer, { type Page } from "puppeteer";
import { AxePuppeteer } from "@axe-core/puppeteer";
import clicky from "./clicky";
import philly from "./philly";
import { addListeners } from "./listeners";
import { db, type Buddy, type Database, type Transaction } from "~/server/db";
import {
  actionsFindingsTable,
  actionsTable,
  buddiesTable,
  campaignsTable,
} from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { getAccessibility, getOne } from "./utils";
import { diffObservations, toObservation } from "./observations";
import type { ActionFunc } from "./types";
import { upsertAxeResults } from "./findings";

export async function upsertBuddy(tx: Transaction | Database, buddy: Buddy) {
  let rows = await tx
    .insert(buddiesTable)
    .values(buddy)
    .onConflictDoNothing()
    .returning({ id: buddiesTable.id });

  if (rows.length === 0) {
    rows = await db
      .select({ id: buddiesTable.id })
      .from(buddiesTable)
      .where(eq(buddiesTable.slug, buddy.slug));
  }

  return getOne(rows);
}

async function wait(page: Page) {
  // Wait for network to become idle for at least 300ms.
  // We assume that in that 300ms, any asynchronous requests will have
  // started.
  await page.waitForNetworkIdle({ timeout: 5000, idleTime: 1000 }).catch(() => {
    console.warn("FIXME: handle network never idle");
  });

  // Wait for all elements to stabalize. Note we've waited at least 300ms by now.
  await page
    .locator("*")
    .setWaitForStableBoundingBox(true)
    .waitHandle()
    .catch(() => {
      console.warn(
        "FIXME: handle an element not reachinga stable bounding box",
      );
    });

  // Finally, rely on the page.
  await page
    .waitForFunction(() => document.readyState === "complete")
    .catch(() => {
      console.warn("FIXME: handle document.readyState not reaching 'complete'");
    });
}

export async function launchCampaign({ targets }: { targets: Set<string> }) {
  const browser = await puppeteer.launch();
  const depth = 100;

  await db.transaction(async (tx) => {
    const campaignId = getOne(
      await tx
        .insert(campaignsTable)
        .values({
          depth,
          reproductionMode: false,
        })
        .returning({ id: campaignsTable.id }),
    ).id;

    const [clickyId, clickyAct] = await clicky();
    //const [phillyId, phillyAct] = await philly();

    const buddies: { id: number; act: ActionFunc }[] = [
      { id: clickyId, act: clickyAct },
      //{ id: phillyId, act: phillyAct },
    ];

    for (const { id: buddyId, act } of buddies) {
      for (const target of [...targets]) {
        const page = await browser.newPage();
        await page.setBypassCSP(true);

        addListeners(page);

        await page.goto(target, { timeout: 5000 });
        await wait(page);

        for (let step = 0; step < depth; step++) {
          const before = (await getAccessibility(page)).map(toObservation);
          if (before.length === 0) {
            console.error("FIXME: handle empty observations list");
            break;
          }

          const action = await act(page);
          if (action === null) {
            break;
          }

          console.log(action);

          const targetEl = page.locator(
            `::-p-aria([name="${action.name}"][role=${action.role}])`,
          ).setEnsureElementIsInTheViewport(false)
          .setVisibility(null)
          .setWaitForEnabled(false)
          .setWaitForStableBoundingBox(false)

          if (targetEl === null) {
            console.warn("FIXME: handle dissapearing elements");
            continue;
          } 

          switch (action.kind) {
            case "click": {
              try {
                await targetEl.click();
              } catch {
                console.error("FIXME: click interaction failed")
                continue;
              }
              break;
            }
            case "click-then-type":
              try {
                await targetEl.click();
              } catch {
                console.error("FIXME: click of click-then-type interaction failed")
                continue;
              }
              await page.keyboard.type(action.value);
              break;
          }

          await wait(page);

          const after = (await getAccessibility(page)).map(toObservation);
          const [added, removed] = diffObservations(before, after);

          const actionIdRows = await tx
            .insert(actionsTable)
            .values({
              campaignId,
              buddyId,
              before,
              after,
              added,
              removed,
              targetRole: action.role,
              targetName: action.name,
              value: "value" in action ? action.value : undefined,
              url: page.url(),
              kind: action.kind,
            })
            .returning({ id: actionsTable.id });

          const actionId = getOne(actionIdRows).id;
          const findings = [];

          try {
            const results = await new AxePuppeteer(page).analyze();
            findings.push(...(await upsertAxeResults(tx, results)));
          } catch (e) {
            console.error("FIXME: Axe analyze failed.", e);
          }


          for (const { id: findingId } of findings) {
            await tx.insert(actionsFindingsTable).values({
              campaignId,
              actionId,
              findingId,
            });
          }
        }
      }
    }

    /*
  const coverage = await page.coverage.stopJSCoverage();
  for (const c of coverage) {
  }
  */
  });

  await browser.close();
}
