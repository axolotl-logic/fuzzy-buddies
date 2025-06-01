import { expect, test } from "vitest";
import { makeMockInteractors } from "./buddy-test-utils";
import philly from "../philly";
import { db } from "@/server/db";
import { getBuddyBySlug } from "@/server/db/buddies";

test("creates philly in database", async () => {
  const [buddy] = await philly(db);
  expect(buddy.slug).toBe("philly");

  const persisted = await getBuddyBySlug(db, buddy.slug);
  expect(persisted).toBeDefined();
  expect(persisted?.createdAt).toEqual(buddy.createdAt);
});

test("philly fills empty input fields", async () => {
  const [, act] = await philly(db);
  const observations = [{ role: "textbox", name: "Email", value: "" }];
  const mockInteractors = makeMockInteractors();

  await act({ observations, ...mockInteractors });

  expect(mockInteractors.click).toHaveBeenCalledWith(
    expect.objectContaining({ role: "textbox", name: "Email" }),
  );
  expect(mockInteractors.keyboardType).toHaveBeenCalledWith(
    expect.stringMatching(
      /^(http:\/\/example\.com\/|foo|123|foo@example\.com)$/,
    ),
  );
});

test("philly clicks submit buttons after filling inputs", async () => {
  const [, act] = await philly(db);
  const observations = [
    { role: "textbox", name: "Email", value: "filled@example.com" },
    { role: "button", name: "Submit" },
  ];
  const mockInteractors = makeMockInteractors();

  await act({ observations, ...mockInteractors });

  expect(mockInteractors.click).toHaveBeenCalledWith(
    expect.objectContaining({ role: "button", name: "Submit" }),
  );
  expect(mockInteractors.keyboardType).not.toHaveBeenCalled();
});

test("philly falls back to links when no buttons available", async () => {
  const [, act] = await philly(db);
  const observations = [
    { role: "textbox", name: "Email", value: "filled@example.com" },
    { role: "link", name: "Continue" },
  ];
  const mockInteractors = makeMockInteractors();

  await act({ observations, ...mockInteractors });

  expect(mockInteractors.click).toHaveBeenCalledWith(
    expect.objectContaining({ role: "link", name: "Continue" }),
  );
});
