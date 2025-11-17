"use client";

import { useState, useMemo } from "react";
import { useAccountsQuery } from "@/features/accounts/api/account";
import { useAccountTransactionsQuery } from "../api/transaction";
import type { Transaction } from "../types/transaction";
import { TableColumn } from "@/shared/types/tables";
import DataTable from "@/shared/components/tables/data-table";
import { formatDate, formatCurrency } from "@/shared/utils/formatting";
import { Badge } from "@/shared/components/ui/badge";

export default function TransactionList() {
  const { data: accounts } = useAccountsQuery();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );

  const {
    data: transactions,
    isLoading,
    error,
  } = useAccountTransactionsQuery(selectedAccountId || "");

  const accountOptions = useMemo(
    () =>
      accounts?.map((acc) => ({
        value: acc.id.toString(),
        label: `${acc.customer?.name || `Account #${acc.id}`} - ${acc.packet}`,
      })) || [],
    [accounts]
  );

  const columns: TableColumn<Transaction>[] = [
    {
      key: "id",
      title: "ID",
      dataIndex: "id",
      width: 80,
    },
    {
      key: "type",
      title: "Type",
      dataIndex: "type",
      width: 120,
      render: (value: string) => (
        <Badge variant={value === "deposit" ? "default" : "destructive"}>
          {value.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: "amount",
      title: "Amount",
      dataIndex: "amount",
      width: 150,
      render: (value: string) => (
        <span className="font-semibold">
          {formatCurrency(parseFloat(value))}
        </span>
      ),
    },
    {
      key: "date",
      title: "Date",
      dataIndex: "date",
      width: 200,
      render: (value: string) => formatDate(value),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Account
        </label>
        <select
          value={selectedAccountId?.toString() || ""}
          onChange={(e) => setSelectedAccountId(e.target.value || null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Choose an account to view transactions</option>
          {accountOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {selectedAccountId && (
        <DataTable
          data={transactions || []}
          loading={isLoading}
          error={error}
          total={transactions?.length || 0}
          columns={columns}
          rowKey="id"
          size="md"
          striped={true}
          showNumbering={true}
          pagination={false}
          className="w-full"
        />
      )}

      {!selectedAccountId && (
        <div className="text-center py-8 text-gray-500">
          Please select an account to view transactions
        </div>
      )}
    </div>
  );
}
