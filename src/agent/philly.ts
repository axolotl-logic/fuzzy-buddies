import { choose } from "./utils";
import type { ActionFunc, Buddy } from "@/types";
import type { DBHandle } from "@/server/db";
import { upsertBuddy } from "@/server/db/buddies";
import { fixme } from "./config";
import { upsertFinding } from "@/server/db/findings";

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
    async ({ click, keyboardType, observations: els }) => {
      const emptyInput = choose(
        els.filter(
          (node) =>
            ["input", "textbox"].includes(node.role ?? "") &&
            node.name !== undefined &&
            (node.value === undefined || node.value === ""),
        ),
      );

      let continuation = choose(els.filter((node) => node.role === "button"));
      continuation ??= choose(els.filter((node) => node.role === "link"));

      if (emptyInput?.name !== undefined) {
        const { role, name } = emptyInput;
        if (!name || !role) {
          fixme("emptyInput's name or role undefined, despite prior checking");
          return;
        }
        await click({ role, name });
        await keyboardType(choose([...INPUTS]) ?? "[missing input]");
      } else if (continuation?.name !== undefined) {
        const { role, name } = continuation;
        if (!name || !role) {
          fixme("name or role undefined, despite prior checking");
          return;
        }
        await click({ role, name });
      }

      await upsertFinding(db, {
        slug: "philly-deadend",
        description: "Philly reached a deadend with no input or continuation.",
        name: "Philly Deadend",
        moreInfoURL: "/findings/philly-deadend",
      });
    },
  ];
}
