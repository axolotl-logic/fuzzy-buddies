import type { Page, ConsoleMessageType } from "puppeteer";
import type * as schema from "~/server/db/schema";

export interface Observation {
  multiselectable?: boolean;
  autocomplete?: string;
  valuetext?: string;
  name?: string;
  role?: string;
  value?: string | number;
  modal?: boolean;
  level?: number;
  checked?: boolean | "mixed";
  focused?: boolean;
  disabled?: boolean;
  invalid?: string;
  haspopup?: string;
  readonly?: boolean;
  description?: string;
  roledescription?: string;
  pressed?: boolean | "mixed";
  expanded?: boolean;
  required?: boolean;
}

export interface Model {
  observations: Observation[];
  lastModel: Model | null;
  adds: Observation[];
  removes: Observation[];
  persists: Observation[];
}

export interface RequestEvent {
  url: string;
  method: string;
}

export interface RequestFailedEvent {
  frameUrl?: string;
  url: string;
  method: string;
  errorText?: string;
  createdAt: number;
}

export interface ResponseEvent {
  requestTime?: number;
  url: string;
  method: string;
  frameUrl?: string;
  status: number;
  createdAt: number;
}

export interface PageErrorEvent {
  name: string;
  stack?: string;
  message: string;
}

export interface ErrorEvent {
  name: string;
  stack?: string;
  message: string;
}

export interface ConsoleEvent {
  type: ConsoleMessageType;
  text: string;
}

export type BrowserAction =
  | {
      name: string;
      role: string;
      kind: "click";
    }
  | {
      kind: "keyboard-type";
      value: string;
      name: undefined;
      role: undefined;
    };

export type ActionFunc = (args: {
  click: (el: { name: string; role: string }) => Promise<void>;
  keyboardType: (value: string) => Promise<void>;
  page: Page;
}) => Promise<void>;

export type Campaign = typeof schema.campaignsTable.$inferSelect;
export type NewCampaign = typeof schema.campaignsTable.$inferInsert;

export type Action = typeof schema.actionsTable.$inferSelect;
export type NewAction = typeof schema.actionsTable.$inferInsert;

export type Finding = typeof schema.findingsTable.$inferSelect;
export type NewFinding = typeof schema.findingsTable.$inferInsert;

export type ActionFinding = typeof schema.actionsFindingsTable.$inferSelect;
export type NewActionFinding = typeof schema.actionsFindingsTable.$inferInsert;

export type Buddy = typeof schema.buddiesTable.$inferSelect;
export type NewBuddy = typeof schema.buddiesTable.$inferInsert;

export type Hint = typeof schema.hintsTable.$inferSelect;
export type NewHint = typeof schema.hintsTable.$inferInsert;
