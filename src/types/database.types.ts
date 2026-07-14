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
      students: {
        Row: {
          id: string
          name: string
          roll_no: number
          batch: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          roll_no: number
          batch?: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          roll_no?: number
          batch?: string
          is_active?: boolean
          created_at?: string
        }
      }
      attendance_records: {
        Row: {
          id: string
          student_name: string
          date: string
          session: string
          status: string
          source: string
          is_override: boolean
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          student_name: string
          date: string
          session: string
          status: string
          source?: string
          is_override?: boolean
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          student_name?: string
          date?: string
          session?: string
          status?: string
          source?: string
          is_override?: boolean
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
