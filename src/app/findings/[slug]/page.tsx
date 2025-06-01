import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LinkIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from "@/server/db";
import {
  actionsFindingsTable,
  actionsTable,
  campaignsTable,
} from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { formatDateTime } from "@/lib/utils";

export default async function FindingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const finding = await db.query.findingsTable.findFirst({
    where: (findings, { eq }) => eq(findings.slug, slug),
  });
  if (!finding) {
    return notFound();
  }

  const campaigns = await db
    .select({
      id: campaignsTable.id,
      startedAt: campaignsTable.startedAt,
      endedAt: campaignsTable.endedAt,
    })
    .from(campaignsTable)
    .innerJoin(actionsTable, eq(actionsTable.campaignId, campaignsTable.id))
    .innerJoin(
      actionsFindingsTable,
      and(
        eq(actionsFindingsTable.actionId, actionsTable.id),
        eq(actionsFindingsTable.campaignId, campaignsTable.id),
      ),
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-700">{finding.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-red-200 bg-red-50 text-red-700"
            >
              ?? Severity
            </Badge>
            <Badge
              variant="outline"
              className="border-amber-200 bg-amber-50 text-amber-700"
            >
              ??
            </Badge>
          </div>
        </div>
        {campaigns[0] && (
          <Button asChild className="bg-amber-500 hover:bg-amber-600">
            <Link href={`/campaigns/${campaigns[0].id}`}>
              View Latest Campaign
            </Link>
          </Button>
        )}
      </div>

      <Card className="border-amber-200">
        <CardHeader className="border-b border-amber-100 bg-amber-50">
          <CardTitle className="text-amber-800">Finding Details</CardTitle>
          <CardDescription>
            Found in {campaigns.length} campaigns
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="details">
            <TabsList className="w-full rounded-none border-b bg-amber-50/50">
              <TabsTrigger value="details" className="flex-1">
                Details
              </TabsTrigger>
              <TabsTrigger value="campaigns" className="flex-1">
                Campaigns
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1">
                History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-6 p-6">
              <div>
                <h3 className="mb-2 text-lg font-medium text-amber-800">
                  Description
                </h3>
                <p className="text-muted-foreground">{finding.description}</p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-medium text-amber-800">
                  Impact
                </h3>
                <div className="rounded-md border border-red-100 bg-red-50 p-4">
                  <p className="text-red-700">???</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="campaigns" className="p-6">
              <div className="space-y-4">
                <h3 className="mb-4 text-lg font-medium text-amber-800">
                  Campaigns with this Finding
                </h3>

                {campaigns.map((campaign) => (
                  <Link
                    key={campaign.id}
                    href={`/campaigns/${campaign.id}`}
                    className="block rounded-lg border border-amber-100 p-4 transition-colors hover:bg-amber-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-amber-700">
                          {formatDateTime(campaign.startedAt)}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {formatDateTime(campaign.endedAt)}
                        </div>
                      </div>
                      <LinkIcon className="h-4 w-4 text-amber-500" />
                    </div>
                  </Link>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="p-6">
              <div className="p-8 text-center">
                <p className="text-muted-foreground">
                  Finding history would appear here
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
