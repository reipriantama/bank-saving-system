"use client";

import { useCustomersQuery } from "@/features/customers/api/customer";
import { useAccountsQuery } from "@/features/accounts/api/account";
import { useDepositoTypesQuery } from "@/features/deposito-types/api/depositoType";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Users, Wallet, Coins } from "lucide-react";
import { formatCurrency } from "@/shared/utils/formatting";
import { useMemo } from "react";

export default function HomePage() {
  const { data: customers, isLoading: customersLoading } = useCustomersQuery();
  const { data: accounts, isLoading: accountsLoading } = useAccountsQuery();
  const { data: depositoTypes, isLoading: depositoTypesLoading } =
    useDepositoTypesQuery();

  const totalBalance = useMemo(() => {
    if (!accounts) return 0;
    return accounts.reduce((sum, account) => {
      return sum + parseFloat(account.balance);
    }, 0);
  }, [accounts]);

  const isLoading = customersLoading || accountsLoading || depositoTypesLoading;

  return (
    <div className="container mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Welcome to Bank Saving System
        </h1>
        <p className="text-gray-600">
          Manage your customers, accounts, and transactions efficiently
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : customers?.length || 0}
            </div>
            <CardDescription className="mt-1">
              Active customers in the system
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Accounts
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : accounts?.length || 0}
            </div>
            <CardDescription className="mt-1">
              Active accounts managed
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Deposito Types
            </CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : depositoTypes?.length || 0}
            </div>
            <CardDescription className="mt-1">
              Available deposito packages
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : formatCurrency(totalBalance)}
            </div>
            <CardDescription className="mt-1">
              Combined account balance
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
