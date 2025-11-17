"use client";

import { useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAccountSchema } from "@/lib/validations";
import { FormInput } from "@/shared/components/forms/form-input";
import { FormSelect } from "@/shared/components/forms/form-select";
import { Button } from "@/shared/components/ui/button";
import { formatRupiahInput } from "@/shared/utils/formatting";
import {
  useUpdateAccount,
  useAccountQuery,
} from "../../api/account";
import { useCustomersQuery } from "@/features/customers/api/customer";
import { useDepositoTypesQuery } from "@/features/deposito-types/api/depositoType";
import { useSonner } from "@/shared/hooks/use-sonner";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { z } from "zod";

type AccountFormInput = z.input<typeof createAccountSchema>;
type AccountFormData = z.output<typeof createAccountSchema>;

interface AccountFormProps {
  accountId?: string;
}

export default function AccountForm({ accountId }: AccountFormProps) {
  const router = useRouter();
  const { sonner } = useSonner();
  const isEdit = !!accountId;

  const { data: account } = useAccountQuery(accountId || "");
  const { data: customers } = useCustomersQuery();
  const { data: depositoTypes } = useDepositoTypesQuery();
  const updateMutation = useUpdateAccount();
  const queryClient = useQueryClient();

  const customerOptions = useMemo(
    () =>
      customers?.map((c) => ({
        value: c.id.toString(),
        label: c.name,
      })) || [],
    [customers]
  );

  const depositoTypeOptions = useMemo(
    () =>
      depositoTypes?.map((dt) => ({
        value: dt.id.toString(),
        label: `${dt.name} (${(parseFloat(dt.yearlyReturn) * 100).toFixed(
          2
        )}%)`,
      })) || [],
    [depositoTypes]
  );

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { isSubmitting },
  } = useForm<AccountFormInput, unknown, AccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      packet: "",
      balance: "0",
      customerId: "",
      depositoTypeId: "",
    },
  });

  useEffect(() => {
    if (account) {
      reset({
        packet: account.packet,
        balance: account.balance,
        customerId: account.customerId,
        depositoTypeId: account.depositoTypeId,
      });
    }
  }, [account, reset]);

  const onSubmit = async (data: AccountFormData) => {
    try {
      // Get raw form values (input type) before transformation
      const rawValues = getValues() as AccountFormInput;
      
      if (isEdit && accountId) {
        // For update, use transformed data (number balance)
        await updateMutation.mutateAsync({ id: accountId, data });
        sonner.success("Account updated successfully");
      } else {
        // For create, send raw input values (string balance) directly to API
        // The API route uses createAccountSchema.parse which expects string input
        const createPayload: AccountFormInput = {
          packet: rawValues.packet,
          balance: rawValues.balance || "0", // Keep as string for API validation
          customerId: rawValues.customerId,
          depositoTypeId: rawValues.depositoTypeId,
        };
        // Send directly to API endpoint with string balance
        const res = await fetch('/api/accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createPayload),
        });
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || 'Failed to create account');
        }
        // Invalidate queries to refresh the list
        queryClient.invalidateQueries({ queryKey: ['accounts'] });
        sonner.success("Account created successfully");
      }
      router.push("/accounts");
    } catch (error) {
      sonner.error(
        error instanceof Error
          ? error.message
          : isEdit
          ? "Failed to update account"
          : "Failed to create account"
      );
    }
  };

  return (
    <div className="container mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {isEdit ? "Edit Account" : "Create Account"}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {isEdit
            ? "Update account information"
            : "Create a new account for a customer"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormSelect
          name="customerId"
          control={control as unknown as Control<AccountFormInput>}
          label="Customer"
          placeholder="Select a customer"
          options={customerOptions}
          required
        />

        <FormSelect
          name="depositoTypeId"
          control={control as unknown as Control<AccountFormInput>}
          label="Deposito Type"
          placeholder="Select a deposito type"
          options={depositoTypeOptions}
          required
        />

        <FormInput
          name="packet"
          control={control as unknown as Control<AccountFormInput>}
          label="Packet"
          placeholder="e.g., Standard, Premium"
          required
        />

        {!isEdit && (
          <FormInput
            name="balance"
            control={control as unknown as Control<AccountFormInput>}
            label="Initial Balance"
            placeholder="Enter initial balance"
            type="text"
            formatValue={formatRupiahInput}
            inputMode="numeric"
            required
          />
        )}

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isEdit
              ? "Update Account"
              : "Create Account"}
          </Button>
        </div>
      </form>
    </div>
  );
}
