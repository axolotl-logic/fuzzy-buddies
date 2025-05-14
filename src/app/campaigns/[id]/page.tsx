import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { db } from "~/server/db";
import { campaignsTable } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CampaignDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number.parseInt(params.id);

  if (isNaN(id)) {
    return notFound();
  }

  const campaign = await db.query.campaignsTable.findFirst({
    where: eq(campaignsTable.id, id),
  });

  if (!campaign) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <Link
        href="/campaigns"
        className="text-muted-foreground hover:text-foreground mb-6 flex items-center text-sm transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Campaigns
      </Link>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Campaign #{campaign.id}</CardTitle>
            <Badge
              variant={
                campaign.status === "started"
                  ? "default"
                  : campaign.status === "stopped"
                    ? "secondary"
                    : "outline"
              }
            >
              {campaign.status}
            </Badge>
          </div>
          <CardDescription>Campaign Details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">ID</h3>
            <p className="text-muted-foreground">{campaign.id}</p>
          </div>
          <div>
            <h3 className="font-medium">Start URL</h3>
            <p className="text-muted-foreground break-all">
              {campaign.startUrl}
            </p>
          </div>
          <div>
            <h3 className="font-medium">Status</h3>
            <p className="text-muted-foreground">{campaign.status}</p>
          </div>
          <div>
            <h3 className="font-medium">Depth</h3>
            <p className="text-muted-foreground">{campaign.depth}</p>
          </div>
          <div>
            <h3 className="font-medium">Created At</h3>
            <p className="text-muted-foreground">
              {new Date(campaign.createdAt).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
