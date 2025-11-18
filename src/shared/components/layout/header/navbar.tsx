"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Input } from "@/shared/components/ui/input";
import { Star } from "lucide-react";
import { UserDropdown } from "@/shared/components/layout/dashboard/user-dropdown";
import useSearchStore from "@/shared/stores/search";
import { useDebounce } from "@/shared/hooks/use-debounce";

export function Navbar() {
  const pathname = usePathname();
  const searchValue = useSearchStore((state) => state.searchValue);
  const setSearchValue = useSearchStore((state) => state.setSearchValue);
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);

  // Debounce search value
  const debouncedSearchValue = useDebounce(localSearchValue, 500);

  // Handle keyboard shortcut Ctrl+/ or Cmd+/
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[placeholder*="Search"]'
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Sync localSearchValue with store value (when changed externally)
  useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  // Update store when debounced value changes
  useEffect(() => {
    setSearchValue(debouncedSearchValue);
  }, [debouncedSearchValue, setSearchValue]);

  // Don't show navbar on auth pages and dashboard pages
  const isAuthPage = pathname?.startsWith("/auth");
  const isDashboardPage = pathname?.startsWith("/dashboard");

  if (isAuthPage || isDashboardPage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Search Section - Left */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Star className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search (Ctrl+/)"
              value={localSearchValue}
              onChange={(e) => setLocalSearchValue(e.target.value)}
              className="pl-9 w-full bg-gray-50 border-gray-200 focus-visible:ring-gray-300"
            />
          </div>
        </div>

        {/* User Section - Right */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700"></span>
          <div className="relative">
            <UserDropdown />
            {/* Online Status Indicator */}
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
}
