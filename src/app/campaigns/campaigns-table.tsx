import { Calendar, Clock, Play } from "lucide-react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { formatDateTime } from "~/lib/utils";
import type { Campaign } from "~/types";

interface CampaignsTableProps {
  campaigns: Campaign[];
}

export function CampaignsTable({ campaigns }: CampaignsTableProps) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-amber-200 bg-amber-50">
          <th className="p-3 text-left font-medium text-amber-800">
            Start URL
          </th>
          <th className="p-3 text-left font-medium text-amber-800">Status</th>
          <th className="p-3 text-left font-medium text-amber-800">
            Start Time
          </th>
          <th className="p-3 text-left font-medium text-amber-800">End Time</th>
          <th className="p-3 text-right font-medium text-amber-800"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-amber-100">
        {campaigns.map((campaign) => (
          <tr key={campaign.id} className="hover:bg-amber-50/50">
            <td className="max-w-[200px] truncate p-3 text-sm">
              {campaign.startUrl}
            </td>
            <td className="p-3">
              <Badge
                variant="outline"
                className={` ${
                  campaign.status === "started"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-blue-200 bg-blue-50 text-blue-700"
                } `}
              >
                {campaign.status}
              </Badge>
            </td>
            <td className="text-muted-foreground p-3 text-sm">
              <div className="flex">
                <Calendar className="mr-1 h-3 w-3" />
                {formatDateTime(campaign.startedAt)}
              </div>
            </td>
            <td className="text-muted-foreground p-3 text-sm">
              {campaign.endedAt && (
                <div className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  {formatDateTime(campaign.endedAt)}
                </div>
              )}
            </td>
            <td className="p-3 text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-200 text-amber-700"
                  asChild
                >
                  <Link href={`/campaigns/${campaign.id}`}>View</Link>
                </Button>
                {campaign.status === "stopped" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-amber-200 text-amber-700"
                  >
                    <Play className="mr-1 h-3 w-3" />
                    Rerun
                  </Button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
