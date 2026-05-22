import { Database } from './database'

export type Survey = Database['public']['Tables']['surveys']['Row']
export type SurveyInsert = Database['public']['Tables']['surveys']['Insert']
export type SurveyUpdate = Database['public']['Tables']['surveys']['Update']

export type Facilities = {
  water_source?: string
  electricity?: boolean
  sanitation?: string
  internet?: boolean
  [key: string]: any
}

// Extended type for frontend use
export type SurveyWithDetails = Survey & {
  facilities_parsed?: Facilities | null
  house?: Database['public']['Tables']['houses']['Row']
  enumerator?: Database['public']['Tables']['users']['Row']
}
