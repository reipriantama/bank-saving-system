"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCustomerSchema } from "@/lib/validations";
import { FormInput } from "@/shared/components/forms/form-input";
import { Button } from "@/shared/components/ui/button";
import {
  useCreateCustomer,
  useUpdateCustomer,
  useCustomerQuery,
} from "../../api/customer";
import { useSonner } from "@/shared/hooks/use-sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { z } from "zod";

type CustomerFormData = z.infer<typeof createCustomerSchema>;

interface CustomerFormProps {
  customerId?: string;
}

export default function CustomerForm({ customerId }: CustomerFormProps) {
  const router = useRouter();
  const { sonner } = useSonner();
  const isEdit = !!customerId;

  const { data: customer } = useCustomerQuery(customerId || '');
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name,
      });
    }
  }, [customer, reset]);

  const onSubmit = async (data: CustomerFormData) => {
    try {
      if (isEdit && customerId) {
        await updateMutation.mutateAsync({ id: customerId, data });
        sonner.success("Customer updated successfully");
      } else {
        await createMutation.mutateAsync(data);
        sonner.success("Customer created successfully");
      }
      router.push("/customers");
    } catch (error) {
      sonner.error(
        error instanceof Error
          ? error.message
          : isEdit
          ? "Failed to update customer"
          : "Failed to create customer"
      );
    }
  };

  return (
    <div className="container mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {isEdit ? "Edit Customer" : "Create Customer"}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {isEdit
            ? "Update customer information"
            : "Add a new customer to the system"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          name="name"
          control={control}
          label="Name"
          placeholder="Enter customer name"
          required
        />

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isEdit
              ? "Update Customer"
              : "Create Customer"}
          </Button>
        </div>
      </form>
    </div>
  );
}

