"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import useUserStore from "@/shared/stores/users";
import { useSonner } from "@/shared/hooks/use-sonner";
import { useUser } from "@/shared/hooks/use-user";

export function UserDropdown() {
  const user = useUser();
  const router = useRouter();
  const { sonner } = useSonner();
  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogout = async () => {
    try {
      // Clear cookie via API
      await fetch("/api/session/clear", {
        method: "POST",
      });

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }

      // Clear user store
      clearUser();

      sonner.success("Berhasil logout");

      // Redirect to login
      router.push("/auth/login");
    } catch {
      sonner.error("Gagal logout");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full hover:bg-gray-100 p-1 transition-colors focus:outline-none">
          <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">
              {user?.fullName?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleLogout} variant="destructive">
          <LogOutIcon className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

