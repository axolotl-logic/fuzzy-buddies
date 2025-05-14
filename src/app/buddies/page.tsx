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
import { buddiesTable } from "~/server/db/schema";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function BuddiesPage() {
  const buddies = await db.select().from(buddiesTable);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Buddies</h1>
        <Link href="/buddies/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Buddy
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Buddies</CardTitle>
        </CardHeader>
        <CardContent>
          {buddies.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">
              No buddies found. Create one to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buddies.map((buddy) => (
                  <TableRow key={buddy.id}>
                    <TableCell>{buddy.id}</TableCell>
                    <TableCell>{buddy.name}</TableCell>
                    <TableCell>{buddy.slug}</TableCell>
                    <TableCell>
                      {new Date(buddy.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/buddies/${buddy.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        <Link href={`/buddies/${buddy.id}/edit`}>
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
