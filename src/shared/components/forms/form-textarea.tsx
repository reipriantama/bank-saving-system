import React from "react";
import { useController, Control, FieldPath, FieldValues } from "react-hook-form";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import FieldMessage from "./field-message";
import { cn } from "@/shared/lib/cn";

interface FormTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name" | "defaultValue"> {
  name: TName;
  control: Control<TFieldValues>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  containerClassName?: string;
  labelClassName?: string;
  textareaClassName?: string;
  errorClassName?: string;
}

export function FormTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  placeholder,
  required = false,
  disabled = false,
  description,
  containerClassName,
  labelClassName,
  textareaClassName,
  errorClassName,
  className,
  ...props
}: FormTextareaProps<TFieldValues, TName>) {
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

      <Textarea
        {...field}
        {...props}
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          error && "border-red-500 focus:ring-red-300 focus:border-red-500",
          textareaClassName,
          className
        )}
      />

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
