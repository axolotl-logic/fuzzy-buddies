import { expect, test } from "vitest";
import { makeMockInteractors } from "./buddy-test-utils";
import clicky from "../clicky";
import { db } from "@/server/db";
import { getBuddyBySlug } from "@/server/db/buddies";

test("creates clicky in database", async () => {
  const [buddy] = await clicky(db);
  expect(buddy.slug).toBe("clicky");

  const persisted = await getBuddyBySlug(db, buddy.slug);
  expect(persisted).toBeDefined();
});

test("clicky clicks buttons", async () => {
  const [, act] = await clicky(db);
  const observations = [{ role: "button", name: "Test Button" }];
  const mockInteractors = makeMockInteractors();

  await act({ observations, ...mockInteractors });

  expect(mockInteractors.click).toHaveBeenCalledWith(
    expect.objectContaining({ role: "button", name: "Test Button" }),
  );
});

test("clicky skips non-widget elements", async () => {
  const [, act] = await clicky(db);
  const observations = [{ role: "text", name: "Just Text" }];
  const mockInteractors = makeMockInteractors();

  await act({ observations, ...mockInteractors });

  expect(mockInteractors.click).not.toHaveBeenCalled();
});
