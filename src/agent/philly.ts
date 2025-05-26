import { choose, getAccessibility } from "./utils";
import type { ActionFunc, Buddy } from "~/types";
import { type DBHandle } from "~/server/db";
import { upsertBuddy } from "~/server/db/buddies";

const INPUTS = [
  "http://example.com/",
  "foo",
  "123",
  "foo@example.com",
] as const;

export default async function philly(
  db: DBHandle,
): Promise<[Buddy, ActionFunc]> {
  const buddy = await upsertBuddy(db, {
    name: "Phillip",
    slug: "philly",
    description:
      "I fill out forms the best I can, but I'm quite distractable. Make sure to follow best accessibility practices so that I and human users can use them. We'll help!",
  });

  return [
    buddy,
    async ({ click, keyboardType, page }) => {
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

      if (emptyInput?.name !== undefined) {
        const { name, role } = emptyInput;
        const el = await emptyInput.elementHandle();
        if (el === null) {
          console.error("FIXME: elementHandle is null");
          return;
        }

        await click({ name, role });
        const value = choose([...INPUTS]) ?? INPUTS[0];
        await keyboardType(value);
      }

      if (continuation?.name !== undefined) {
        await click({ name: continuation.name, role: continuation.role });
      }
    },
  ];
}
