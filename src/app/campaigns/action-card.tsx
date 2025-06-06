"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { type Action } from "@/types";
import { z } from "zod";
import { isWidgetRole } from "@/agent/utils";

const ElementListSchema = z.array(
  z.object({ name: z.string(), role: z.string() }),
);

type ElementList = z.infer<typeof ElementListSchema>;

function isElementList(x: unknown): x is { name: string; role: string }[] {
  return ElementListSchema.safeParse(x).success;
}

interface ActionCardProps {
  action: Action;
}

export function ActionCard({ action }: ActionCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-lg border">
      <div
        className="flex cursor-pointer items-center justify-between bg-amber-50/50 p-4 hover:bg-amber-100/50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          {expanded ? (
            <ChevronDown className="mr-2 h-5 w-5 text-amber-700" />
          ) : (
            <ChevronRight className="mr-2 h-5 w-5 text-amber-700" />
          )}
          <div>
            <div className="font-medium">
              {action.kind === "click" &&
                `Clicked ${action.targetName} ${action.targetRole}`}
              {action.kind === "keyboard-type" && `Typed "${action.value}"`}
            </div>
          </div>
        </div>
      </div>

      {expanded && <ActionDetails action={action} />}
    </div>
  );
}

interface ActionDetailsProps {
  action: Action;
}

function ActionDetails({ action }: ActionDetailsProps) {
  const added = isElementList(action.added) ? action.added : [];
  const addedWidgets = added.filter((v) => isWidgetRole(v.role));
  const removed = isElementList(action.removed) ? action.removed : [];
  const removedWidgets = removed.filter((v) => isWidgetRole(v.role));

  return (
    <div className="border-t border-amber-100 bg-white p-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h4 className="mb-2 font-medium text-amber-800">Screenshot</h4>
          <div className="rounded-md border p-2">
            {action.screenshotAfter === null ? (
              "No screenshot"
            ) : (
              <img
                alt="a screenshot of the page after the interction took place"
                src={`data:image/png;base64,${action.screenshotAfter}`}
              />
            )}
          </div>
        </div>
        <div className="space-y-3">
          {addedWidgets.length > 0 ? (
            <div>
              <h4 className="mb-2 font-medium text-amber-800">Widgets Added</h4>
              <Elements elements={addedWidgets} />
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No elements added</p>
          )}
        </div>
        <div className="space-y-3">
          {removedWidgets.length > 0 ? (
            <div>
              <h4 className="mb-2 font-medium text-amber-800">
                Widgets Removed
              </h4>
              <Elements elements={removedWidgets} />
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No elements removed</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface ElementsProps {
  elements: ElementList;
}

function Elements({ elements }: ElementsProps) {
  return (
    <ul className="space-y-2">
      {elements.map((element, idx) => (
        <li
          key={`${element.name}-${element.role}-${idx}`}
          className="rounded-md border border-green-100 bg-green-50 p-2 text-sm"
        >
          <span className="font-medium">{element.name}</span> ({element.role})
        </li>
      ))}
    </ul>
  );
}
