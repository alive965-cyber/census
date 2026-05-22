export const APP_NAME = 'Janganana'
export const APP_VERSION = '1.0.0'

export const ROLES = {
  ADMIN: 'admin',
  SUPERVISOR: 'supervisor',
  ENUMERATOR: 'enumerator',
} as const

export const HOUSE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const

export const SURVEY_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  VERIFIED: 'verified',
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  HOUSES: '/dashboard/houses',
  SURVEYS: '/dashboard/surveys',
  REPORTS: '/dashboard/reports',
  USERS: '/dashboard/users',
  WARDS: '/dashboard/wards',
} as const

export const MAP_DEFAULTS = {
  CENTER: { lat: 20.5937, lng: 78.9629 }, // Default to India center
  ZOOM: 5,
  TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
}
