import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Play, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { CampaignCard } from "../campaign-card";
import { formatDateTime } from "~/lib/utils";
import { getCampaign, getCampaignActions } from "~/server/actions";

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = await getCampaign(Number(id));

  if (!campaign) {
    return notFound();
  }

  const actions = await getCampaignActions(Number(id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-700">
            Campaign started at {formatDateTime(campaign.startedAt)}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-green-200 bg-green-50 text-green-700"
            >
              {campaign.status}
            </Badge>
            <div className="text-muted-foreground flex items-center text-sm">
              <Clock className="mr-1 h-4 w-4" />
              {formatDateTime(campaign.startedAt)}
            </div>
          </div>
        </div>
        <Button className="bg-amber-500 hover:bg-amber-600">
          <Play className="mr-2 h-4 w-4" />
          Rerun Campaign
        </Button>
      </div>
      <CampaignCard campaign={campaign} actions={actions} />
    </div>
  );
}
