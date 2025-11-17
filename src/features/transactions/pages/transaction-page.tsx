"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import DepositForm from "../components/deposit-form";
import WithdrawForm from "../components/withdraw-form";
import TransactionList from "../components/transaction-list";

export default function TransactionPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Transactions
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Deposit and withdraw funds from accounts
        </p>
      </div>

      <Tabs defaultValue="deposit" className="space-y-6">
        <TabsList>
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="deposit">
          <Card>
            <CardHeader>
              <CardTitle>Deposit Funds</CardTitle>
              <CardDescription>Add funds to an account</CardDescription>
            </CardHeader>
            <CardContent>
              <DepositForm onSuccess={() => {}} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Funds</CardTitle>
              <CardDescription>
                Withdraw funds from an account (with interest calculation)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WithdrawForm onSuccess={() => {}} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                View all transactions for an account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
