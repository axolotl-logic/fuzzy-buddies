import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Heart } from "lucide-react";
import Image from "next/image";
import { getBuddy } from "~/server/actions";

export default async function BuddyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const buddy = await getBuddy(slug);

  if (!buddy) {
    return (
      <div className="p-8 text-center text-lg text-red-600">
        Buddy not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-amber-700">{buddy.name}</h1>
        <p className="text-muted-foreground mt-2">{buddy.slug}</p>
      </div>
      <Card className="border-amber-200">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <div className="relative mb-4">
            <div className="h-40 w-40 overflow-hidden rounded-full border-4 border-amber-300">
              <Image
                src={"/placeholder.svg"}
                alt={buddy.name}
                width={300}
                height={300}
                className="object-cover"
              />
            </div>
          </div>
          <h2 className="mb-1 text-xl font-bold text-amber-800">
            {buddy.name}
          </h2>
          <p className="text-muted-foreground mb-4 text-sm">
            {buddy.description}
          </p>
          <Badge className="mb-4 bg-amber-100 text-amber-800">
            {buddy.slug}
          </Badge>
          <Button className="w-full bg-amber-500 hover:bg-amber-600">
            <Heart className="mr-2 h-4 w-4" />
            Send Treats
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
