import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Columns,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
  width?: string;
  hidden?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  keyExtractor: (item: T) => string;
  expandedRow?: (item: T) => React.ReactNode;
  expandedRows?: Set<string>;
  onToggleRow?: (id: string) => void;
  onRowClick?: (item: T) => void;
  rowClassName?: (item: T) => string;
  defaultSort?: { key: string; direction: 'asc' | 'desc' };
  pageSize?: number;
  stickyHeader?: boolean;
  showColumnToggle?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  keyExtractor,
  expandedRow,
  expandedRows,
  onToggleRow,
  onRowClick,
  rowClassName,
  defaultSort,
  pageSize = 25,
  stickyHeader = true,
  showColumnToggle = true,
  emptyMessage = 'No hay datos para mostrar',
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(defaultSort || null);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.filter(c => !c.hidden).map(c => c.key))
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      const comparison = aVal < bVal ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        if (current.direction === 'asc') return { key, direction: 'desc' };
        if (current.direction === 'desc') return null;
      }
      return { key, direction: 'asc' };
    });
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns(current => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key) return <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />;
    if (sortConfig.direction === 'asc') return <ChevronUp className="h-3.5 w-3.5 text-primary" />;
    return <ChevronDown className="h-3.5 w-3.5 text-primary" />;
  };

  const visibleColumnList = columns.filter(c => visibleColumns.has(c.key));

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Column toggle */}
      {showColumnToggle && (
        <div className="flex items-center justify-end border-b border-border px-4 py-2 bg-muted/30">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                <Columns className="mr-1.5 h-3.5 w-3.5" />
                Columnas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {columns.map(column => (
                <DropdownMenuCheckboxItem
                  key={column.key}
                  checked={visibleColumns.has(column.key)}
                  onCheckedChange={() => toggleColumn(column.key)}
                >
                  {column.header}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={cn(
            stickyHeader && "sticky top-0 z-10",
            "bg-muted/50 backdrop-blur-sm"
          )}>
            <tr className="border-b border-border">
              {expandedRow && <th className="w-8 py-2.5 px-3"></th>}
              {visibleColumnList.map(column => (
                <th
                  key={column.key}
                  className={cn(
                    "py-2.5 px-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                    column.sortable && "cursor-pointer select-none hover:text-foreground transition-colors",
                    column.className
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-border/50">
                  {expandedRow && <td className="py-2.5 px-3"><Skeleton className="h-4 w-4" /></td>}
                  {visibleColumnList.map(column => (
                    <td key={column.key} className="py-2.5 px-3">
                      <Skeleton className="h-4 w-full max-w-[120px]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={(expandedRow ? 1 : 0) + visibleColumnList.length} 
                  className="py-12 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map(item => {
                const key = keyExtractor(item);
                const isExpanded = expandedRows?.has(key);
                
                return (
                  <React.Fragment key={key}>
                    <tr
                      className={cn(
                        "border-b border-border/50 transition-colors",
                        "hover:bg-accent/30",
                        isExpanded && "bg-accent/20",
                        onRowClick && "cursor-pointer",
                        rowClassName?.(item)
                      )}
                      onClick={() => onRowClick?.(item)}
                    >
                      {expandedRow && (
                        <td className="py-2.5 px-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleRow?.(key);
                            }}
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-primary" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </td>
                      )}
                      {visibleColumnList.map(column => (
                        <td 
                          key={column.key} 
                          className={cn("py-2.5 px-3 text-sm", column.className)}
                        >
                          {column.render 
                            ? column.render(item) 
                            : String(item[column.key] ?? '-')}
                        </td>
                      ))}
                    </tr>
                    {expandedRow && isExpanded && (
                      <tr className="bg-muted/10">
                        <td colSpan={(expandedRow ? 1 : 0) + visibleColumnList.length} className="p-0">
                          <div className="animate-accordion-down overflow-hidden">
                            {expandedRow(item)}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20">
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, sortedData.length)} de {sortedData.length}
          </p>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(v) => {
              setItemsPerPage(Number(v));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            <ChevronLeft className="h-4 w-4" />
            <ChevronLeft className="h-4 w-4 -ml-2" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-1 px-2">
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "ghost"}
                  size="icon"
                  className={cn(
                    "h-8 w-8",
                    currentPage === pageNum && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            <ChevronRight className="h-4 w-4" />
            <ChevronRight className="h-4 w-4 -ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
