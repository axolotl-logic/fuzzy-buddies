"use server";

import puppeteer, { type Browser, type Page } from "puppeteer";
import { AxePuppeteer } from "@axe-core/puppeteer";
import clicky from "./clicky";
import philly from "./philly";
import { addListeners } from "./listeners";
import { db, type DBHandle } from "@/server/db";
import { getAccessibility } from "./utils";
import { diffObservations, toObservation } from "./observations";
import type { ActionFunc, BrowserAction, Buddy } from "@/types";
import {
  createCampaign,
  finalizeCampaign,
  getCampaignById,
} from "@/server/db/campaigns";
import { createAction } from "@/server/db/actions";
import { createActionFinding, upsertAxeResults } from "@/server/db/findings";
import { fixme } from "./config";

/**
 * Launches a campaign to test a website for accessibility issues
 */
export async function launchCampaign(
  db: DBHandle,
  {
    startUrl,
    buddySlug,
    depth,
  }: {
    startUrl: string;
    depth?: number;
    buddySlug: "clicky" | "philly";
  },
) {
  depth ??= 5;

  const browser = await puppeteer.launch();
  const buddies = await setupBuddies(db);
  const buddy = buddies.find((b) => b.buddy.slug === buddySlug);
  if (!buddy) {
    throw new Error(`Buddy ${buddySlug} not found`);
  }

  const campaign = await createCampaign(db, startUrl, depth);

  try {
    const page = await setupPage(browser, startUrl);
    const interactors = newInteractors(page, campaign.id, buddy.buddy.id);

    for (let step = 0; step < depth; step++) {
      const observations = await getAccessibility(page);
      if (observations.length === 0) {
        fixme("handle empty observations list");
        break;
      }
      await buddy.act({ observations, ...interactors });
    }
  } finally {
    await finalizeCampaign(db, campaign.id);
    await browser.close();
  }

  return getCampaignById(db, campaign.id);
}

async function wait(page: Page) {
  // Wait for network to become idle for at least 300ms.
  // We assume that in that 300ms, any asynchronous requests will have
  // started.
  await page.waitForNetworkIdle({ timeout: 5000, idleTime: 1000 }).catch(() => {
    fixme("handle network never idle");
  });

  // Wait for readyState to reach complete
  await page
    .waitForFunction(() => document.readyState === "complete")
    .catch(() => {
      fixme("handle document.readyState not reaching 'complete'");
    });

  // Wait for all elements to stabalize.
  await page
    .locator("*")
    .setWaitForStableBoundingBox(true)
    .waitHandle()
    .catch(() => {
      fixme("handle an element not reaching a stable bounding box");
    });
}

/**
 * Sets up the buddies that will perform actions
 */
async function setupBuddies(
  db: DBHandle,
): Promise<{ buddy: Buddy; act: ActionFunc }[]> {
  const [clickyBuddy, clickyAct] = await clicky(db);
  const [phillyBuddy, phillyAct] = await philly(db);

  return [
    { buddy: clickyBuddy, act: clickyAct },
    { buddy: phillyBuddy, act: phillyAct },
  ];
}

/**
 * Sets up a new page for a buddy
 */
async function setupPage(browser: Browser, startUrl: string): Promise<Page> {
  const page = await browser.newPage();
  await page.setBypassCSP(true);

  addListeners(page);

  await page.goto(startUrl, { timeout: 5000 });
  await wait(page);

  return page;
}

function newInteractors(page: Page, campaignId: number, buddyId: number) {
  const record = async (f: () => Promise<BrowserAction>) => {
    const before = (await getAccessibility(page)).map(toObservation);
    if (before.length === 0) {
      fixme("handle empty observations list");
      return;
    }

    const action = await f();

    const after = (await getAccessibility(page)).map(toObservation);
    const screenshotAfter = await page.screenshot({ encoding: "base64" });
    const [added, removed] = diffObservations(before, after);

    const actionResult = await createAction(db, {
      campaignId,
      buddyId,
      before,
      after,
      added,
      removed,
      targetRole: action.role,
      targetName: action.name,
      screenshotAfter: screenshotAfter,
      value: "value" in action ? action.value : undefined,
      url: page.url(),
      kind: action.kind,
    });

    await recordFindings(page, campaignId, actionResult.id);
  };

  const click = async ({ name, role }: { name: string; role: string }) => {
    return await record(async () => {
      await page
        .locator(`::-p-aria([name="${name}"][role=${role}])`)
        .setEnsureElementIsInTheViewport(false)
        .setVisibility(null)
        .setWaitForEnabled(false)
        .setWaitForStableBoundingBox(false)
        .click();

      return { name, role, kind: "click" };
    });
  };

  const keyboardType = async (value: string) => {
    await record(async () => {
      await page.keyboard.type(value);
      return { value, kind: "keyboard-type", name: undefined, role: undefined };
    });
  };

  return { keyboardType, click };
}

async function recordFindings(
  page: Page,
  campaignId: number,
  actionId: number,
): Promise<void> {
  const findings = [];

  try {
    const results = await new AxePuppeteer(page).analyze();
    findings.push(...(await upsertAxeResults(db, results)));
  } catch (e) {
    console.error("FIXME: Axe analyze failed.", e);
    return;
  }

  for (const { id: findingId } of findings) {
    await createActionFinding(db, {
      campaignId,
      actionId,
      findingId,
    });
  }
}
