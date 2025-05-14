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
import { db } from "~/server/db";
import { findingsTable } from "~/server/db/schema";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function FindingsPage() {
  const findings = await db.select().from(findingsTable);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Findings</h1>
        <Link href="/findings/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Finding
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Findings</CardTitle>
        </CardHeader>
        <CardContent>
          {findings.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">
              No findings found. Create one to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {findings.map((finding) => (
                  <TableRow key={finding.id}>
                    <TableCell>{finding.id}</TableCell>
                    <TableCell>{finding.slug}</TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {finding.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/findings/${finding.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        <Link href={`/findings/${finding.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
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
