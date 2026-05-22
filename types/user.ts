import { Database } from './database'

export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type UserRole = Database['public']['Enums']['user_role']

// Extended type for frontend use
export type UserWithWard = User & {
  ward?: Database['public']['Tables']['wards']['Row'] | null
}
