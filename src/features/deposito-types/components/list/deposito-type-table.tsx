"use client";

import { TableColumn } from "@/shared/types/tables";
import { useDepositoTypesQuery, useDeleteDepositoType } from "../../api/depositoType";
import { DepositoType } from "../../types/depositoType";
import DataTable from "@/shared/components/tables/data-table";
import { Button } from "@/shared/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useSonner } from "@/shared/hooks/use-sonner";
import { useState } from "react";
import DeleteDialog from "@/shared/components/tables/delete-dialog";
import { useRouter } from "next/navigation";

const DepositoTypeTable = () => {
  const { data, isLoading, error } = useDepositoTypesQuery();
  const deleteMutation = useDeleteDepositoType();
  const { sonner } = useSonner();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDepositoType, setSelectedDepositoType] = useState<DepositoType | null>(null);

  const handleDelete = async (depositoType: DepositoType) => {
    setSelectedDepositoType(depositoType);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDepositoType) return;

    try {
      await deleteMutation.mutateAsync(selectedDepositoType.id);
      sonner.success("Deposito type deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedDepositoType(null);
    } catch (error) {
      sonner.error(
        error instanceof Error ? error.message : "Failed to delete deposito type"
      );
    }
  };

  const formatPercentage = (value: string) => {
    const num = parseFloat(value) * 100;
    return `${num.toFixed(2)}%`;
  };

  const columns: TableColumn<DepositoType>[] = [
    {
      key: "id",
      title: "ID",
      dataIndex: "id",
      width: 80,
      sortable: true,
    },
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
      width: 200,
      sortable: true,
      render: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      key: "yearlyReturn",
      title: "Yearly Return",
      dataIndex: "yearlyReturn",
      width: 150,
      sortable: true,
      render: (value: string) => (
        <span className="text-green-600 font-semibold">
          {formatPercentage(value)}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      dataIndex: "id",
      width: 150,
      align: "center",
      render: (_value: unknown, record: DepositoType) => (
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/deposito-types/${record.id}/edit`)}
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
  const filteredData = data?.filter((dt) =>
    dt.name.toLowerCase().includes(searchKeyword.toLowerCase())
  ) || [];

  return (
    <>
      <DataTable<DepositoType>
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
        searchPlaceholder="Search deposito types by name..."
        searchValue={searchKeyword}
        onSearch={setSearchKeyword}
        pagination={false}
        className="w-full"
      />
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Deposito Type"
        description={`Are you sure you want to delete "${selectedDepositoType?.name}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
};

export default DepositoTypeTable;

