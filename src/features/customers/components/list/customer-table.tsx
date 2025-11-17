"use client";

import { TableColumn } from "@/shared/types/tables";
import { useCustomersQuery, useDeleteCustomer } from "../../api/customer";
import { Customer } from "../../types/customer";
import DataTable from "@/shared/components/tables/data-table";
import { Button } from "@/shared/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useSonner } from "@/shared/hooks/use-sonner";
import { useState } from "react";
import DeleteDialog from "@/shared/components/tables/delete-dialog";
import { useRouter } from "next/navigation";

const CustomerTable = () => {
  const { data, isLoading, error } = useCustomersQuery();
  const deleteMutation = useDeleteCustomer();
  const { sonner } = useSonner();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleDelete = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCustomer) return;

    try {
      const customerId: string = String(selectedCustomer.id);
      await deleteMutation.mutateAsync(customerId);
      sonner.success("Customer deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedCustomer(null);
    } catch (error) {
      sonner.error(
        error instanceof Error ? error.message : "Failed to delete customer"
      );
    }
  };

  const columns: TableColumn<Customer>[] = [
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
      width: 300,
      sortable: true,
      render: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      key: "actions",
      title: "Actions",
      dataIndex: "id",
      width: 150,
      align: "center",
      render: (_value: unknown, record: Customer) => (
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/customers/${record.id}/edit`)}
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

  // Simple client-side search
  const [searchKeyword, setSearchKeyword] = useState("");
  const filteredData = data?.filter((customer) =>
    customer.name.toLowerCase().includes(searchKeyword.toLowerCase())
  ) || [];

  return (
    <>
      <DataTable<Customer>
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
        searchPlaceholder="Search customers by name..."
        searchValue={searchKeyword}
        onSearch={setSearchKeyword}
        pagination={false}
        className="w-full"
      />
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Customer"
        description={`Are you sure you want to delete "${selectedCustomer?.name}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
};

export default CustomerTable;

