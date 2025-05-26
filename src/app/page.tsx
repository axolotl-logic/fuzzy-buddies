import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Image from "next/image";
import { CampaignForm } from "~/components/campaign-form";

export default function Home() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-4xl font-bold text-amber-700">
        Welcome to the <i>Fuzzy Buddies</i> Web Fuzzer!
      </h1>
      <div className="mb-8 flex gap-8">
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
      </div>
      <Card className="mb-8 w-full max-w-2xl border-amber-200">
        <CardHeader className="border-b border-amber-100 bg-amber-50">
          <CardTitle className="text-amber-800">Launch New Campaign</CardTitle>
          <CardDescription>
            Let our fuzzy buddies Clicky and Phillip test your app with their
            fuzzy paws! Enter a URL to start testing with our raccoon buddies.
            Careful, they can be clumsy and aggressive, so make sure to not
            point them at a web site you do not want a mess.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <CampaignForm />
        </CardContent>
      </Card>
    </div>
  );
}
