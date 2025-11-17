/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Badge } from '@/shared/components/ui/badge';
import {
  RotateCcw,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  FileQuestionIcon,
  GripVertical
} from 'lucide-react';
import { TableSearch } from './search';
import { TableFilter } from './filter';
import { TablePagination } from './pagination';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/collapsible';
import { DataTableProps, TableColumn, TableSort } from '@/shared/types/tables';
import { cn } from '@/shared/lib/cn';

const DataTable = <T extends Record<string, any>>({
  // Data and loading state (controlled by parent)
  data,
  loading,
  error,
  total,

  // Table configuration
  columns,
  rowKey,

  // UI Options
  striped = true,
  bordered = false,
  compact = false,
  showNumbering = true,

  // Features
  searchable = true,
  searchPlaceholder = "Cari ...",
  filterable = false,
  filterOptions = [],
  filterValue,
  filterLabel = "Filter",
  onFilterChange,
  pagination = true,

  // Multi-sorting
  onSortChange,
  sortState,
  maxSorts = 1,

  // Drag & Drop ordering
  isDraggable = false,
  onDraggable,

  // Styling
  className,
  rowClassName,

  // Event handlers (controlled by parent)
  onSearch,
  onPaginationChange,
  onReset,

  // Current state values
  currentPage = 1,
  pageSize = 10,
  searchValue = '',

}: DataTableProps<T>) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  /**
   * DRAG & DROP STATE
   */
  const [orderedData, setOrderedData] = useState<T[]>(() => data ?? []);
  const dragItemIndexRef = useRef<number | null>(null);
  const dragOverIndexRef = useRef<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  // Sinkronisasi ketika data dari parent berubah (misal setelah fetch / filter)
  useEffect(() => {
    if (!loading) {
      setOrderedData(data ?? []);
    }
  }, [data, loading]);

  // Data final yang digunakan untuk rendering (jika draggable pakai orderedData)
  const renderData = useMemo(() => isDraggable ? orderedData : (data ?? []), [isDraggable, orderedData, data]);

  const finalColumns = useMemo(() => {
    if (!showNumbering && !isDraggable) {
      return columns;
    }

    // Kolom numbering (tetap)
    const numberingColumn: TableColumn<T> = {
      key: '__numbering__',
      title: 'No',
      width: 60,
      align: 'center',
      render: (_: unknown, __: T, index: number) => {
        const number = (currentPage - 1) * pageSize + index + 1;
        return (
          <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-xs">
            {number}
          </Badge>
        );
      },
    };

    // Kolom drag handle (jika draggable)
    const dragHandleColumn: TableColumn<T> = {
      key: '__drag__',
      title: '',
      width: 40,
      align: 'center',
      render: () => (
        <div
          className="flex items-center justify-center cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          title="Geser untuk mengurutkan"
          aria-label="Drag Handle"
          onClick={(e) => e.preventDefault()}
        >
          <GripVertical className="h-4 w-4" />
        </div>
      ),
    };

    let base = columns;

    // Sisipkan drag handle paling depan jika draggable
    if (isDraggable) {
      base = [dragHandleColumn, ...base];
    }

    // Sisipkan numbering sesudah drag handle (atau paling depan jika tidak draggable)
    if (showNumbering) {
      if (isDraggable) {
        base = [dragHandleColumn, numberingColumn, ...columns];
      } else {
        base = [numberingColumn, ...columns];
      }
    }

    // Jika draggable dan numbering, logic di atas menambahkan drag handle dua kali, hindari duplikasi
    if (isDraggable && showNumbering) {
      // Hapus dragHandle duplicate di index 0
      const firstDragIndex = base.findIndex(c => c.key === '__drag__');
      const lastDragIndex = base.lastIndexOf(base.find(c => c.key === '__drag__')!);
      if (firstDragIndex !== lastDragIndex) {
        base = base.filter((_, idx) => idx !== lastDragIndex);
      }
    }

    return base;
  }, [columns, showNumbering, currentPage, pageSize, isDraggable]);

  // Determine which columns to show based on screen size
  const visibleColumns = useMemo(() => {
    if (!isMobile) return finalColumns;
    return finalColumns.slice(0, 3);
  }, [finalColumns, isMobile]);

  // Get value from record using dataIndex
  const getCellValue = useCallback((record: T, column: TableColumn<T>) => {
    if (column.dataIndex) {
      return record[column.dataIndex];
    }
    return record[column.key];
  }, []);

  // Toggle row expansion on mobile
  const toggleRowExpansion = useCallback((key: string) => {
    setExpandedRows(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(key)) {
        newExpanded.delete(key);
      } else {
        newExpanded.add(key);
      }
      return newExpanded;
    });
  }, []);

  // Multi-sort handlers
  const handleSort = useCallback((column: TableColumn<T>) => {
    if (!column.sortable || !onSortChange || isDraggable) return; // optional: disable sort when draggable active
    const currentSorts = sortState || [];
    const existingSortIndex = currentSorts.findIndex(sort => sort.field === column.key);
    let newSorts: TableSort<T>[] = [];

    if (existingSortIndex >= 0) {
      const existingSort = currentSorts[existingSortIndex];
      if (existingSort.direction === 'asc') {
        newSorts = currentSorts.map((sort, index) =>
          index === existingSortIndex
            ? { ...sort, direction: 'desc' }
            : sort
        );
      } else {
        newSorts = currentSorts.filter((_, index) => index !== existingSortIndex);
      }
    } else {
      if (currentSorts.length < maxSorts) {
        newSorts = [...currentSorts, { field: column.key, direction: 'asc' }];
      } else {
        newSorts = [
          ...currentSorts.slice(1),
          { field: column.key, direction: 'asc' }
        ];
      }
    }
    onSortChange(newSorts);
  }, [onSortChange, sortState, isDraggable, maxSorts]);

  const getSortInfo = useCallback((column: TableColumn<T>) => {
    if (!sortState) return null;
    const sortIndex = sortState.findIndex(sort => sort.field === column.key);
    if (sortIndex === -1) return null;
    return {
      direction: sortState[sortIndex].direction,
      order: sortIndex + 1,
      isMultiple: sortState.length > 1
    };
  }, [sortState]);

  const renderSortIndicator = useCallback((column: TableColumn<T>) => {
    if (!column.sortable) return null;
    const sortInfo = getSortInfo(column);
    if (!sortInfo) {
      return (
        <ArrowUpDown className="w-3 h-3 ml-1 text-muted-foreground/60" />
      );
    }
    return (
      <div className="inline-flex items-center ml-1">
        {sortInfo.direction === 'asc' ? (
          <ArrowUp className="w-3 h-3" />
        ) : (
          <ArrowDown className="w-3 h-3" />
        )}
        {sortInfo.isMultiple && (
          <span className="text-xs ml-0.5 bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center">
            {sortInfo.order}
          </span>
        )}
      </div>
    );
  }, [getSortInfo]);

  // Drag & Drop handlers
  const cleanupDrag = useCallback(() => {
    dragItemIndexRef.current = null;
    dragOverIndexRef.current = null;
    setDraggingIndex(null);
  }, []);


  const handleDragStart = useCallback((e: React.DragEvent<HTMLTableRowElement>) => {
    if (!isDraggable) return;
    const index = Number(e.currentTarget.dataset.index);
    dragItemIndexRef.current = index;
    setDraggingIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Safari fix
    e.dataTransfer.setData("text/plain", "");
  }, [isDraggable]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLTableRowElement>) => {
    if (!isDraggable) return;
    e.preventDefault();
    const overIndex = Number(e.currentTarget.dataset.index);
    dragOverIndexRef.current = overIndex;
  }, [isDraggable]);

  const reorderArray = useCallback((list: T[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLTableRowElement>) => {
    if (!isDraggable) return;
    e.preventDefault();
    const from = dragItemIndexRef.current;
    const to = Number(e.currentTarget.dataset.index);

    if (from === null || to === null || from === to) {
      cleanupDrag();
      return;
    }

    const newData = reorderArray(orderedData, from, to);
    setOrderedData(newData);
    onDraggable?.(newData);
    cleanupDrag();
  }, [isDraggable, orderedData, onDraggable, cleanupDrag, reorderArray]);

  const handleDragEnd = useCallback(() => {
    cleanupDrag();
  }, [cleanupDrag]);

  // Mobile Card View Component (drag tidak diaktifkan di mobile untuk kesederhanaan)
  const MobileCardView = ({ record, index }: { record: T; index: number }) => {
    const key = typeof rowKey === 'function'
      ? rowKey(record)
      : (record[rowKey] as string) || index.toString();

    const isExpanded = expandedRows.has(key);
    const mainColumns = finalColumns.slice(0, 3);
    const hiddenColumns = finalColumns.slice(3);

    return (
      <Card className={cn(
        "mb-3",
        striped && index % 2 === 1 && "bg-muted/20"
      )}>
        <CardContent className="p-4">
          <div className="space-y-2">
            {mainColumns.map((column) => {
              // Sembunyikan kolom drag handle di mobile card
              if (column.key === '__drag__') return null;
              const value = getCellValue(record, column);
              return (
                <div key={column.key} className="flex justify-between items-start">
                  <span className="text-sm font-medium text-muted-foreground min-w-0 flex-1">
                    {column.title}:
                  </span>
                  <div className="text-sm text-right ml-2 flex-1">
                    {column.render
                      ? column.render(value, record, index)
                      : value?.toString() || '-'
                    }
                  </div>
                </div>
              );
            })}
            {hiddenColumns.length > 0 && (
              <Collapsible open={isExpanded} onOpenChange={() => toggleRowExpansion(key)}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full mt-2 h-8">
                    {isExpanded ? (
                      <>
                        <ChevronDown className="h-4 w-4 mr-2" />
                        Sembunyikan Detail
                      </>
                    ) : (
                      <>
                        <ChevronRight className="h-4 w-4 mr-2" />
                        Lihat Detail
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-2 pt-2 border-t">
                  {hiddenColumns.map((column) => {
                    if (column.key === '__drag__') return null;
                    const value = getCellValue(record, column);
                    return (
                      <div key={column.key} className="flex justify-between items-start">
                        <span className="text-sm font-medium text-muted-foreground min-w-0 flex-1">
                          {column.title}:
                        </span>
                        <div className="text-sm text-right ml-2 flex-1">
                          {column.render
                            ? column.render(value, record, index)
                            : value?.toString() || '-'
                          }
                        </div>
                      </div>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const getRowClassName = (record: T, index: number) => {
    let classes = '';

    if (striped && index % 2 === 1) {
      classes += 'bg-muted/20';
    }
    classes += ' hover:bg-muted/50 transition-colors duration-200';

    if (compact) {
      classes += ' h-10';
    }

    if (isDraggable) {
      classes += ' cursor-grab ';
    }

    if (draggingIndex === index) {
      classes += ' opacity-50 ring-2 ring-primary/40 ';
    }

    if (typeof rowClassName === 'function') {
      classes += ' ' + rowClassName(record, index);
    } else if (rowClassName) {
      classes += ' ' + rowClassName;
    }

    return classes;
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <FileQuestionIcon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-muted-foreground mb-2">
        {error ? 'Gagal memuat data' : 'Tidak ada data yang ditemukan'}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {error ? 'Terjadi kesalahan saat memuat data' : 'Belum ada data untuk ditampilkan'}
      </p>
      {error && onReset && (
        <Button onClick={onReset} size="sm">
          <RotateCcw className="w-4 h-4 mr-2" />
          Coba Lagi
        </Button>
      )}
    </div>
  );

  const LoadingRows = () => (
    <>
      {Array.from({ length: pageSize }).map((_, index) => (
        <TableRow key={`loading-${index}`}>
          {visibleColumns.map((column) => (
            <TableCell key={column.key}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );

  const LoadingCards = () => (
    <>
      {Array.from({ length: Math.min(pageSize, 5) }).map((_, index) => (
        <Card key={`loading-card-${index}`} className="mb-3">
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </>
  );

  const shouldShowEmptyState = !loading && (!renderData || renderData.length === 0);

  return (
    <div className={cn("w-full", className)}>
      <Card className="shadow-sm py-0">
        <CardContent className="p-0">
          {(searchable || filterable) && (
            <div className="bg-muted/30 p-3 lg:p-4 border-b">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex flex-1 items-center gap-2 flex-wrap">
                  {searchable && onSearch && (
                    <div className="flex-1 min-w-0">
                      <TableSearch
                        value={searchValue}
                        placeholder={searchPlaceholder}
                        onChange={onSearch}
                        className="w-full max-w-none sm:max-w-sm"
                      />
                    </div>
                  )}
                  {filterable && onFilterChange && filterOptions.length > 0 && (
                    <TableFilter
                      value={filterValue || filterOptions[0]?.value || ""}
                      options={filterOptions}
                      onChange={onFilterChange}
                      label={filterLabel}
                      disabled={loading}
                    />
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {onReset && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={loading}
                      onClick={onReset}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="p-0">
            {shouldShowEmptyState ? (
              <EmptyState />
            ) : (
              <>
                {isMobile ? (
                  <div className="p-4 space-y-3">
                    {loading ? (
                      <LoadingCards />
                    ) : (
                      renderData?.map((record, index) => (
                        <MobileCardView
                          key={typeof rowKey === 'function'
                            ? rowKey(record)
                            : (record[rowKey] as string) || index.toString()
                          }
                          record={record}
                          index={index}
                        />
                      ))
                    )}
                  </div>
                ) : (
                  <div className="w-full overflow-auto">
                    <Table className="min-w-[700px]">
                      <TableHeader>
                        <TableRow className={cn(
                          "hover:bg-transparent",
                          bordered && "border-b"
                        )}>
                          {visibleColumns.map((column) => (
                            <TableHead
                              key={column.key}
                              className={cn(
                                "font-semibold text-foreground whitespace-nowrap select-none",
                                column.align === 'center' && "text-center",
                                column.align === 'right' && "text-right",
                                compact && "h-10 py-2",
                                isTablet && "text-sm px-2",
                                column.className,
                                column.sortable && !isDraggable && "cursor-pointer hover:bg-muted/80 transition-colors",
                                isDraggable && column.key !== '__drag__' && column.sortable && "opacity-60 cursor-not-allowed"
                              )}
                              style={{
                                width: column.width,
                                minWidth: isTablet ? 100 : column.width,
                              }}
                              onClick={() => !isDraggable && handleSort(column)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="flex items-center">
                                  {column.title}
                                  {column.sortable && !isDraggable && renderSortIndicator(column)}
                                </span>
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <LoadingRows />
                        ) : (
                          renderData?.map((record, index) => {
                            const key = typeof rowKey === 'function'
                              ? rowKey(record)
                              : (record[rowKey] as string) || index.toString();

                            return (
                              <TableRow
                                key={key}
                                data-index={index}
                                draggable={isDraggable}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onDragEnd={handleDragEnd}
                                className={getRowClassName(record, index)}
                              >
                                {visibleColumns.map((column) => {
                                  const value = getCellValue(record, column);
                                  return (
                                    <TableCell
                                      key={column.key}
                                      className={cn(
                                        "whitespace-nowrap",
                                        column.align === 'center' && "text-center",
                                        column.align === 'right' && "text-right",
                                        compact && "py-2",
                                        isTablet && "text-sm px-2",
                                        column.className
                                      )}
                                    >
                                      <div className="max-w-[220px] lg:max-w-none flex items-center gap-2">
                                        {column.render
                                          ? column.render(value, record, index)
                                          : (
                                            <span className="truncate block" title={value?.toString()}>
                                              {value?.toString() || '-'}
                                            </span>
                                          )
                                        }
                                      </div>
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}

            {pagination && !shouldShowEmptyState && (
              <TablePagination
                current={currentPage}
                pageSize={pageSize}
                total={total || 0}
                onChange={onPaginationChange ?? (() => { })}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataTable;
