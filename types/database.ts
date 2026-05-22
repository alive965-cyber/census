export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          role: 'admin' | 'supervisor' | 'enumerator'
          name: string
          email: string
          phone: string | null
          assigned_ward_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          role?: 'admin' | 'supervisor' | 'enumerator'
          name: string
          email: string
          phone?: string | null
          assigned_ward_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'admin' | 'supervisor' | 'enumerator'
          name?: string
          email?: string
          phone?: string | null
          assigned_ward_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_ward"
            columns: ["assigned_ward_id"]
            isOneToOne: false
            referencedRelation: "wards"
            referencedColumns: ["id"]
          }
        ]
      }
      wards: {
        Row: {
          id: string
          ward_number: string
          name: string
          boundary: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ward_number: string
          name: string
          boundary?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ward_number?: string
          name?: string
          boundary?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      houses: {
        Row: {
          id: string
          ward_id: string
          house_number: string
          address: string
          location: Json | null
          head_of_family: string
          contact_number: string | null
          status: 'pending' | 'in_progress' | 'completed'
          enumerator_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ward_id: string
          house_number: string
          address: string
          location?: Json | null
          head_of_family: string
          contact_number?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          enumerator_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ward_id?: string
          house_number?: string
          address?: string
          location?: Json | null
          head_of_family?: string
          contact_number?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          enumerator_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "houses_ward_id_fkey"
            columns: ["ward_id"]
            isOneToOne: false
            referencedRelation: "wards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "houses_enumerator_id_fkey"
            columns: ["enumerator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      surveys: {
        Row: {
          id: string
          house_id: string
          enumerator_id: string
          respondent_name: string
          family_members_count: number
          income_bracket: string | null
          facilities: Json | null
          status: 'draft' | 'submitted' | 'verified'
          submitted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          house_id: string
          enumerator_id: string
          respondent_name: string
          family_members_count: number
          income_bracket?: string | null
          facilities?: Json | null
          status?: 'draft' | 'submitted' | 'verified'
          submitted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          house_id?: string
          enumerator_id?: string
          respondent_name?: string
          family_members_count?: number
          income_bracket?: string | null
          facilities?: Json | null
          status?: 'draft' | 'submitted' | 'verified'
          submitted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "surveys_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: true
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "surveys_enumerator_id_fkey"
            columns: ["enumerator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      reports: {
        Row: {
          id: string
          title: string
          type: string
          data: Json
          generated_by: string | null
          generated_at: string
        }
        Insert: {
          id?: string
          title: string
          type: string
          data?: Json
          generated_by?: string | null
          generated_at?: string
        }
        Update: {
          id?: string
          title?: string
          type?: string
          data?: Json
          generated_by?: string | null
          generated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string
          old_data: Json | null
          new_data: Json | null
          timestamp: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id: string
          old_data?: Json | null
          new_data?: Json | null
          timestamp?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string
          old_data?: Json | null
          new_data?: Json | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'supervisor' | 'enumerator'
      house_status: 'pending' | 'in_progress' | 'completed'
      survey_status: 'draft' | 'submitted' | 'verified'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
