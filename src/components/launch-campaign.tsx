"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { launchCampaign } from "~/agent/fuzz";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function LaunchCampaignButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onClick = async () => {
    setIsLoading(true);
    try {
      await launchCampaign({ startUrl: "https://chessdojo.club" });
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Button disabled>
        <Loader2 className="animate-spin" />
        Please wait
      </Button>
    );
  }

  return <Button onClick={onClick}>Launch Campaign</Button>;
}
