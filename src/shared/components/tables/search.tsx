import { useState, useEffect } from 'react';
import { Input } from '@/shared/components/ui/input';
import { SearchIcon, XIcon } from 'lucide-react';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { cn } from '@/shared/lib/cn';

interface TableSearchProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function TableSearch({
  value,
  placeholder = "Search...",
  onChange,
  disabled,
  className
}: TableSearchProps) {
  const [searchValue, setSearchValue] = useState(value);
  const [isDirty, setIsDirty] = useState(false);
  const debouncedSearchValue = useDebounce(searchValue, 500);

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  useEffect(() => {
    if (isDirty) {
      onChange(debouncedSearchValue);
    }
  }, [debouncedSearchValue, onChange, isDirty]);

  const handleClear = () => {
    setSearchValue('');
    setIsDirty(true);
    onChange('');
  };

  const showClearButton = searchValue.length > 0 && !disabled;

  return (
    <div className={cn("relative max-w-sm bg-white", className)}>
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
          setIsDirty(true);
        }}
        className={cn(
          "pl-9",
          showClearButton && "pr-9"
        )}
        disabled={disabled}
      />
      {showClearButton && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-muted/50"
          aria-label="Clear search"
        >
          <XIcon className="h-4 w-4 text-red-500" />
        </button>
      )}
    </div>
  );
}
