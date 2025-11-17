"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type User = {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "USER";
};

type UserStoreValue = {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
};

const useUserStore = create<UserStoreValue>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }),
        clearUser: () => set({ user: null }),
      }),
      {
        name: "user-storage",
        // Only persist user data, not functions
        partialize: (state) => ({ user: state.user }),
      }
    ),
    { name: "UserStore" }
  )
);

export default useUserStore;
