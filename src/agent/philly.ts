import type { Page } from "puppeteer";
import { choose, getAccessibility } from "./utils";
import type { ActionFunc } from "./types";
import { db } from "~/server/db";
import { upsertBuddy } from "./fuzz";

const INPUTS = [
  "http://example.com/",
  "foo",
  "123",
  "foo@example.com",
] as const;

export default async function philly(): Promise<[number, ActionFunc]> {
  const buddyRow = await upsertBuddy(db, {
    name: "Phillip",
    slug: "philly",
    description:
      "I fell out forms the best I can, but I'm quite distractable. Make sure to follow best accessibility practices so that I and human users can use them. We'll help!",
  });

  return [
    buddyRow.id,
    async (page: Page) => {
      const els = await getAccessibility(page);

      const emptyInput = choose(
        els.filter(
          (node) =>
            ["input", "textbox"].includes(node.role) &&
            node.name !== undefined &&
            (node.value === undefined || node.value === ""),
        ),
      );

      let continuation = choose(els.filter((node) => node.role === "button"));
      continuation ??= choose(els.filter((node) => node.role === "link"));

      if (emptyInput !== undefined) {
        const el = await emptyInput.elementHandle();
        if (el === null) {
          return null;
        }

        const value = choose([...INPUTS]) ?? INPUTS[0];

        return {
          kind: "click-then-type",
          role: emptyInput.role,
          name: emptyInput.name ?? "<missing name>",
          value,
        };
      }

      if (continuation !== undefined) {
        return {
          kind: "click",
          role: continuation.role,
          name: continuation.name ?? "<missing name>",
        };
      }

      return null;
    },
  ];
}
