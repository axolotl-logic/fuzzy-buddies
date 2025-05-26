import { Play } from "lucide-react";
import { LaunchCampaignButton } from "~/components/launch-campaign";
import { CampaignsTable } from "./campaigns-table";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { getAllCampaigns } from "~/server/actions";

export default async function CampaignsPage() {
  const campaigns = await getAllCampaigns();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-700">Campaigns</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your testing campaigns
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-amber-500 hover:bg-amber-600">
            <Play className="mr-2 h-4 w-4" />
            Re-run All Campaigns
          </Button>
          <LaunchCampaignButton startUrl="http://localhost:3000/" />
        </div>
      </div>

      <Card className="border-amber-200">
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <CampaignsTable campaigns={campaigns} />
          </div>

          {campaigns.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-amber-800">
                No campaigns match your search criteria.
              </p>
            </div>
          )}

          <div className="text-muted-foreground mt-4 flex items-center justify-between text-sm">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-amber-200"
                disabled
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-amber-200"
                disabled
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
