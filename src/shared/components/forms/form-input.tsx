"use client";

import React from "react";
import {
  useController,
  Control,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/cn";
import FieldMessage from "./field-message";

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "name" | "defaultValue"
  > {
  name: TName;
  control: Control<TFieldValues>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  type?: React.HTMLInputTypeAttribute;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  description?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  formatValue?: (value: string) => string;
  onClickIconLeft?: () => void;
  onClickIconRight?: () => void;
}

export function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  placeholder,
  required = false,
  disabled = false,
  type = "text",
  inputMode = "text",
  description,
  containerClassName,
  labelClassName,
  inputClassName,
  errorClassName,
  className,
  iconLeft,
  iconRight,
  formatValue,
  onClickIconLeft,
  onClickIconRight,
  ...props
}: FormInputProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });
  const hasLeftIcon = !!iconLeft;
  const hasRightIcon = !!iconRight;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    // Check if this is a currency/rupiah field
    const isCurrencyField =
      (name as string).toLowerCase().includes("balance") ||
      (name as string).toLowerCase().includes("amount") ||
      (name as string).toLowerCase().includes("price");

    if (isCurrencyField && formatValue) {
      // For currency fields with formatValue, parse the input and store as string
      const parsed = val.replace(/[^\d]/g, "");
      field.onChange(parsed);
      return;
    }

    // Handle number or numeric inputMode
    if (
      type === "number" ||
      inputMode === "numeric" ||
      inputMode === "decimal"
    ) {
      // For decimal input, allow decimal point and preserve leading zeros before decimal
      if (
        inputMode === "decimal" ||
        (name as string).toLowerCase().includes("return") ||
        (name as string).toLowerCase().includes("rate") ||
        (name as string).toLowerCase().includes("percent")
      ) {
        // Allow digits and single decimal point
        val = val.replace(/[^\d.]/g, "");
        // Ensure only one decimal point
        const parts = val.split(".");
        if (parts.length > 2) {
          val = parts[0] + "." + parts.slice(1).join("");
        }
        // Preserve leading zeros before decimal point (e.g., 0.03)
        field.onChange(val);
      } else {
        // For integer numbers, remove all non-digit characters and leading zeros
        val = val.replace(/[^\d]/g, "");
        val = val.replace(/^0+/, "");
        field.onChange(val ? Number(val) : "");
      }
    } else if (
      type === "tel" ||
      (name as string).toLowerCase().includes("phone")
    ) {
      // For phone fields: remove leading zeros, but allow + at the start
      val = val.replace(/^0+/, "");
      // Allow + at the start and numbers only
      if (/^\+/.test(e.target.value)) {
        val = "+" + val;
      }
      field.onChange(val);
    } else {
      field.onChange(val);
    }
  };

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <Label
          htmlFor={name}
          className={cn(
            "block text-sm font-medium text-gray-700",
            required && "after:content-['*'] after:ml-0.5 after:text-red-500",
            labelClassName
          )}
        >
          {label}
        </Label>
      )}

      <div className="relative">
        {iconLeft && (
          <span
            className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer"
            onClick={onClickIconLeft}
            tabIndex={onClickIconLeft ? 0 : -1}
            role={onClickIconLeft ? "button" : undefined}
          >
            {iconLeft}
          </span>
        )}

        <Input
          {...field}
          {...props}
          id={name}
          type={type} // pakai text supaya aman
          inputMode={type === "number" ? "numeric" : inputMode}
          value={formatValue ? formatValue(field.value) : field.value || ""}
          disabled={disabled}
          placeholder={placeholder}
          onChange={handleChange}
          className={cn(
            error && "border-red-500 focus:ring-red-300 focus:border-red-500",
            hasLeftIcon && "pl-10",
            hasRightIcon && "pr-10",
            disabled && "opacity-50 cursor-not-allowed",
            inputClassName,
            className
          )}
        />

        {iconRight && (
          <span
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            onClick={onClickIconRight ? onClickIconRight : undefined}
            tabIndex={onClickIconRight || type === "password" ? 0 : -1}
            role={
              onClickIconRight || type === "password" ? "button" : undefined
            }
          >
            {iconRight}
          </span>
        )}
      </div>

      {description && !error && (
        <p className="text-sm text-gray-500">{description}</p>
      )}

      {error && (
        <FieldMessage
          className={cn("", errorClassName)}
          message={error.message}
        />
      )}
    </div>
  );
}
