"use client";

import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { Separator } from "@/shared/components/ui/separator";

export function DashboardHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-4 z-10">
      <SidebarTrigger />
      <div>
        <Separator orientation="vertical" className="h-5" />
      </div>
    </header>
  );
}
