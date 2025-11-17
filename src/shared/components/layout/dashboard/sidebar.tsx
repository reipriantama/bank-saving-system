"use client";

import { ChevronRightIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import Link from "next/link";
import { useState } from "react";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { cn } from "@/shared/lib/cn";
import useSidebarStore from "@/shared/stores/sidebar";

export function AppSidebar() {
  const { menu: sections } = useSidebarStore();
  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const toggleItem = (title: string) => {
    setOpenItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  return (
    <Sidebar collapsible="offcanvas" variant="inset">
      <SidebarHeader className="pt-5 px-4 gap-3 font-inter font-bold text-xl">
        Bank Saving
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        {sections.map((section, i) => (
          <SidebarGroup key={"section-" + i}>
            {section.title && (
              <p className="py-1 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wide">
                {section.title}
              </p>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {item.children && item.children.length > 0 ? (
                      <Collapsible
                        open={openItems.includes(item.title)}
                        onOpenChange={() => toggleItem(item.title)}
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className={cn(
                              "h-auto hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            )}
                          >
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRightIcon
                              className={cn(
                                "ml-auto h-4 w-4 transition-transform duration-200",
                                openItems.includes(item.title) && "rotate-90"
                              )}
                            />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="CollapsibleContent">
                          <SidebarMenu className="ml-4 py-2 border-l border-sidebar-border/50">
                            {item.children.map((sub) => (
                              <SidebarMenuItem key={sub.title}>
                                <SidebarMenuButton
                                  asChild
                                  className={cn(
                                    "pl-4 text-sm text-sidebar-foreground/70",
                                    "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                                    "border-l-2 border-transparent hover:border-sidebar-accent"
                                  )}
                                >
                                  <Link
                                    href={sub?.url ?? "#"}
                                    onClick={handleLinkClick}
                                  >
                                    {sub.icon && (
                                      <sub.icon className="h-4 w-4" />
                                    )}
                                    <span>{sub.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenu>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <SidebarMenuButton asChild>
                        <Link href={item?.url ?? "#"} onClick={handleLinkClick}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
