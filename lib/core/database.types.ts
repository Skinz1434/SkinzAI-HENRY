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
      veterans: {
        Row: {
          id: string
          ssn_encrypted: string
          name: string
          dob: string
          gender: string | null
          email: string | null
          phone: string | null
          street: string | null
          city: string | null
          state: string | null
          zip: string | null
          branch: 'Army' | 'Navy' | 'Marines' | 'Air Force' | 'Space Force' | 'Coast Guard'
          service_start_date: string
          service_end_date: string
          discharge_status: 'Honorable' | 'General' | 'Other Than Honorable' | 'Bad Conduct' | 'Dishonorable'
          rank: string | null
          mos: string | null
          combat_service: boolean
          disability_rating: number
          monthly_compensation: number
          healthcare_priority: number | null
          enrolled_va_healthcare: boolean
          risk_score: number
          risk_level: 'Minimal' | 'Low' | 'Moderate' | 'High' | 'Immediate'
          last_risk_assessment: string | null
          cascade_risk_detected: boolean
          created_at: string
          updated_at: string
          last_accessed: string | null
          profile_completeness: number
        }
        Insert: {
          id?: string
          ssn_encrypted: string
          name: string
          dob: string
          gender?: string | null
          email?: string | null
          phone?: string | null
          street?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          branch: 'Army' | 'Navy' | 'Marines' | 'Air Force' | 'Space Force' | 'Coast Guard'
          service_start_date: string
          service_end_date: string
          discharge_status: 'Honorable' | 'General' | 'Other Than Honorable' | 'Bad Conduct' | 'Dishonorable'
          rank?: string | null
          mos?: string | null
          combat_service?: boolean
          disability_rating?: number
          monthly_compensation?: number
          healthcare_priority?: number | null
          enrolled_va_healthcare?: boolean
          risk_score?: number
          risk_level?: 'Minimal' | 'Low' | 'Moderate' | 'High' | 'Immediate'
          last_risk_assessment?: string | null
          cascade_risk_detected?: boolean
          created_at?: string
          updated_at?: string
          last_accessed?: string | null
          profile_completeness?: number
        }
        Update: {
          id?: string
          ssn_encrypted?: string
          name?: string
          dob?: string
          gender?: string | null
          email?: string | null
          phone?: string | null
          street?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          branch?: 'Army' | 'Navy' | 'Marines' | 'Air Force' | 'Space Force' | 'Coast Guard'
          service_start_date?: string
          service_end_date?: string
          discharge_status?: 'Honorable' | 'General' | 'Other Than Honorable' | 'Bad Conduct' | 'Dishonorable'
          rank?: string | null
          mos?: string | null
          combat_service?: boolean
          disability_rating?: number
          monthly_compensation?: number
          healthcare_priority?: number | null
          enrolled_va_healthcare?: boolean
          risk_score?: number
          risk_level?: 'Minimal' | 'Low' | 'Moderate' | 'High' | 'Immediate'
          last_risk_assessment?: string | null
          cascade_risk_detected?: boolean
          created_at?: string
          updated_at?: string
          last_accessed?: string | null
          profile_completeness?: number
        }
      }
      deployments: {
        Row: {
          id: string
          veteran_id: string
          location: string
          start_date: string
          end_date: string
          exposures: string[]
          created_at: string
        }
        Insert: {
          id?: string
          veteran_id: string
          location: string
          start_date: string
          end_date: string
          exposures?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          veteran_id?: string
          location?: string
          start_date?: string
          end_date?: string
          exposures?: string[]
          created_at?: string
        }
      }
      conditions: {
        Row: {
          id: string
          veteran_id: string
          name: string
          icd10_code: string | null
          rating: number
          service_connected: boolean
          effective_date: string | null
          diagnostic_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          veteran_id: string
          name: string
          icd10_code?: string | null
          rating?: number
          service_connected?: boolean
          effective_date?: string | null
          diagnostic_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          veteran_id?: string
          name?: string
          icd10_code?: string | null
          rating?: number
          service_connected?: boolean
          effective_date?: string | null
          diagnostic_code?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      claims: {
        Row: {
          id: string
          veteran_id: string
          claim_number: string
          condition: string
          filed_date: string
          status: 'Initial Review' | 'Evidence Gathering' | 'Review of Evidence' | 'Preparation for Decision' | 'Pending Decision Approval' | 'Preparation for Notification' | 'Complete' | 'Appeal'
          last_update: string | null
          current_phase: number
          expected_completion: string | null
          assigned_rater: string | null
          priority: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          veteran_id: string
          claim_number: string
          condition: string
          filed_date: string
          status: 'Initial Review' | 'Evidence Gathering' | 'Review of Evidence' | 'Preparation for Decision' | 'Pending Decision Approval' | 'Preparation for Notification' | 'Complete' | 'Appeal'
          last_update?: string | null
          current_phase?: number
          expected_completion?: string | null
          assigned_rater?: string | null
          priority?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          veteran_id?: string
          claim_number?: string
          condition?: string
          filed_date?: string
          status?: 'Initial Review' | 'Evidence Gathering' | 'Review of Evidence' | 'Preparation for Decision' | 'Pending Decision Approval' | 'Preparation for Notification' | 'Complete' | 'Appeal'
          last_update?: string | null
          current_phase?: number
          expected_completion?: string | null
          assigned_rater?: string | null
          priority?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      medications: {
        Row: {
          id: string
          veteran_id: string
          name: string
          dosage: string | null
          prescriber: string | null
          start_date: string | null
          end_date: string | null
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          veteran_id: string
          name: string
          dosage?: string | null
          prescriber?: string | null
          start_date?: string | null
          end_date?: string | null
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          veteran_id?: string
          name?: string
          dosage?: string | null
          prescriber?: string | null
          start_date?: string | null
          end_date?: string | null
          active?: boolean
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          veteran_id: string
          date: string
          provider: string | null
          type: string | null
          location: string | null
          notes: string | null
          attended: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          veteran_id: string
          date: string
          provider?: string | null
          type?: string | null
          location?: string | null
          notes?: string | null
          attended?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          veteran_id?: string
          date?: string
          provider?: string | null
          type?: string | null
          location?: string | null
          notes?: string | null
          attended?: boolean | null
          created_at?: string
        }
      }
      risk_assessments: {
        Row: {
          id: string
          veteran_id: string
          assessment_date: string
          mental_health_score: number | null
          financial_score: number | null
          housing_score: number | null
          substance_score: number | null
          social_score: number | null
          physical_health_score: number | null
          overall_risk_score: number
          risk_level: 'Minimal' | 'Low' | 'Moderate' | 'High' | 'Immediate'
          confidence_score: number | null
          cascade_pattern: string | null
          cascade_risk: boolean
          intervention_point: string | null
          days_until_crisis: number | null
          crisis_probability: number | null
          recommendations: Json | null
          interventions_triggered: string[]
          created_at: string
        }
        Insert: {
          id?: string
          veteran_id: string
          assessment_date?: string
          mental_health_score?: number | null
          financial_score?: number | null
          housing_score?: number | null
          substance_score?: number | null
          social_score?: number | null
          physical_health_score?: number | null
          overall_risk_score: number
          risk_level: 'Minimal' | 'Low' | 'Moderate' | 'High' | 'Immediate'
          confidence_score?: number | null
          cascade_pattern?: string | null
          cascade_risk?: boolean
          intervention_point?: string | null
          days_until_crisis?: number | null
          crisis_probability?: number | null
          recommendations?: Json | null
          interventions_triggered?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          veteran_id?: string
          assessment_date?: string
          mental_health_score?: number | null
          financial_score?: number | null
          housing_score?: number | null
          substance_score?: number | null
          social_score?: number | null
          physical_health_score?: number | null
          overall_risk_score?: number
          risk_level?: 'Minimal' | 'Low' | 'Moderate' | 'High' | 'Immediate'
          confidence_score?: number | null
          cascade_pattern?: string | null
          cascade_risk?: boolean
          intervention_point?: string | null
          days_until_crisis?: number | null
          crisis_probability?: number | null
          recommendations?: Json | null
          interventions_triggered?: string[]
          created_at?: string
        }
      }
      interventions: {
        Row: {
          id: string
          veteran_id: string
          risk_assessment_id: string | null
          type: string
          priority: string | null
          status: string
          assigned_to: string | null
          due_date: string | null
          completed_date: string | null
          outcome: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          veteran_id: string
          risk_assessment_id?: string | null
          type: string
          priority?: string | null
          status?: string
          assigned_to?: string | null
          due_date?: string | null
          completed_date?: string | null
          outcome?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          veteran_id?: string
          risk_assessment_id?: string | null
          type?: string
          priority?: string | null
          status?: string
          assigned_to?: string | null
          due_date?: string | null
          completed_date?: string | null
          outcome?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      audit_trail: {
        Row: {
          id: string
          veteran_id: string
          action: string
          user_id: string | null
          details: Json | null
          ip_address: string | null
          user_agent: string | null
          timestamp: string
        }
        Insert: {
          id?: string
          veteran_id: string
          action: string
          user_id?: string | null
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          timestamp?: string
        }
        Update: {
          id?: string
          veteran_id?: string
          action?: string
          user_id?: string | null
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          timestamp?: string
        }
      }
      documents: {
        Row: {
          id: string
          veteran_id: string
          claim_id: string | null
          filename: string
          document_type: string | null
          upload_date: string
          file_size: number | null
          mime_type: string | null
          storage_path: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          veteran_id: string
          claim_id?: string | null
          filename: string
          document_type?: string | null
          upload_date?: string
          file_size?: number | null
          mime_type?: string | null
          storage_path?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          veteran_id?: string
          claim_id?: string | null
          filename?: string
          document_type?: string | null
          upload_date?: string
          file_size?: number | null
          mime_type?: string | null
          storage_path?: string | null
          metadata?: Json | null
        }
      }
      analytics_events: {
        Row: {
          id: string
          veteran_id: string | null
          event_type: string
          event_data: Json | null
          timestamp: string
        }
        Insert: {
          id?: string
          veteran_id?: string | null
          event_type: string
          event_data?: Json | null
          timestamp?: string
        }
        Update: {
          id?: string
          veteran_id?: string | null
          event_type?: string
          event_data?: Json | null
          timestamp?: string
        }
      }
    }
    Views: {
      veteran_overview: {
        Row: {
          id: string
          name: string
          branch: string
          discharge_status: string
          disability_rating: number
          risk_score: number
          risk_level: string
          total_claims: number
          total_conditions: number
          active_medications: number
          last_assessment: string | null
        }
      }
      high_risk_veterans: {
        Row: {
          id: string
          name: string
          risk_score: number
          risk_level: string
          cascade_pattern: string | null
          days_until_crisis: number | null
          recommendations: Json | null
        }
      }
    }
    Functions: {
      encrypt_ssn: {
        Args: {
          ssn: string
        }
        Returns: string
      }
      decrypt_ssn: {
        Args: {
          encrypted_ssn: string
        }
        Returns: string
      }
    }
  }
}