import React from "react";
import { useController, Control, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/cn";
import FieldMessage from "./field-message";

interface FormTelephoneProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "defaultValue" | "type" | "value" | "onChange"> {
  name: TName;
  control: Control<TFieldValues>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  placeholder?: string;
  maxLength?: number;
}

export function FormTelephone<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  required = false,
  disabled = false,
  description,
  containerClassName,
  labelClassName,
  inputClassName,
  errorClassName,
  placeholder = "Masukkan nomor telepon contoh: 81234567890 / 234567890",
  maxLength = 20,
  className,
  ...props
}: FormTelephoneProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  // Only support +62 for now
  const COUNTRY_CODE = "+62";

  // Extract number part from field value (e.g. +6281234567890 -> 81234567890)
  const getNumberPart = (value?: string) =>
    value && value.startsWith(COUNTRY_CODE)
      ? value.slice(COUNTRY_CODE.length)
      : value ?? "";

  // Update handler for input field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-digit characters
    let val = e.target.value.replace(/[^\d]/g, "");
    // Prevent leading zero if user enters "0812..." after +62
    if (val.startsWith("0")) {
      val = val.replace(/^0+/, "");
    }
    // Compose the final value as +62XXXXXXXXXXX
    field.onChange(COUNTRY_CODE + val);
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

      <div className="flex items-center relative">
        <div className="flex items-center">
          {/* Country code select, disabled for now */}
          <select
            className={cn(
              "block border rounded-l-md px-2 py-2 text-sm bg-gray-50 border-r-0 focus:ring-0 focus:outline-none",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            value={COUNTRY_CODE}
            disabled
            style={{ width: "68px", minWidth: "68px" }}
          >
            <option value={COUNTRY_CODE}>{COUNTRY_CODE}</option>
          </select>
        </div>
        <Input
          id={name}
          {...props}
          type="tel"
          inputMode="numeric"
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          value={getNumberPart(field.value)}
          onChange={handleChange}
          className={cn(
            "rounded-l-none",
            error && "border-red-500 focus:ring-red-300 focus:border-red-500",
            inputClassName,
            className
          )}
        />
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

export default FormTelephone;
