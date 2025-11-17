"use client";

import { useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { withdrawSchema } from "@/lib/validations";
import { FormInput } from "@/shared/components/forms/form-input";
import { FormSelect } from "@/shared/components/forms/form-select";
import { FormDatePicker } from "@/shared/components/forms/form-date-picker";
import { Button } from "@/shared/components/ui/button";
import { formatRupiahInput } from "@/shared/utils/formatting";
import { useAccountsQuery } from "@/features/accounts/api/account";
import { useSonner } from "@/shared/hooks/use-sonner";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { formatCurrency } from "@/shared/utils/formatting";

type WithdrawFormInput = z.input<typeof withdrawSchema>;
type WithdrawFormData = z.output<typeof withdrawSchema>;

interface WithdrawFormProps {
  onSuccess?: () => void;
}

export default function WithdrawForm({ onSuccess }: WithdrawFormProps) {
  const { sonner } = useSonner();
  const { data: accounts } = useAccountsQuery();
  const queryClient = useQueryClient();
  const [calculationResult, setCalculationResult] = useState<{
    startingBalance: number;
    months: number;
    yearlyReturn: number;
    monthlyReturn: number;
    endingBalance: number;
  } | null>(null);

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
  } = useForm<WithdrawFormInput, unknown, WithdrawFormData>({
    resolver: zodResolver(withdrawSchema),
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
      const rawValues = getValues() as WithdrawFormInput;

      // Send raw input values (string amount) directly to API
      // The API route uses withdrawSchema.parse which expects string input
      const createPayload: WithdrawFormInput = {
        accountId: rawValues.accountId,
        amount: rawValues.amount || "0", // Keep as string for API validation
        date: rawValues.date, // Keep as string for API validation
      };

      // Send directly to API endpoint with string amount
      const res = await fetch("/api/transactions/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createPayload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to process withdrawal");
      }

      const result = await res.json();

      // Invalidate queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      sonner.success("Withdrawal processed successfully");
      setCalculationResult(result.calculation);
      reset();
      onSuccess?.();
    } catch (error) {
      sonner.error(
        error instanceof Error ? error.message : "Failed to process withdrawal"
      );
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormSelect
          name="accountId"
          control={control as unknown as Control<WithdrawFormInput>}
          label="Account"
          placeholder="Select an account"
          options={accountOptions}
          required
        />

        <FormInput
          name="amount"
          control={control as unknown as Control<WithdrawFormInput>}
          label="Amount"
          placeholder="Enter Withdrawal Amount"
          type="text"
          formatValue={formatRupiahInput}
          inputMode="numeric"
          required
        />

        <FormDatePicker
          name="date"
          control={control as unknown as Control<WithdrawFormInput>}
          label="Date"
          placeholder="Pick a date and time"
          showTime={true}
          required
        />

        <div className="flex gap-4 justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Process Withdrawal"}
          </Button>
        </div>
      </form>

      {calculationResult && (
        <Card>
          <CardHeader>
            <CardTitle>Interest Calculation</CardTitle>
            <CardDescription>
              Breakdown of the withdrawal calculation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Starting Balance</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(calculationResult.startingBalance)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Months</p>
                <p className="text-lg font-semibold">
                  {calculationResult.months}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Yearly Return</p>
                <p className="text-lg font-semibold text-green-600">
                  {(calculationResult.yearlyReturn * 100).toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Return</p>
                <p className="text-lg font-semibold text-green-600">
                  {(calculationResult.monthlyReturn * 100).toFixed(2)}%
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">
                  Ending Balance (with interest)
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(calculationResult.endingBalance)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
