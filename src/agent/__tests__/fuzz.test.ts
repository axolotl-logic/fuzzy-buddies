import { expect, test } from "vitest";
import { launchCampaign } from "../fuzz";
import { db } from "@/server/db";
import { getActionsByCampaignId } from "@/server/db/actions";

test(
  "launches campaign with clicky buddy",
  async () => {
    const campaign = await launchCampaign(db, {
      depth: 1,
      startUrl: "https://forms.gle/p9Z6pvx7mUVZnXkZ7",
      buddySlug: "clicky",
    });
    expect(campaign).toBeDefined();
    if (!campaign) {
      return;
    }

    const actions = await getActionsByCampaignId(db, campaign.id);
    expect(actions.length).toBeGreaterThan(0);
  },
  { timeout: 30_000 },
);

test(
  "launches campaign with philly buddy",
  async () => {
    const campaign = await launchCampaign(db, {
      depth: 3,
      startUrl: "https://forms.gle/p9Z6pvx7mUVZnXkZ7",
      buddySlug: "philly",
    });

    expect(campaign).toBeDefined();
    if (!campaign) {
      return;
    }

    const actions = await getActionsByCampaignId(db, campaign.id);
    expect(actions.length).toBeGreaterThan(0);
  },
  { timeout: 30_000 },
);
