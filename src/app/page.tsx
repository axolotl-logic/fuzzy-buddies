import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { CampaignForm } from "@/components/campaign-form";
import { getRecentActions } from "@/server/actions";
import { ActionList } from "./campaigns/action-list";

export default async function Home() {
  const actions = await getRecentActions();

  return (
    <div className="flex min-h-[80vh] flex-col justify-center text-center">
      <Card className="mb-8 w-full max-w-2xl border-amber-200">
        <CardContent className="p-6">
          <CampaignForm />
        </CardContent>
      </Card>
      <ActionList actions={actions} />
      <BuddyPreviews />
    </div>
  );
}

function BuddyPreviews() {
  return (
    <Card>
      <CardHeader className="border-amber-100 bg-amber-50">
        <CardTitle className="py-1 text-xl text-amber-800">
          Meet the team
        </CardTitle>
      </CardHeader>
      <CardContent className="mb-8 flex gap-8">
        <div className="relative h-40 w-40">
          <Image
            src="/placeholder.svg?height=160&width=160"
            alt="Clicky the raccoon"
            width={160}
            height={160}
            className="rounded-full border-4 border-amber-300 bg-amber-100"
          />
          <div className="absolute -right-2 -bottom-2 rounded-full bg-amber-300 p-2">
            <span className="text-2xl">👆</span>
          </div>
        </div>
        <div className="relative h-40 w-40">
          <Image
            src="/placeholder.svg?height=160&width=160"
            alt="Phillip the raccoon"
            width={160}
            height={160}
            className="rounded-full border-4 border-amber-300 bg-amber-100"
          />
          <div className="absolute -right-2 -bottom-2 rounded-full bg-amber-300 p-2">
            <span className="text-2xl">✏️</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
