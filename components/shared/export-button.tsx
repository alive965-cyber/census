'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExportButtonProps {
  onExportPDF?: () => void;
  onExportExcel?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function ExportButton({
  onExportPDF,
  onExportExcel,
  isLoading = false,
  className,
}: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        disabled={isLoading}
        className="gap-2 border-border/50 hover:border-accent/50 hover:bg-accent/5 transition-all"
        id="export-button"
      >
        <Download size={16} className={isLoading ? 'animate-bounce' : ''} />
        <span className="hidden sm:inline">Export</span>
        <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />
      </Button>

      {/* Dropdown */}
      <div
        className={cn(
          'absolute right-0 mt-2 w-48 rounded-lg border border-border/50 bg-card shadow-xl backdrop-blur-xl z-50 overflow-hidden transition-all duration-200 origin-top-right',
          open ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        )}
      >
        <button
          onClick={() => {
            onExportPDF?.();
            setOpen(false);
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/80 transition-colors"
          id="export-pdf"
        >
          <FileText size={16} className="text-red-500" />
          <div className="text-left">
            <div className="font-medium">Export as PDF</div>
            <div className="text-xs text-muted-foreground">Print-ready format</div>
          </div>
        </button>
        <div className="border-t border-border/30" />
        <button
          onClick={() => {
            onExportExcel?.();
            setOpen(false);
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/80 transition-colors"
          id="export-excel"
        >
          <FileSpreadsheet size={16} className="text-green-500" />
          <div className="text-left">
            <div className="font-medium">Export as Excel</div>
            <div className="text-xs text-muted-foreground">Spreadsheet format</div>
          </div>
        </button>
      </div>
    </div>
  );
}
