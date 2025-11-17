"use client";

import DepositoTypeTable from "../../components/list/deposito-type-table";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DepositoTypeListPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto">
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Deposito Types
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage deposito types and their interest rates
            </p>
          </div>
          <Button onClick={() => router.push("/deposito-types/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Deposito Type
          </Button>
        </div>
      </div>

      <DepositoTypeTable />
    </div>
  );
}

