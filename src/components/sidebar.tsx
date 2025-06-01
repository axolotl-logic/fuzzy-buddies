"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { MousePointer, FileText, Lightbulb, Heart } from "lucide-react";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const routes = [
    {
      label: "Campaigns",
      icon: MousePointer,
      href: "/campaigns",
      pattern: /^\/campaigns/,
    },
    {
      label: "Findings",
      icon: FileText,
      href: "/findings",
      pattern: /^\/findings/,
    },
    {
      label: "Hints",
      icon: Lightbulb,
      href: "/hints",
      pattern: /^\/hints/,
    },
    {
      label: "Buddies",
      icon: Heart,
      href: "/buddies",
      pattern: /^\/buddies/,
    },
  ];

  return (
    <div className="group flex h-full w-[240px] flex-col border-r bg-amber-50/40 px-3 py-4">
      <ScrollArea className="flex-1">
        <div className="space-y-1 py-2">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={route.pattern.test(pathname) ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                route.pattern.test(pathname)
                  ? "bg-amber-100 hover:bg-amber-200"
                  : "",
              )}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="mr-2 h-4 w-4" />
                {route.label}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-auto pt-4">
        <div className="rounded-lg bg-amber-100 p-3">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl">🦝</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm leading-none font-medium">Fuzzy Buddies</p>
              <p className="text-muted-foreground text-xs">v1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
