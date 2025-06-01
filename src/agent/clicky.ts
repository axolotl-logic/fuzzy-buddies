import { choose, isWidgetRole } from "./utils";
import type { ActionFunc, Buddy } from "@/types";
import type { DBHandle } from "@/server/db";
import { upsertBuddy } from "@/server/db/buddies";
import { fixme } from "./config";

export default async function clicky(
  db: DBHandle,
): Promise<[Buddy, ActionFunc]> {
  const buddy = await upsertBuddy(db, {
    name: "Clicky",
    slug: "clicky",
    description:
      "I love clicking things! But I use a screen reader and can only see elements exposed in the accessibility tree. Like the other buddies here, I will let you know if I notice parts of a page that users who use assistive technology like me wont be able to use.",
  });

  return [
    buddy,
    async ({ click, observations: els }) => {
      const el = choose(els.filter((el) => isWidgetRole(el.role) && el.name));
      if (!el) {
        fixme("Widget deadend");
        return;
      }

      const { role, name } = el;
      if (!name || !role) {
        fixme("name or role undefined, despite prior checking");
        return;
      }

      await click({ role, name });
    },
  ];
}
