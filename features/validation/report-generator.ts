/**
 * Report Generator — Programmatic, rule-based census report builder.
 * No external AI APIs needed — purely aggregates data from Supabase.
 */

import { format } from 'date-fns';

// ─── Types ────────────────────────────────────────────────────
export interface HouseData {
  id: string;
  house_number: string;
  address: string;
  head_of_family: string;
  ward_id: string;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
}

export interface SurveyData {
  id: string;
  house_id: string;
  respondent_name: string;
  family_members_count: number;
  income_bracket: string | null;
  status: 'draft' | 'submitted' | 'verified';
  submitted_at: string | null;
  enumerator_id: string;
}

export interface WardData {
  id: string;
  name: string;
  ward_number: string;
}

export interface ReportContent {
  title: string;
  generatedAt: string;
  summary: ReportSummary;
  wardBreakdown: WardBreakdownItem[];
  statusDistribution: StatusDistribution;
  timeline: TimelineEntry[];
}

export interface ReportSummary {
  totalHouses: number;
  totalSurveyed: number;
  totalPending: number;
  totalInProgress: number;
  completionPercentage: number;
  totalPopulation: number;
  averageFamilySize: number;
}

export interface WardBreakdownItem {
  wardId: string;
  wardName: string;
  wardNumber: string;
  totalHouses: number;
  surveyed: number;
  pending: number;
  inProgress: number;
  completionRate: number;
  totalPopulation: number;
}

export interface StatusDistribution {
  pending: number;
  inProgress: number;
  completed: number;
  draft: number;
  submitted: number;
  verified: number;
}

export interface TimelineEntry {
  date: string;
  surveysCompleted: number;
  cumulativeTotal: number;
}

// ─── Generator ────────────────────────────────────────────────

export function generateWardSummaryReport(
  houses: HouseData[],
  surveys: SurveyData[],
  wards: WardData[]
): ReportContent {
  const now = new Date();

  // Build survey lookup by house_id
  const surveyByHouse = new Map<string, SurveyData>();
  for (const s of surveys) {
    surveyByHouse.set(s.house_id, s);
  }

  // ─── Summary ───
  const totalHouses = houses.length;
  const totalSurveyed = houses.filter((h) => h.status === 'completed').length;
  const totalPending = houses.filter((h) => h.status === 'pending').length;
  const totalInProgress = houses.filter((h) => h.status === 'in_progress').length;
  const completionPercentage = totalHouses > 0 ? Math.round((totalSurveyed / totalHouses) * 100) : 0;
  const totalPopulation = surveys.reduce((sum, s) => sum + (s.family_members_count || 0), 0);
  const averageFamilySize =
    surveys.length > 0 ? Math.round((totalPopulation / surveys.length) * 10) / 10 : 0;

  const summary: ReportSummary = {
    totalHouses,
    totalSurveyed,
    totalPending,
    totalInProgress,
    completionPercentage,
    totalPopulation,
    averageFamilySize,
  };

  // ─── Ward Breakdown ───
  const wardBreakdown: WardBreakdownItem[] = wards.map((ward) => {
    const wardHouses = houses.filter((h) => h.ward_id === ward.id);
    const wardSurveys = wardHouses
      .map((h) => surveyByHouse.get(h.id))
      .filter(Boolean) as SurveyData[];

    const surveyed = wardHouses.filter((h) => h.status === 'completed').length;
    const pending = wardHouses.filter((h) => h.status === 'pending').length;
    const inProgress = wardHouses.filter((h) => h.status === 'in_progress').length;

    return {
      wardId: ward.id,
      wardName: ward.name,
      wardNumber: ward.ward_number,
      totalHouses: wardHouses.length,
      surveyed,
      pending,
      inProgress,
      completionRate: wardHouses.length > 0 ? Math.round((surveyed / wardHouses.length) * 100) : 0,
      totalPopulation: wardSurveys.reduce((sum, s) => sum + (s.family_members_count || 0), 0),
    };
  });

  // ─── Status Distribution ───
  const statusDistribution: StatusDistribution = {
    pending: totalPending,
    inProgress: totalInProgress,
    completed: totalSurveyed,
    draft: surveys.filter((s) => s.status === 'draft').length,
    submitted: surveys.filter((s) => s.status === 'submitted').length,
    verified: surveys.filter((s) => s.status === 'verified').length,
  };

  // ─── Timeline (daily progress over last 30 days) ───
  const timeline: TimelineEntry[] = [];
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Sort surveys by submission date
  const sortedSurveys = surveys
    .filter((s) => s.submitted_at)
    .sort((a, b) => new Date(a.submitted_at!).getTime() - new Date(b.submitted_at!).getTime());

  let cumulative = 0;
  for (let d = new Date(thirtyDaysAgo); d <= now; d.setDate(d.getDate() + 1)) {
    const dateStr = format(d, 'yyyy-MM-dd');
    const dayCount = sortedSurveys.filter(
      (s) => s.submitted_at && format(new Date(s.submitted_at), 'yyyy-MM-dd') === dateStr
    ).length;
    cumulative += dayCount;
    timeline.push({
      date: dateStr,
      surveysCompleted: dayCount,
      cumulativeTotal: cumulative,
    });
  }

  return {
    title: `Census Survey Report — ${format(now, 'dd MMM yyyy')}`,
    generatedAt: now.toISOString(),
    summary,
    wardBreakdown,
    statusDistribution,
    timeline,
  };
}

/**
 * Generate a plain-text version of the report for quick display or export.
 */
export function reportToPlainText(report: ReportContent): string {
  const lines: string[] = [];

  lines.push('═'.repeat(60));
  lines.push(report.title);
  lines.push(`Generated: ${format(new Date(report.generatedAt), 'dd MMM yyyy, hh:mm a')}`);
  lines.push('═'.repeat(60));
  lines.push('');

  // Summary
  lines.push('── SUMMARY ──────────────────────────────────────');
  lines.push(`Total Houses:          ${report.summary.totalHouses}`);
  lines.push(`Surveyed:              ${report.summary.totalSurveyed}`);
  lines.push(`Pending:               ${report.summary.totalPending}`);
  lines.push(`In Progress:           ${report.summary.totalInProgress}`);
  lines.push(`Completion:            ${report.summary.completionPercentage}%`);
  lines.push(`Total Population:      ${report.summary.totalPopulation}`);
  lines.push(`Avg. Family Size:      ${report.summary.averageFamilySize}`);
  lines.push('');

  // Ward Breakdown
  lines.push('── WARD BREAKDOWN ───────────────────────────────');
  for (const ward of report.wardBreakdown) {
    lines.push(
      `  ${ward.wardName} (${ward.wardNumber}): ${ward.surveyed}/${ward.totalHouses} surveyed (${ward.completionRate}%) | Pop: ${ward.totalPopulation}`
    );
  }
  lines.push('');
  lines.push('═'.repeat(60));

  return lines.join('\n');
}

/**
 * Convert report data to a flat array for Excel export.
 */
export function reportToExcelRows(
  report: ReportContent
): Record<string, string | number>[] {
  return report.wardBreakdown.map((ward) => ({
    'Ward Name': ward.wardName,
    'Ward Number': ward.wardNumber,
    'Total Houses': ward.totalHouses,
    'Surveyed': ward.surveyed,
    'Pending': ward.pending,
    'In Progress': ward.inProgress,
    'Completion Rate (%)': ward.completionRate,
    'Total Population': ward.totalPopulation,
  }));
}
