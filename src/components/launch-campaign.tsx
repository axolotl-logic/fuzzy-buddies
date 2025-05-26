"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { startCampaign } from "~/server/actions";

export function LaunchCampaignButton({ startUrl }: { startUrl: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onClick = async () => {
    setIsLoading(true);

    try {
      await startCampaign(startUrl);
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

  return (
    <Button
      onClick={onClick}
      type="submit"
      className="bg-amber-500 hover:bg-amber-600"
    >
      Launch <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
}
