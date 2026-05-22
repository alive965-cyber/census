'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  generateWardSummaryReport,
  reportToPlainText,
  reportToExcelRows,
  type ReportContent,
  type HouseData,
  type SurveyData,
  type WardData,
} from '@/features/validation/report-generator';
import { findDuplicates, type DuplicateCandidate, type DuplicateMatch } from '@/features/validation/duplicate-detector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Download,
  RefreshCw,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Home,
  Copy,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function ReportsPage() {
  const [report, setReport] = useState<ReportContent | null>(null);
  const [duplicates, setDuplicates] = useState<DuplicateMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  const generateReport = async () => {
    setLoading(true);
    try {
      const [housesRes, surveysRes, wardsRes] = await Promise.all([
        supabase.from('houses').select('*'),
        supabase.from('surveys').select('*'),
        supabase.from('wards').select('*'),
      ]);

      const houses = (housesRes.data || []) as HouseData[];
      const surveys = (surveysRes.data || []) as SurveyData[];
      const wards = (wardsRes.data || []) as WardData[];

      // Generate report
      const reportData = generateWardSummaryReport(houses, surveys, wards);
      setReport(reportData);

      // Check for duplicates
      const candidates: DuplicateCandidate[] = houses.map((h) => ({
        id: h.id,
        house_number: h.house_number,
        address: h.address,
        head_of_family: h.head_of_family,
      }));
      const dupes = findDuplicates(candidates);
      setDuplicates(dupes);
    } catch (err) {
      console.error('Report generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateReport();
  }, []);

  const handleCopyReport = () => {
    if (!report) return;
    navigator.clipboard.writeText(reportToPlainText(report));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadExcel = () => {
    if (!report) return;
    // Dynamic import xlsx for client-side only
    import('xlsx').then((XLSX) => {
      const rows = reportToExcelRows(report);
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Ward Summary');
      XLSX.writeFile(wb, `census-report-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    });
  };

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generate census summaries and detect duplicate entries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generateReport}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Regenerate
          </Button>
          {report && (
            <>
              <Button variant="outline" size="sm" onClick={handleCopyReport} className="gap-2">
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button size="sm" onClick={handleDownloadExcel} className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Download size={14} />
                Excel
              </Button>
            </>
          )}
        </div>
      </div>

      {loading && !report ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw size={24} className="animate-spin text-accent" />
            <p className="text-sm text-muted-foreground">Generating report...</p>
          </div>
        </div>
      ) : report ? (
        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList className="bg-muted/50 backdrop-blur-sm">
            <TabsTrigger value="summary" className="gap-1.5">
              <BarChart3 size={14} />
              Summary
            </TabsTrigger>
            <TabsTrigger value="wards" className="gap-1.5">
              <Home size={14} />
              Ward Breakdown
            </TabsTrigger>
            <TabsTrigger value="duplicates" className="gap-1.5">
              <AlertTriangle size={14} />
              Duplicates
              {duplicates.length > 0 && (
                <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                  {duplicates.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ─── Summary Tab ─── */}
          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryCard
                icon={Home}
                label="Total Houses"
                value={report.summary.totalHouses}
                color="text-accent"
              />
              <SummaryCard
                icon={CheckCircle2}
                label="Surveyed"
                value={report.summary.totalSurveyed}
                subtitle={`${report.summary.completionPercentage}% complete`}
                color="text-green-500"
              />
              <SummaryCard
                icon={Users}
                label="Total Population"
                value={report.summary.totalPopulation}
                subtitle={`Avg family: ${report.summary.averageFamilySize}`}
                color="text-blue-500"
              />
              <SummaryCard
                icon={Clock}
                label="Pending"
                value={report.summary.totalPending + report.summary.totalInProgress}
                subtitle={`${report.summary.totalPending} pending, ${report.summary.totalInProgress} in progress`}
                color="text-yellow-500"
              />
            </div>

            {/* Status distribution bar */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completion Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 rounded-full bg-muted/50 overflow-hidden flex">
                    {report.summary.totalHouses > 0 && (
                      <>
                        <div
                          className="h-full bg-green-500 transition-all duration-500"
                          style={{ width: `${(report.summary.totalSurveyed / report.summary.totalHouses) * 100}%` }}
                        />
                        <div
                          className="h-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${(report.summary.totalInProgress / report.summary.totalHouses) * 100}%` }}
                        />
                        <div
                          className="h-full bg-yellow-500 transition-all duration-500"
                          style={{ width: `${(report.summary.totalPending / report.summary.totalHouses) * 100}%` }}
                        />
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Completed
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> In Progress
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> Pending
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plain text report preview */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileText size={14} />
                  Report Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs font-mono text-foreground/80 bg-muted/30 rounded-lg p-4 overflow-x-auto whitespace-pre max-h-[300px] overflow-y-auto">
                  {reportToPlainText(report)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Ward Breakdown Tab ─── */}
          <TabsContent value="wards" className="space-y-4">
            {report.wardBreakdown.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Home size={32} className="text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No ward data available</p>
              </div>
            ) : (
              <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/30 bg-muted/30">
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ward</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Houses</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Surveyed</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Population</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Completion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.wardBreakdown.map((ward) => (
                        <tr key={ward.wardId} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-medium text-foreground">
                            <span className="text-xs text-muted-foreground mr-1">#{ward.wardNumber}</span>
                            {ward.wardName}
                          </td>
                          <td className="px-4 py-3 text-right">{ward.totalHouses}</td>
                          <td className="px-4 py-3 text-right text-green-500">{ward.surveyed}</td>
                          <td className="px-4 py-3 text-right text-yellow-500">{ward.pending}</td>
                          <td className="px-4 py-3 text-right">{ward.totalPopulation}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-1.5 rounded-full bg-muted/50 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-accent transition-all"
                                  style={{ width: `${ward.completionRate}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium">{ward.completionRate}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>

          {/* ─── Duplicates Tab ─── */}
          <TabsContent value="duplicates" className="space-y-4">
            {duplicates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-4 rounded-full bg-green-500/10 mb-4">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <h3 className="text-lg font-medium text-foreground">No Duplicates Detected</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  All entries appear to be unique based on fuzzy matching analysis.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  <AlertTriangle size={14} className="inline mr-1 text-yellow-500" />
                  {duplicates.length} potential duplicate{duplicates.length !== 1 && 's'} found
                </p>

                {duplicates.map((dup, i) => (
                  <Card key={i} className="border-yellow-500/20 bg-yellow-500/5 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                          {Math.round(dup.score * 100)}% match
                        </span>
                        <div className="flex gap-1">
                          {dup.matchedOn.map((field) => (
                            <span
                              key={field}
                              className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20"
                            >
                              {field.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <DuplicateEntry
                          label="Entry A"
                          house={dup.source}
                        />
                        <DuplicateEntry
                          label="Entry B"
                          house={dup.match}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : null}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────

function SummaryCard({
  icon: Icon,
  label,
  value,
  subtitle,
  color,
}: {
  icon: typeof Home;
  label: string;
  value: number;
  subtitle?: string;
  color: string;
}) {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:border-accent/20 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
          <div className={cn('p-1.5 rounded-lg bg-muted/50', color)}>
            <Icon size={16} />
          </div>
        </div>
        <p className="text-2xl font-bold text-foreground">{value.toLocaleString()}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

function DuplicateEntry({
  label,
  house,
}: {
  label: string;
  house: { id: string; house_number: string; address: string; head_of_family: string };
}) {
  return (
    <div className="rounded-lg bg-background/50 p-3 space-y-1">
      <span className="text-[10px] font-bold text-muted-foreground uppercase">{label}</span>
      <p className="text-sm font-semibold text-foreground">House #{house.house_number}</p>
      <p className="text-xs text-muted-foreground">{house.address}</p>
      <p className="text-xs text-muted-foreground">HOF: {house.head_of_family}</p>
    </div>
  );
}
