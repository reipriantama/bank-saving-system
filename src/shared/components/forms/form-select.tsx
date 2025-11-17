import React from "react";
import { useController, Control, FieldPath, FieldValues } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";
import FieldMessage from "./field-message";
import { cn } from "@/shared/lib/cn";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  control: Control<TFieldValues>;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  containerClassName?: string;
  labelClassName?: string;
  selectClassName?: string;
  errorClassName?: string;
}

export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  options,
  label,
  placeholder = "Select an option",
  required = false,
  disabled = false,
  description,
  containerClassName,
  labelClassName,
  selectClassName,
  errorClassName,
}: FormSelectProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

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

      <Select
        value={field.value || ""}
        onValueChange={(value) => {
          if (value === "") {
            return;
          }

          field.onChange(value);
        }}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            "w-full",
            error && "border-red-500 focus:ring-red-300 focus:border-red-500",
            selectClassName
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
        >
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
