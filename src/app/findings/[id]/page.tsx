import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { db } from "~/server/db";
import { findingsTable } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function FindingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number.parseInt(params.id);

  if (isNaN(id)) {
    return notFound();
  }

  const finding = await db.query.findingsTable.findFirst({
    where: eq(findingsTable.id, id),
  });

  if (!finding) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <Link
        href="/findings"
        className="text-muted-foreground hover:text-foreground mb-6 flex items-center text-sm transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Findings
      </Link>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">
            {finding.slug ?? `Finding #${finding.id}`}
          </CardTitle>
          <CardDescription>Finding Details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">ID</h3>
            <p className="text-muted-foreground">{finding.id}</p>
          </div>
          {finding.slug && (
            <div>
              <h3 className="font-medium">Slug</h3>
              <p className="text-muted-foreground">{finding.slug}</p>
            </div>
          )}
          {finding.description && (
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-muted-foreground">{finding.description}</p>
            </div>
          )}
          {finding.moreInfoURL && (
            <div>
              <h3 className="font-medium">More Information</h3>
              <a
                href={finding.moreInfoURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary flex items-center hover:underline"
              >
                {finding.moreInfoURL}
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
