"use client";

import CustomerTable from "../../components/list/customer-table";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CustomerListPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto">
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Customers
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your customers
            </p>
          </div>
          <Button onClick={() => router.push("/customers/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      <CustomerTable />
    </div>
  );
}

