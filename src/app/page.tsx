import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Link from "next/link";
import {
  Database,
  Users,
  FileText,
  Activity,
  Lightbulb,
  GitMerge,
} from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <Tabs defaultValue="entities" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="entities">Entities</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>
        <TabsContent value="entities" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/buddies">
              <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Buddies</CardTitle>
                  <Users className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-xs">
                    Manage buddy profiles
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/hints">
              <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Hints</CardTitle>
                  <Lightbulb className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-xs">
                    Manage form hints
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/campaigns">
              <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Campaigns
                  </CardTitle>
                  <Activity className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-xs">
                    Manage campaigns
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/actions">
              <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Actions</CardTitle>
                  <GitMerge className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-xs">
                    Manage actions
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/findings">
              <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Findings
                  </CardTitle>
                  <FileText className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-xs">
                    Manage findings
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/actions-findings">
              <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Actions-Findings
                  </CardTitle>
                  <Database className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-xs">
                    Manage action-finding relationships
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </TabsContent>
        <TabsContent value="stats">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Buddies
                </CardTitle>
                <Users className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Campaigns
                </CardTitle>
                <Activity className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Actions
                </CardTitle>
                <GitMerge className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Findings
                </CardTitle>
                <FileText className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
