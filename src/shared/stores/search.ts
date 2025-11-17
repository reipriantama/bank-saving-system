"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

type SearchStoreValue = {
  searchValue: string;
  setSearchValue: (value: string) => void;
  clearSearch: () => void;
};

const useSearchStore = create<SearchStoreValue>()(
  devtools(
    (set) => ({
      searchValue: "",
      setSearchValue: (value) => set({ searchValue: value }),
      clearSearch: () => set({ searchValue: "" }),
    }),
    { name: "SearchStore" }
  )
);

export default useSearchStore;

