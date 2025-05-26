"use client";

import { Input } from "~/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function HintSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  return (
    <div className="relative mb-6">
      <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
      <Input
        placeholder="Search hints..."
        className="border-amber-200 pl-10 focus-visible:ring-amber-500"
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => {
          router.push(
            pathname + "?" + createQueryString("search", e.target.value),
          );
        }}
      />
    </div>
  );
}
