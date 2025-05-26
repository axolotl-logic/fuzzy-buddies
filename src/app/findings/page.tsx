import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { FileText } from "lucide-react";
import Link from "next/link";
import { getAllFindings } from "~/server/actions";

export default async function FindingsPage() {
  const findings = await getAllFindings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-amber-700">Findings</h1>
        <p className="text-muted-foreground mt-2">
          Issues discovered by your raccoon buddies during testing
        </p>
      </div>

      <Card className="border-amber-200">
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-amber-200 bg-amber-50">
                  <th className="p-3 text-left font-medium text-amber-800">
                    Name
                  </th>
                  <th className="p-3 text-left font-medium text-amber-800">
                    Description
                  </th>
                  <th className="p-3 text-right font-medium text-amber-800">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {findings.map((finding) => (
                  <tr key={finding.id} className="hover:bg-amber-50/50">
                    <td className="p-3">
                      <Link
                        href={`/findings/${finding.slug}`}
                        className="font-medium text-amber-700 hover:underline"
                      >
                        {finding.name}
                      </Link>
                    </td>
                    <td className="text-muted-foreground p-3">
                      {finding.description}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-amber-200 text-amber-700"
                          asChild
                        >
                          <Link href={finding.moreInfoURL} target="_blank">
                            <FileText className="mr-1 h-3 w-3" />
                            More Info
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {findings.length === 0 && (
            <div className="p-8 text-center">
              <p className="font-medium text-amber-800">
                No findings available.
              </p>
            </div>
          )}

          <div className="text-muted-foreground mt-4 text-sm">
            Showing {findings.length} findings
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
