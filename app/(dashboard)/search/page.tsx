'use client';

import { useState, useEffect, useCallback } from 'react';
import { SearchBar } from '@/components/shared/search-bar';
import { FilterPanel, FilterValues } from '@/components/shared/filter-panel';
import { ExportButton } from '@/components/shared/export-button';
import { SearchResultSkeleton } from '@/components/shared/loading-skeleton';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import {
  Home,
  User,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  SearchX,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  house_number: string;
  address: string;
  head_of_family: string;
  contact_number: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  ward_id: string;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  pending: { label: 'Pending', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', icon: Clock },
  in_progress: { label: 'In Progress', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: Loader2 },
  completed: { label: 'Completed', color: 'text-green-500 bg-green-500/10 border-green-500/20', icon: CheckCircle2 },
};

export default function SearchPage() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FilterValues>({
    status: '',
    ward: '',
    dateFrom: '',
    dateTo: '',
  });
  const [wards, setWards] = useState<{ id: string; name: string }[]>([]);

  const supabase = createClient();

  // Fetch wards for filter dropdown
  useEffect(() => {
    async function loadWards() {
      const { data } = await supabase.from('wards').select('id, name').order('name');
      if (data) setWards(data);
    }
    loadWards();
  }, []);

  const performSearch = useCallback(
    async (searchQuery: string, searchFilters: FilterValues) => {
      setLoading(true);
      setSearched(true);
      try {
        let q = supabase.from('houses').select('*');

        // Text search
        if (searchQuery.trim()) {
          q = q.or(
            `house_number.ilike.%${searchQuery}%,head_of_family.ilike.%${searchQuery}%,address.ilike.%${searchQuery}%`
          );
        }

        // Filters
        if (searchFilters.status) {
          q = q.eq('status', searchFilters.status);
        }
        if (searchFilters.ward) {
          q = q.eq('ward_id', searchFilters.ward);
        }
        if (searchFilters.dateFrom) {
          q = q.gte('created_at', searchFilters.dateFrom);
        }
        if (searchFilters.dateTo) {
          q = q.lte('created_at', searchFilters.dateTo + 'T23:59:59');
        }

        q = q.order('created_at', { ascending: false }).limit(50);

        const { data, error } = await q;
        if (error) throw error;
        setResults((data as SearchResult[]) || []);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  const handleSearch = (q: string) => {
    setQuery(q);
    performSearch(q, filters);
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    performSearch(query, newFilters);
  };

  const handleExportPDF = () => {
    // Build query params for the export API
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.status) params.set('status', filters.status);
    if (filters.ward) params.set('ward', filters.ward);
    window.open(`/api/export/pdf?${params.toString()}`, '_blank');
  };

  const handleExportExcel = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.status) params.set('status', filters.status);
    if (filters.ward) params.set('ward', filters.ward);
    window.open(`/api/export/excel?${params.toString()}`, '_blank');
  };

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Search & Filter</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Find houses, families, and survey records
          </p>
        </div>
        {results.length > 0 && (
          <ExportButton onExportPDF={handleExportPDF} onExportExcel={handleExportExcel} />
        )}
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <SearchBar onSearch={handleSearch} />
        <FilterPanel onFilterChange={handleFilterChange} wards={wards} />
      </div>

      {/* Results */}
      {loading ? (
        <SearchResultSkeleton />
      ) : !searched ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-4 rounded-full bg-muted/50 mb-4">
            <Home size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">Start Searching</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Search by house number, family name, or address. Use filters to narrow down results.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-4 rounded-full bg-muted/50 mb-4">
            <SearchX size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">No Results Found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Try a different search term or adjust your filters.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {results.length} result{results.length !== 1 && 's'} found
          </p>

          <div className="space-y-2">
            {results.map((house) => {
              const statusInfo = statusConfig[house.status] || statusConfig.pending;
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={house.id}
                  className="group rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-4 hover:border-accent/30 hover:shadow-md transition-all duration-200 cursor-pointer"
                  id={`search-result-${house.id}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="p-2.5 rounded-lg bg-accent/10 text-accent shrink-0 mt-0.5">
                      <Home size={18} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                            House #{house.house_number}
                          </h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin size={12} />
                            {house.address}
                          </p>
                        </div>

                        {/* Status badge */}
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border shrink-0',
                            statusInfo.color
                          )}
                        >
                          <StatusIcon size={12} />
                          {statusInfo.label}
                        </span>
                      </div>

                      {/* Details row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          {house.head_of_family}
                        </span>
                        {house.contact_number && (
                          <span className="flex items-center gap-1">
                            <Phone size={12} />
                            {house.contact_number}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {format(new Date(house.created_at), 'dd MMM yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
