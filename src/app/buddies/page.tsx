import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getAllBuddies } from "~/server/actions";

export default async function BuddiesPage() {
  const buddies = await getAllBuddies();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-amber-700">
          Meet the Fuzzy Buddies
        </h1>
        <p className="text-muted-foreground mt-2">
          Our raccoon buddies are here to help test your applications with their
          fuzzy paws
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {buddies.map((buddy) => (
          <Card key={buddy.id} className="overflow-hidden border-amber-200">
            <div className="flex flex-col items-center px-6 pt-8 pb-0 text-center">
              <div className="relative mb-4">
                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-amber-300">
                  <Image
                    src="/placeholder.svg"
                    alt={buddy.name}
                    width={300}
                    height={300}
                    className="object-cover"
                  />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-amber-800">
                {buddy.name}
              </CardTitle>
              <Badge className="mt-2 bg-amber-100 text-amber-800">
                {buddy.slug}
              </Badge>
            </div>

            <CardContent className="p-6">
              <p className="text-muted-foreground mb-6 text-center">
                {buddy.description}
              </p>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-amber-100 bg-amber-50 p-4">
              <Button
                asChild
                variant="outline"
                className="border-amber-300 text-amber-700"
              >
                <Link href={`/buddies/${buddy.slug}`}>View Profile</Link>
              </Button>
              <Button className="bg-amber-500 hover:bg-amber-600">
                <Heart className="mr-2 h-4 w-4" />
                Choose Buddy
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <div className="rounded-full bg-amber-100 p-4">
            <span className="text-4xl">🦝</span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="mb-2 text-xl font-bold text-amber-800">
              More Buddies Coming Soon!
            </h3>
            <p className="text-muted-foreground">
              We{"'"}re training more raccoon buddies with special testing
              skills. Stay tuned for new additions to our fuzzy testing team!
            </p>
          </div>
          <Button variant="outline" className="border-amber-300 text-amber-700">
            Request a Buddy
          </Button>
        </div>
      </div>
    </div>
  );
}
