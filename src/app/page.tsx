import { LaunchCampaignButton } from "~/components/launch-campaign";
import { db } from "~/server/db";
import { campaignsTable } from "~/server/db/schema";

export default async function HomePage() {
  const campaignRows = await db
    .select({
      campaignId: campaignsTable.id,
      lastRun: campaignsTable.createdAt,
      startUrl: campaignsTable.startUrl,
      status: campaignsTable.status,
    })  
    .from(campaignsTable);

  return (
    <main className="flex min-h-screen gap-4 flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <h1>Campaigns</h1>
      <LaunchCampaignButton/>
      {campaignRows.map(({ campaignId, lastRun, startUrl, status }) => (
        <div key={campaignId} className="flex gap-4">
          <div>{lastRun.toDateString()}</div>
          <div>{startUrl}</div>
          <div>{status}</div>
        </div>
      ))}
    </main>
  );
}
