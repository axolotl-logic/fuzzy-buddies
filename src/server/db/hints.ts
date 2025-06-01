import type { DBHandle } from "./index";
import { hintsTable } from "./schema";
import type { Hint } from "@/types";

export async function listHints(db: DBHandle): Promise<Hint[]> {
  return await db.select().from(hintsTable);
}
