import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllHints } from "@/server/actions";
import { HintSearch } from "./hint-search";

export default async function HintsPage() {
  const hints = await getAllHints();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-amber-700">Hints</h1>
        <p className="text-muted-foreground mt-2">
          Name/value pairs to help raccoon buddies fill out forms they find
        </p>
      </div>

      <HintSearch />

      <div className="space-y-6">
        <Card className="border-amber-200 p-4">
          <div className="space-y-4">
            {hints.map((hint) => (
              <div
                key={hint.id}
                className="grid grid-cols-12 items-center gap-4"
              >
                <div className="col-span-4 font-medium text-amber-800">
                  {hint.name}
                </div>
                <div className="col-span-6">
                  <Input
                    defaultValue={hint.value ?? ""}
                    className="border-amber-200 focus-visible:ring-amber-500"
                    name={`hint-${hint.id}`}
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    className="w-full bg-amber-500 hover:bg-amber-600"
                    formAction={`/api/hints/${hint.id}`}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {hints.length === 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-8 text-center">
          <p className="text-amber-800">No hints available.</p>
        </div>
      )}
    </div>
  );
}
