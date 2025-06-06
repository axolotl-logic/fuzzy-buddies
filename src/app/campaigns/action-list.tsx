import type { Action } from "@/types";
import { ActionCard } from "./action-card";

interface ActionListProps {
  actions: Action[];
}

export function ActionList({ actions }: ActionListProps) {
  return (
    <div className="flex flex-col gap-2">
      {actions.map((action) => (
        <ActionCard key={action.id} action={action} />
      ))}
    </div>
  );
}
