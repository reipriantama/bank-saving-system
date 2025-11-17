"use client";

import { useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDepositoTypeSchema } from "@/lib/validations";
import { FormInput } from "@/shared/components/forms/form-input";
import { Button } from "@/shared/components/ui/button";
import {
  useCreateDepositoType,
  useUpdateDepositoType,
  useDepositoTypeQuery,
} from "../../api/depositoType";
import { useSonner } from "@/shared/hooks/use-sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { z } from "zod";

type DepositoTypeFormInput = z.input<typeof createDepositoTypeSchema>;
type DepositoTypeFormData = z.output<typeof createDepositoTypeSchema>;

interface DepositoTypeFormProps {
  depositoTypeId?: string;
}

export default function DepositoTypeForm({
  depositoTypeId,
}: DepositoTypeFormProps) {
  const router = useRouter();
  const { sonner } = useSonner();
  const isEdit = !!depositoTypeId;

  const { data: depositoType } = useDepositoTypeQuery(depositoTypeId || "");
  const createMutation = useCreateDepositoType();
  const updateMutation = useUpdateDepositoType();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<DepositoTypeFormInput, unknown, DepositoTypeFormData>({
    resolver: zodResolver(createDepositoTypeSchema),
    defaultValues: {
      name: "",
      yearlyReturn: 0,
    },
  });

  useEffect(() => {
    if (depositoType) {
      reset({
        name: depositoType.name,
        yearlyReturn: parseFloat(depositoType.yearlyReturn),
      });
    }
  }, [depositoType, reset]);

  const onSubmit = async (data: DepositoTypeFormData) => {
    try {
      if (isEdit && depositoTypeId) {
        await updateMutation.mutateAsync({ id: depositoTypeId, data });
        sonner.success("Deposito type updated successfully");
      } else {
        await createMutation.mutateAsync(data);
        sonner.success("Deposito type created successfully");
      }
      router.push("/deposito-types");
    } catch (error) {
      sonner.error(
        error instanceof Error
          ? error.message
          : isEdit
          ? "Failed to update deposito type"
          : "Failed to create deposito type"
      );
    }
  };

  return (
    <div className="container mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {isEdit ? "Edit Deposito Type" : "Create Deposito Type"}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {isEdit
            ? "Update deposito type information"
            : "Add a new deposito type to the system"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          name="name"
          control={control as unknown as Control<DepositoTypeFormInput>}
          label="Name"
          placeholder="e.g., Bronze, Silver, Gold"
          required
        />

        <FormInput
          name="yearlyReturn"
          control={control as unknown as Control<DepositoTypeFormInput>}
          label="Yearly Return (as decimal)"
          placeholder="e.g., 0.03 for 3%, 0.05 for 5%"
          type="text"
          inputMode="decimal"
          required
          description="Enter as a decimal (0.03 = 3%, 0.05 = 5%, etc.)"
        />

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isEdit
              ? "Update Deposito Type"
              : "Create Deposito Type"}
          </Button>
        </div>
      </form>
    </div>
  );
}
