import { expect, test } from "vitest";
import { launchCampaign } from "../fuzz";
import { db } from "@/server/db";
import { getActionsByCampaignId } from "@/server/db/actions";

const TEST_URL = "https://example.com";

test("launches campaign with clicky buddy", async () => {
  const campaign = await launchCampaign(db, {
    depth: 2,
    startUrl: TEST_URL,
    buddySlug: "clicky",
  });
  expect(campaign).toBeDefined();
  if (!campaign) {
    return;
  }

  const actions = await getActionsByCampaignId(db, campaign.id);
  expect(actions.length).toBeGreaterThan(0);
}, 30000); // Increase timeout for real browser interaction

test("launches campaign with philly buddy", async () => {
  const campaign = await launchCampaign(db, {
    depth: 2,
    startUrl: TEST_URL,
    buddySlug: "philly",
  });

  expect(campaign).toBeDefined();
  if (!campaign) {
    return;
  }

  const actions = await getActionsByCampaignId(db, campaign.id);
  expect(actions.length).toBeGreaterThan(0);
}, 30000);
