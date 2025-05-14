import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { db } from "~/server/db";
import { actionsTable, buddiesTable } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ActionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number.parseInt(params.id);

  if (isNaN(id)) {
    return notFound();
  }

  const action = await db
    .select({
      id: actionsTable.id,
      targetRole: actionsTable.targetRole,
      targetName: actionsTable.targetName,
      kind: actionsTable.kind,
      url: actionsTable.url,
      value: actionsTable.value,
      buddyName: buddiesTable.name,
      buddyId: buddiesTable.id,
      createdAt: actionsTable.createdAt,
      before: actionsTable.before,
      after: actionsTable.after,
      added: actionsTable.added,
      removed: actionsTable.removed,
    })
    .from(actionsTable)
    .leftJoin(buddiesTable, eq(actionsTable.buddyId, buddiesTable.id))
    .where(eq(actionsTable.id, id))
    .then((rows) => rows[0]);

  if (!action) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <Link
        href="/actions"
        className="text-muted-foreground hover:text-foreground mb-6 flex items-center text-sm transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Actions
      </Link>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Action #{action.id}</CardTitle>
            <Badge variant="outline">{action.kind}</Badge>
          </div>
          <CardDescription>Action Details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">ID</h3>
            <p className="text-muted-foreground">{action.id}</p>
          </div>
          <div>
            <h3 className="font-medium">Target</h3>
            <div className="flex flex-col">
              <p className="text-muted-foreground">{action.targetName}</p>
              <p className="text-muted-foreground text-xs">
                Role: {action.targetRole}
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-medium">URL</h3>
            <p className="text-muted-foreground break-all">{action.url}</p>
          </div>
          <div>
            <h3 className="font-medium">Kind</h3>
            <p className="text-muted-foreground">{action.kind}</p>
          </div>
          <div>
            <h3 className="font-medium">Buddy</h3>
            <p className="text-muted-foreground">
              {action.buddyName} (ID: {action.buddyId})
            </p>
          </div>
          {action.value && (
            <div>
              <h3 className="font-medium">Value</h3>
              <p className="text-muted-foreground">{action.value}</p>
            </div>
          )}
          <div>
            <h3 className="font-medium">Created At</h3>
            <p className="text-muted-foreground">
              {new Date(action.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <h3 className="font-medium">JSON Data</h3>
            <div className="bg-muted max-h-40 overflow-auto rounded-md p-2">
              <pre className="text-xs">
                <code>
                  {JSON.stringify(
                    {
                      before: action.before,
                      added: action.added,
                      removed: action.removed,
                      after: action.after,
                    },
                    null,
                    2,
                  )}
                </code>
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
