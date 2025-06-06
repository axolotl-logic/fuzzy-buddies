"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Campaign, type Action } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { ActionList } from "./action-list";

interface CampaignCardProps {
  campaign: Campaign;
  actions: Action[];
}

export function CampaignCard({ campaign, actions }: CampaignCardProps) {
  return (
    <Card className="border-amber-200">
      <CardHeader className="border-b border-amber-100 bg-amber-50">
        <CardTitle className="text-amber-800">Campaign Details</CardTitle>
        <CardDescription>
          Run from {formatDateTime(campaign.startedAt)} to{" "}
          {formatDateTime(campaign.endedAt)}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ActionList actions={actions} />
      </CardContent>
    </Card>
  );
}
