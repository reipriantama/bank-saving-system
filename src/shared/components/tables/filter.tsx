import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { cn } from '@/shared/lib/cn';

export type FilterOption<T = string> = {
  value: T;
  label: string;
};

interface TableFilterProps<T = string> {
  value: T;
  options: FilterOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

export function TableFilter<T extends string = string>({
  value,
  options,
  onChange,
  disabled,
  className,
  label,
  placeholder = "Select filter...",
}: TableFilterProps<T>) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label && (
        <span className="text-sm text-gray-600 whitespace-nowrap">{label}:</span>
      )}
      <Select
        value={value}
        onValueChange={(val) => !disabled && onChange(val as T)}
        disabled={disabled}
      >
        <SelectTrigger className="w-[180px] h-9">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

