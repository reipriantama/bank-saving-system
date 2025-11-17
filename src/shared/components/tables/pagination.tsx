import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';

interface TablePaginationProps {
  current: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: string[];
  onChange: (page: number, pageSize: number) => void;
}

export function TablePagination({
  current,
  pageSize,
  total,
  pageSizeOptions = ['10', '20', '50', '100'],
  onChange
}: TablePaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  const startItem = (current - 1) * pageSize + 1;
  const endItem = Math.min(current * pageSize, total);

  const handlePageSizeChange = (newPageSize: string) => {
    const size = parseInt(newPageSize);
    const newPage = Math.min(current, Math.ceil(total / size));
    onChange(newPage, size);
  };

  if (total === 0) return null;

  return (
    <div className="flex flex-col gap-3 px-4 py-3 bg-muted/30 border-t rounded-b-lg sm:flex-row sm:items-center sm:justify-between">
      {/* Mobile Layout */}
      <div className="flex flex-col gap-3 sm:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-20 h-8 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map(size => (
                  <SelectItem key={size} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>/ hal.</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {startItem}-{endItem} dari {total}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={current <= 1}
            onClick={() => onChange(current - 1, pageSize)}
            className="px-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="px-3 py-1 bg-background border border-primary/20 text-primary rounded font-medium text-sm min-w-[60px] text-center">
            {current} / {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={current >= totalPages}
            onClick={() => onChange(current + 1, pageSize)}
            className="px-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex sm:items-center sm:justify-between sm:w-full">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Tampil</span>
          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-20 h-8 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map(size => (
                <SelectItem key={size} value={size}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>per halaman</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Hal. {current} dari {totalPages}</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={current <= 1}
              onClick={() => onChange(1, pageSize)}
              className="px-2"
            >
              <span className="sr-only">Ke Halaman Pertama</span>
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={current <= 1}
              onClick={() => onChange(current - 1, pageSize)}
              className="px-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={current >= totalPages}
              onClick={() => onChange(current + 1, pageSize)}
              className="px-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={current >= totalPages}
              onClick={() => onChange(totalPages, pageSize)}
              className="px-2"
            >
              <span className="sr-only">Ke Halaman Terakhir</span>
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
