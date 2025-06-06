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
import {
  createActionFinding,
  upsertAxeResults,
  upsertFinding,
} from "@/server/db/findings";
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
  await page
    .waitForNetworkIdle({ timeout: 2 * 1000, idleTime: 300 })
    .catch(async () => {
      await upsertFinding(db, {
        slug: "wait-for-network-idle",
        description: "Network idle timeout reached",
        name: "Network Idle Timeout",
        moreInfoURL: "/findings/wait-for-network-idle",
      });
    });

  // Wait for readyState to reach complete
  await page
    .waitForFunction(() => document.readyState === "complete", {
      timeout: 1000,
    })
    .catch(async () => {
      await upsertFinding(db, {
        slug: "document-ready-state",
        description: "Document readyState did not reach complete",
        name: "Document Ready State",
        moreInfoURL: "/findings/document-ready-state",
      });
    });

  // Wait for all elements to stabalize.
  await page
    .locator("*")
    .setTimeout(1000)
    .setWaitForStableBoundingBox(true)
    .waitHandle()
    .catch(async () => {
      await upsertFinding(db, {
        slug: "wait-for-stable-bounding-box",
        description: "Elements did not stabilize within the timeout",
        name: "Stable Bounding Box Timeout",
        moreInfoURL: "/findings/wait-for-stable-bounding-box",
      });
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

  await page.goto(startUrl);

  return page;
}

async function getObservations(page: Page) {
  await wait(page);
  const els = await getAccessibility(page);
  return els.map(toObservation);
}

function newInteractors(page: Page, campaignId: number, buddyId: number) {
  const record = async (f: () => Promise<BrowserAction>) => {
    const before = await getObservations(page);
    if (before.length === 0) {
      fixme("handle empty observations list");
      return;
    }

    const action = await f();

    const after = await getObservations(page);
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
    console.log(`Clicking on element with name: ${name}, role: ${role}`);
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
      console.log(`Typing value: ${value}`);
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
    fixme("Axe analyze failed", e);
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
