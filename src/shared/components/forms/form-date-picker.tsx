"use client";

import * as React from "react";
import { Clock, ChevronDownIcon } from "lucide-react";
import {
  useController,
  Control,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Label } from "@/shared/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Input } from "@/shared/components/ui/input";
import FieldMessage from "./field-message";

interface FormDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  control: Control<TFieldValues>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  showTime?: boolean;
}

export function FormDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  placeholder = "Pick a date",
  required = false,
  disabled = false,
  description,
  containerClassName,
  labelClassName,
  errorClassName,
  showTime = true,
}: FormDatePickerProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    field.value ? new Date(field.value) : undefined
  );
  const [time, setTime] = React.useState<string>(() => {
    if (field.value) {
      const dateValue = new Date(field.value);
      return `${String(dateValue.getHours()).padStart(2, "0")}:${String(
        dateValue.getMinutes()
      ).padStart(2, "0")}`;
    }
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
  });

  React.useEffect(() => {
    if (field.value) {
      const dateValue = new Date(field.value);
      setDate(dateValue);
      if (showTime) {
        setTime(
          `${String(dateValue.getHours()).padStart(2, "0")}:${String(
            dateValue.getMinutes()
          ).padStart(2, "0")}`
        );
      }
    }
  }, [field.value, showTime]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setDate(undefined);
      field.onChange("");
      return;
    }

    if (showTime) {
      const [hours, minutes] = time.split(":").map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours || 0, minutes || 0, 0, 0);
      setDate(newDate);
      // Format as datetime-local string (YYYY-MM-DDTHH:mm)
      const formatted = `${newDate.getFullYear()}-${String(
        newDate.getMonth() + 1
      ).padStart(2, "0")}-${String(newDate.getDate()).padStart(
        2,
        "0"
      )}T${String(newDate.getHours()).padStart(2, "0")}:${String(
        newDate.getMinutes()
      ).padStart(2, "0")}`;
      field.onChange(formatted);
    } else {
      setDate(selectedDate);
      // Format as date string (YYYY-MM-DD)
      const formatted = `${selectedDate.getFullYear()}-${String(
        selectedDate.getMonth() + 1
      ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
      field.onChange(formatted);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);

    if (date) {
      const [hours, minutes] = newTime.split(":").map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours || 0, minutes || 0, 0, 0);
      // Format as datetime-local string (YYYY-MM-DDTHH:mm)
      const formatted = `${newDate.getFullYear()}-${String(
        newDate.getMonth() + 1
      ).padStart(2, "0")}-${String(newDate.getDate()).padStart(
        2,
        "0"
      )}T${String(newDate.getHours()).padStart(2, "0")}:${String(
        newDate.getMinutes()
      ).padStart(2, "0")}`;
      field.onChange(formatted);
    }
  };

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <Label
          htmlFor={name}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            required && "after:content-['*'] after:ml-0.5 after:text-red-500",
            labelClassName
          )}
        >
          {label}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={name}
            className={cn(
              "w-full justify-between font-normal",
              !date && "text-muted-foreground",
              error && "border-red-500 focus:ring-red-300 focus:border-red-500",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
            type="button"
          >
            {date ? (
              showTime ? (
                `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
              ) : (
                `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`
              )
            ) : (
              <span>{placeholder}</span>
            )}
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              handleDateSelect(selectedDate);
              if (!showTime) {
                setOpen(false);
              }
            }}
            captionLayout="dropdown"
            initialFocus
          />
          {showTime && (
            <div className="p-3 border-t">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={time}
                  onChange={handleTimeChange}
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {error && (
        <FieldMessage
          message={error.message}
          className={cn("text-red-500 text-sm", errorClassName)}
        />
      )}
    </div>
  );
}
