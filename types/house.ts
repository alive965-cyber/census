import { Database } from './database'

export type House = Database['public']['Tables']['houses']['Row']
export type HouseInsert = Database['public']['Tables']['houses']['Insert']
export type HouseUpdate = Database['public']['Tables']['houses']['Update']

export type Location = {
  lat: number
  lng: number
}

// Extended type for frontend use
export type HouseWithDetails = House & {
  location_parsed?: Location | null
  ward?: Database['public']['Tables']['wards']['Row']
  enumerator?: Database['public']['Tables']['users']['Row']
}
