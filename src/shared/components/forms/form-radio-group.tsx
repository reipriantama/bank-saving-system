import * as React from "react";
import { useController, Control, FieldPath, FieldValues } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/cn";
import FieldMessage from "./field-message";

interface RadioOption {
  value: string;
  label: string;
}

interface FormRadioProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  control: Control<TFieldValues>;
  label?: string;
  options: RadioOption[];
  required?: boolean;
  disabled?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

export function FormRadioGroup<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  options,
  required = false,
  disabled = false,
  containerClassName,
  labelClassName,
  errorClassName,
}: FormRadioProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <Label
          htmlFor={name}
          className={cn(
            "block text-sm font-medium text-gray-700 mb-1",
            required && "after:content-['*'] after:ml-0.5 after:text-red-500",
            labelClassName
          )}
        >
          {label}
        </Label>
      )}
      <RadioGroup
        {...field}
        onValueChange={field.onChange}
        value={field.value}
        disabled={disabled}
        className="flex flex-col gap-2"
      >
        {options.map((opt) => (
          <div key={opt.value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={opt.value}
              id={`${name}-${opt.value}`}
              disabled={disabled}
            />
            <Label htmlFor={`${name}-${opt.value}`}>{opt.label}</Label>
          </div>
        ))}
      </RadioGroup>
      {error && (
        <FieldMessage
          className={cn("", errorClassName)}
          message={error.message}
        />
      )}
    </div>
  );
}
