import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { db } from "~/server/db";
import { buddiesTable } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BuddyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number.parseInt(params.id);

  if (isNaN(id)) {
    return notFound();
  }

  const buddy = await db.query.buddiesTable.findFirst({
    where: eq(buddiesTable.id, id),
  });

  if (!buddy) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <Link
        href="/buddies"
        className="text-muted-foreground hover:text-foreground mb-6 flex items-center text-sm transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Buddies
      </Link>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">{buddy.name}</CardTitle>
          <CardDescription>Buddy Details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">ID</h3>
            <p className="text-muted-foreground">{buddy.id}</p>
          </div>
          <div>
            <h3 className="font-medium">Name</h3>
            <p className="text-muted-foreground">{buddy.name}</p>
          </div>
          <div>
            <h3 className="font-medium">Slug</h3>
            <p className="text-muted-foreground">{buddy.slug}</p>
          </div>
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="text-muted-foreground">{buddy.description}</p>
          </div>
          <div>
            <h3 className="font-medium">Created At</h3>
            <p className="text-muted-foreground">
              {new Date(buddy.createdAt).toLocaleString()}
            </p>
          </div>
          {buddy.updatedAt && (
            <div>
              <h3 className="font-medium">Updated At</h3>
              <p className="text-muted-foreground">
                {new Date(buddy.updatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
