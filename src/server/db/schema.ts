// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `fb_fe_${name}`);

export const buddiesTable = createTable(
  "buddies",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 10 }).unique().notNull(),
    slug: d.varchar({ length: 10 }).unique().notNull(),
    description: d.text().notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index().on(t.slug)],
);

export const hintsTable = createTable("hints", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  formValues: d.json().notNull(),
}));

export const campaignsTable = createTable("campaigns", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  startUrl: d.text().notNull(),
  status: d.varchar({length: 10, enum: ["started", "stopped", "drift"]}),
  depth: d.integer().notNull(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

export const actionsTable = createTable("actions", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  campaignId: d.integer().references(() => campaignsTable.id),
  targetRole: d.varchar({ length: 64 }).notNull(),
  targetName: d.text().notNull(),
  value: d.text(),
  screenshotAfter: d.text(),
  before: d.json().notNull(),
  added: d.json().notNull(),
  removed: d.json().notNull(),
  after: d.json().notNull(),
  url: d.text().notNull(),
  kind: d.varchar({ length: 16, enum: ["click", "click-then-type"] }),
  buddyId: d
    .integer()
    .references(() => buddiesTable.id)
    .notNull(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

export const findingsTable = createTable("findings", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  slug: d.varchar({ length: 120 }).unique(),
  description: d.text(),
  moreInfoURL: d.text(),
}));

export const actionsFindingsTable = createTable("actions_findings", (d) => ({
  campaignId: d.integer().references(() => campaignsTable.id),
  actionId: d.integer().references(() => actionsTable.id),
  findingId: d.integer().references(() => findingsTable.id),
}));
