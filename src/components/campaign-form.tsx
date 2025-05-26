"use client";

import { useState } from "react";
import { LaunchCampaignButton } from "./launch-campaign";
import { Input } from "./ui/input";

export function CampaignForm() {
  const [startUrl, setStartUrl] = useState("http://localhost:3000");

  return (
    <form className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="md:col-span-3">
          <Input
            type="url"
            className="w-full border-amber-200"
            onChange={(e) => setStartUrl(e.target.value)}
            value={startUrl}
            required
          />
        </div>
        <LaunchCampaignButton startUrl={startUrl} />
      </div>
    </form>
  );
}
