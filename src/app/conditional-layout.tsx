"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "@/shared/components/layout/dashboard/sidebar";
import { DashboardHeader } from "@/shared/components/layout/dashboard/dashboard-header";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  // If auth page, render without sidebar
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Otherwise, render with sidebar and dashboard layout
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />

        <div className="flex flex-1 flex-col ">
          <main className="@container/main flex flex-1 flex-col gap-2 p-4 bg-[url(/shape.png)]">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

