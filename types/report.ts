import { Database } from './database'

export type Report = Database['public']['Tables']['reports']['Row']
export type ReportInsert = Database['public']['Tables']['reports']['Insert']
export type ReportUpdate = Database['public']['Tables']['reports']['Update']

export type ReportType = 'ward_summary' | 'enumerator_performance' | 'demographics' | 'facilities_overview' | string

// Extended type for frontend use
export type ReportWithDetails = Report & {
  generated_by_user?: Database['public']['Tables']['users']['Row'] | null
}
