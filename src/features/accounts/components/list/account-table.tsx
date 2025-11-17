"use client";

import { TableColumn } from "@/shared/types/tables";
import { useAccountsQuery, useDeleteAccount } from "../../api/account";
import { Account } from "../../types/account";
import DataTable from "@/shared/components/tables/data-table";
import { Button } from "@/shared/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useSonner } from "@/shared/hooks/use-sonner";
import { useState } from "react";
import DeleteDialog from "@/shared/components/tables/delete-dialog";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/shared/utils/formatting";

const AccountTable = () => {
  const { data, isLoading, error } = useAccountsQuery();
  const deleteMutation = useDeleteAccount();
  const { sonner } = useSonner();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const handleDelete = async (account: Account) => {
    setSelectedAccount(account);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedAccount) return;

    try {
      await deleteMutation.mutateAsync(selectedAccount.id);
      sonner.success("Account deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedAccount(null);
    } catch (error) {
      sonner.error(
        error instanceof Error ? error.message : "Failed to delete account"
      );
    }
  };

  const columns: TableColumn<Account>[] = [
    {
      key: "id",
      title: "ID",
      dataIndex: "id",
      width: 80,
      sortable: true,
    },
    {
      key: "customer",
      title: "Customer",
      dataIndex: "customer",
      width: 200,
      render: (_value: unknown, record: Account) => (
        <span className="font-medium">
          {record.customer?.name || `Customer #${record.customerId}`}
        </span>
      ),
    },
    {
      key: "packet",
      title: "Packet",
      dataIndex: "packet",
      width: 150,
      sortable: true,
    },
    {
      key: "depositoType",
      title: "Deposito Type",
      dataIndex: "depositoType",
      width: 150,
      render: (_value: unknown, record: Account) => (
        <span>{record.depositoType?.name || "N/A"}</span>
      ),
    },
    {
      key: "balance",
      title: "Balance",
      dataIndex: "balance",
      width: 150,
      sortable: true,
      render: (value: string) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(parseFloat(value))}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      dataIndex: "id",
      width: 200,
      align: "center",
      render: (_value: unknown, record: Account) => (
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/accounts/${record.id}/edit`)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(record)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const [searchKeyword, setSearchKeyword] = useState("");
  const filteredData =
    data?.filter(
      (account) =>
        account.customer?.name
          ?.toLowerCase()
          .includes(searchKeyword.toLowerCase()) ||
        account.packet.toLowerCase().includes(searchKeyword.toLowerCase())
    ) || [];

  return (
    <>
      <DataTable<Account>
        data={filteredData}
        loading={isLoading}
        error={error}
        total={filteredData.length}
        columns={columns}
        rowKey="id"
        size="md"
        striped={true}
        showNumbering={true}
        searchable={true}
        searchPlaceholder="Search accounts by customer or packet..."
        searchValue={searchKeyword}
        onSearch={setSearchKeyword}
        pagination={false}
        className="w-full"
      />
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Account"
        description={`Are you sure you want to delete this account? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
};

export default AccountTable;

