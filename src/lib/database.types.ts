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
      trademark_applications: {
        Row: {
          id: string
          created_at: string
          applicant_name: string
          trademark: string
          filing_basis: string
          mark_name: string
          mark_type: string
          owner_name: string
          owner_type: string
          owner_address: string
          goods_services: Json
          usage_evidence: Json
          status: 'draft' | 'submitted' | 'approved' | 'rejected'
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          applicant_name: string
          trademark: string
          filing_basis: string
          mark_name: string
          mark_type: string
          owner_name: string
          owner_type: string
          owner_address: string
          goods_services: Json
          usage_evidence: Json
          status?: 'draft' | 'submitted' | 'approved' | 'rejected'
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          applicant_name?: string
          trademark?: string
          filing_basis?: string
          mark_name?: string
          mark_type?: string
          owner_name?: string
          owner_type?: string
          owner_address?: string
          goods_services?: Json
          usage_evidence?: Json
          status?: 'draft' | 'submitted' | 'approved' | 'rejected'
          user_id?: string
        }
      }
      patent_applications: {
        Row: {
          id: string
          created_at: string
          title: string
          inventors: string[]
          description: string
          claims: string[]
          prior_art: string[]
          status: 'draft' | 'submitted' | 'approved' | 'rejected'
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          inventors: string[]
          description: string
          claims: string[]
          prior_art: string[]
          status?: 'draft' | 'submitted' | 'approved' | 'rejected'
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          inventors?: string[]
          description?: string
          claims?: string[]
          prior_art?: string[]
          status?: 'draft' | 'submitted' | 'approved' | 'rejected'
          user_id?: string
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