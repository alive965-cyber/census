'use client';

import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FilterValues {
  status: string;
  ward: string;
  dateFrom: string;
  dateTo: string;
}

const defaultFilters: FilterValues = {
  status: '',
  ward: '',
  dateFrom: '',
  dateTo: '',
};

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

interface FilterPanelProps {
  onFilterChange: (filters: FilterValues) => void;
  wards?: { id: string; name: string }[];
  className?: string;
}

export function FilterPanel({ onFilterChange, wards = [], className }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterValues>(defaultFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const updateFilter = (key: keyof FilterValues, value: string) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilterChange(next);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className={cn('rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm', className)}>
      {/* Toggle header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors rounded-lg"
        id="filter-toggle"
      >
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-accent" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </div>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Filter body */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-4 pb-4 pt-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Status filter */}
          <div className="space-y-1.5">
            <label htmlFor="filter-status" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Status
            </label>
            <select
              id="filter-status"
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-colors"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Ward filter */}
          <div className="space-y-1.5">
            <label htmlFor="filter-ward" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Ward
            </label>
            <select
              id="filter-ward"
              value={filters.ward}
              onChange={(e) => updateFilter('ward', e.target.value)}
              className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-colors"
            >
              <option value="">All Wards</option>
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div className="space-y-1.5">
            <label htmlFor="filter-date-from" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              From Date
            </label>
            <input
              id="filter-date-from"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => updateFilter('dateFrom', e.target.value)}
              className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-colors"
            />
          </div>

          {/* Date To */}
          <div className="space-y-1.5">
            <label htmlFor="filter-date-to" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              To Date
            </label>
            <input
              id="filter-date-to"
              type="date"
              value={filters.dateTo}
              onChange={(e) => updateFilter('dateTo', e.target.value)}
              className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-colors"
            />
          </div>
        </div>

        {/* Reset */}
        {activeFilterCount > 0 && (
          <div className="px-4 pb-3">
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs text-muted-foreground hover:text-foreground">
              <RotateCcw size={12} className="mr-1" />
              Reset all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
