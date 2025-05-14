import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { db } from "~/server/db";
import { actionsTable, buddiesTable } from "~/server/db/schema";
import { Plus } from "lucide-react";
import Link from "next/link";
import { eq } from "drizzle-orm";

export default async function ActionsPage() {
  const actions = await db
    .select({
      id: actionsTable.id,
      targetRole: actionsTable.targetRole,
      targetName: actionsTable.targetName,
      kind: actionsTable.kind,
      url: actionsTable.url,
      createdAt: actionsTable.createdAt,
      buddyId: actionsTable.buddyId,
      buddyName: buddiesTable.name,
    })
    .from(actionsTable)
    .leftJoin(buddiesTable, eq(actionsTable.buddyId, buddiesTable.id));

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Actions</h1>
        <Link href="/actions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Action
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Actions</CardTitle>
        </CardHeader>
        <CardContent>
          {actions.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">
              No actions found. Create one to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Kind</TableHead>
                  <TableHead>Buddy</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actions.map((action) => (
                  <TableRow key={action.id}>
                    <TableCell>{action.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{action.targetName}</span>
                        <span className="text-muted-foreground text-xs">
                          {action.targetRole}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{action.kind}</Badge>
                    </TableCell>
                    <TableCell>{action.buddyName}</TableCell>
                    <TableCell>
                      {new Date(action.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/actions/${action.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
