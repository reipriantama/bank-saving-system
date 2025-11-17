import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Home, Users, Wallet, Coins, ArrowLeftRight } from "lucide-react";
import PATHS from "@/shared/routes";

export type SidebarMenuItem = {
  title: string;
  url?: string;
  icon?: React.ElementType;
  children?: SidebarMenuItem[];
};

export type SidebarSection = {
  title?: string;
  items: SidebarMenuItem[];
};

type SidebarStoreValue = {
  menu: SidebarSection[];
  setMenu: (menu: SidebarSection[]) => void;
};

const defaultSections: SidebarSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Home",
        url: PATHS.HOME,
        icon: Home,
      },
    ],
  },
  {
    title: "Banking System",
    items: [
      {
        title: "Customers",
        url: PATHS.PROTECTED.CUSTOMERS,
        icon: Users,
      },
      {
        title: "Accounts",
        url: PATHS.PROTECTED.ACCOUNTS,
        icon: Wallet,
      },
      {
        title: "Deposito Types",
        url: PATHS.PROTECTED.DEPOSITO_TYPES,
        icon: Coins,
      },
      {
        title: "Transactions",
        url: PATHS.PROTECTED.TRANSACTIONS,
        icon: ArrowLeftRight,
      },
    ],
  },
];

const useSidebarStore = create<SidebarStoreValue>()(
  devtools((set) => ({
    menu: defaultSections,
    setMenu: (menu) => set({ menu }),
  }))
);

export default useSidebarStore;
