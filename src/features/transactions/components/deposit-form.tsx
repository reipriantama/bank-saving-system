"use client";

import { useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { depositSchema } from "@/lib/validations";
import { FormInput } from "@/shared/components/forms/form-input";
import { FormSelect } from "@/shared/components/forms/form-select";
import { FormDatePicker } from "@/shared/components/forms/form-date-picker";
import { Button } from "@/shared/components/ui/button";
import { formatRupiahInput } from "@/shared/utils/formatting";
import { useAccountsQuery } from "@/features/accounts/api/account";
import { useSonner } from "@/shared/hooks/use-sonner";
import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { z } from "zod";

type DepositFormInput = z.input<typeof depositSchema>;
type DepositFormData = z.output<typeof depositSchema>;

interface DepositFormProps {
  onSuccess?: () => void;
}

export default function DepositForm({ onSuccess }: DepositFormProps) {
  const { sonner } = useSonner();
  const { data: accounts } = useAccountsQuery();
  const queryClient = useQueryClient();

  const accountOptions = useMemo(
    () =>
      accounts?.map((acc) => ({
        value: acc.id.toString(),
        label: `${acc.customer?.name || `Account #${acc.id}`} - ${
          acc.packet
        } (Balance: ${parseFloat(acc.balance).toLocaleString("id-ID")})`,
      })) || [],
    [accounts]
  );

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { isSubmitting },
  } = useForm<DepositFormInput, unknown, DepositFormData>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      accountId: "",
      amount: "",
      date: (() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(now.getDate()).padStart(2, "0")}T${String(
          now.getHours()
        ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      })(), // Format for datetime-local input (YYYY-MM-DDTHH:mm)
    },
  });

  const onSubmit = async () => {
    try {
      // Get raw form values (input type) before transformation
      // Form validation is handled by zodResolver before this function is called
      const rawValues = getValues() as DepositFormInput;

      // Send raw input values (string amount) directly to API
      // The API route uses depositSchema.parse which expects string input
      const createPayload: DepositFormInput = {
        accountId: rawValues.accountId,
        amount: rawValues.amount || "0", // Keep as string for API validation
        date: rawValues.date, // Keep as string for API validation
      };

      // Send directly to API endpoint with string amount
      const res = await fetch("/api/transactions/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createPayload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to process deposit");
      }

      // Invalidate queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      sonner.success("Deposit processed successfully");
      reset();
      onSuccess?.();
    } catch (error) {
      sonner.error(
        error instanceof Error ? error.message : "Failed to process deposit"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormSelect
        name="accountId"
        control={control as unknown as Control<DepositFormInput>}
        label="Account"
        placeholder="Select an account"
        options={accountOptions}
        required
      />

      <FormInput
        name="amount"
        control={control as unknown as Control<DepositFormInput>}
        label="Amount"
        placeholder="Enter Deposit Amount"
        type="text"
        formatValue={formatRupiahInput}
        inputMode="numeric"
        required
      />

      <FormDatePicker
        name="date"
        control={control as unknown as Control<DepositFormInput>}
        label="Date"
        placeholder="Pick a date and time"
        showTime={true}
        required
      />

      <div className="flex gap-4 justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Process Deposit"}
        </Button>
      </div>
    </form>
  );
}
