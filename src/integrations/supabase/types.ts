export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      cart_items: {
        Row: {
          created_at: string | null
          gig_id: string
          id: string
          package_index: number | null
          quantity: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          gig_id: string
          id?: string
          package_index?: number | null
          quantity?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          gig_id?: string
          id?: string
          package_index?: number | null
          quantity?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      escrow_transactions: {
        Row: {
          amount_sol: number
          approved_by: string | null
          created_at: string | null
          id: string
          order_id: string
          transaction_signature: string | null
          transaction_type: string
        }
        Insert: {
          amount_sol: number
          approved_by?: string | null
          created_at?: string | null
          id?: string
          order_id: string
          transaction_signature?: string | null
          transaction_type: string
        }
        Update: {
          amount_sol?: number
          approved_by?: string | null
          created_at?: string | null
          id?: string
          order_id?: string
          transaction_signature?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "escrow_transactions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escrow_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          gig_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          gig_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          gig_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gig_analytics: {
        Row: {
          created_at: string
          event_type: string
          gig_id: string
          id: string
          seller_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          gig_id: string
          id?: string
          seller_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          gig_id?: string
          id?: string
          seller_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gig_analytics_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gig_analytics_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gig_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gigs: {
        Row: {
          category: string
          created_at: string
          delivery_days: number
          description: string
          has_packages: boolean | null
          id: string
          images: string[] | null
          is_pro_only: boolean | null
          order_count: number | null
          packages: Json | null
          price_sol: number
          seller_id: string
          status: Database["public"]["Enums"]["gig_status"]
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          category: string
          created_at?: string
          delivery_days: number
          description: string
          has_packages?: boolean | null
          id?: string
          images?: string[] | null
          is_pro_only?: boolean | null
          order_count?: number | null
          packages?: Json | null
          price_sol: number
          seller_id: string
          status?: Database["public"]["Enums"]["gig_status"]
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          delivery_days?: number
          description?: string
          has_packages?: boolean | null
          id?: string
          images?: string[] | null
          is_pro_only?: boolean | null
          order_count?: number | null
          packages?: Json | null
          price_sol?: number
          seller_id?: string
          status?: Database["public"]["Enums"]["gig_status"]
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gigs_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: string[] | null
          content: string
          created_at: string
          edited_at: string | null
          id: string
          order_id: string | null
          read_at: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          attachments?: string[] | null
          content: string
          created_at?: string
          edited_at?: string | null
          id?: string
          order_id?: string | null
          read_at?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          attachments?: string[] | null
          content?: string
          created_at?: string
          edited_at?: string | null
          id?: string
          order_id?: string | null
          read_at?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          admin_notes: string | null
          amount_sol: number
          buyer_id: string
          completed_at: string | null
          created_at: string
          deadline_notified: boolean | null
          delivered_at: string | null
          dispute_resolved_at: string | null
          disputed_at: string | null
          escrow_account: string | null
          escrow_released: boolean | null
          expected_delivery_date: string | null
          gig_id: string
          id: string
          payment_confirmed_at: string | null
          platform_fee_sol: number | null
          proof_description: string | null
          proof_files: string[] | null
          refund_amount_sol: number | null
          revision_notes: string | null
          revision_requested: boolean | null
          seller_id: string
          status: Database["public"]["Enums"]["order_status"]
          transaction_signature: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          amount_sol: number
          buyer_id: string
          completed_at?: string | null
          created_at?: string
          deadline_notified?: boolean | null
          delivered_at?: string | null
          dispute_resolved_at?: string | null
          disputed_at?: string | null
          escrow_account?: string | null
          escrow_released?: boolean | null
          expected_delivery_date?: string | null
          gig_id: string
          id?: string
          payment_confirmed_at?: string | null
          platform_fee_sol?: number | null
          proof_description?: string | null
          proof_files?: string[] | null
          refund_amount_sol?: number | null
          revision_notes?: string | null
          revision_requested?: boolean | null
          seller_id: string
          status?: Database["public"]["Enums"]["order_status"]
          transaction_signature?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          amount_sol?: number
          buyer_id?: string
          completed_at?: string | null
          created_at?: string
          deadline_notified?: boolean | null
          delivered_at?: string | null
          dispute_resolved_at?: string | null
          disputed_at?: string | null
          escrow_account?: string | null
          escrow_released?: boolean | null
          expected_delivery_date?: string | null
          gig_id?: string
          id?: string
          payment_confirmed_at?: string | null
          platform_fee_sol?: number | null
          proof_description?: string | null
          proof_files?: string[] | null
          refund_amount_sol?: number | null
          revision_notes?: string | null
          revision_requested?: boolean | null
          seller_id?: string
          status?: Database["public"]["Enums"]["order_status"]
          transaction_signature?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_badges: {
        Row: {
          badge_type: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_type: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_type?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          created_at: string
          id: string
          languages: string[] | null
          location: string | null
          name: string
          social_links: Json | null
          tagline: string | null
          updated_at: string
          username: string
          wallet_address: string | null
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          id: string
          languages?: string[] | null
          location?: string | null
          name: string
          social_links?: Json | null
          tagline?: string | null
          updated_at?: string
          username: string
          wallet_address?: string | null
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          languages?: string[] | null
          location?: string | null
          name?: string
          social_links?: Json | null
          tagline?: string | null
          updated_at?: string
          username?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          order_id: string
          proof_urls: string[] | null
          rating: number
          reviewee_id: string
          reviewer_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          order_id: string
          proof_urls?: string[] | null
          rating: number
          reviewee_id: string
          reviewer_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          order_id?: string
          proof_urls?: string[] | null
          rating?: number
          reviewee_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_profiles: {
        Row: {
          application_notes: string | null
          certifications: Json | null
          completion_rate: number | null
          created_at: string
          education: Json | null
          id: string
          languages_proficiency: Json | null
          portfolio_items: Json | null
          portfolio_links: string[]
          pro_member: boolean | null
          pro_since: string | null
          response_time_hours: number | null
          skills: string[]
          updated_at: string
          user_id: string
          verification_date: string | null
          verified: boolean
        }
        Insert: {
          application_notes?: string | null
          certifications?: Json | null
          completion_rate?: number | null
          created_at?: string
          education?: Json | null
          id?: string
          languages_proficiency?: Json | null
          portfolio_items?: Json | null
          portfolio_links?: string[]
          pro_member?: boolean | null
          pro_since?: string | null
          response_time_hours?: number | null
          skills?: string[]
          updated_at?: string
          user_id: string
          verification_date?: string | null
          verified?: boolean
        }
        Update: {
          application_notes?: string | null
          certifications?: Json | null
          completion_rate?: number | null
          created_at?: string
          education?: Json | null
          id?: string
          languages_proficiency?: Json | null
          portfolio_items?: Json | null
          portfolio_links?: string[]
          pro_member?: boolean | null
          pro_since?: string | null
          response_time_hours?: number | null
          skills?: string[]
          updated_at?: string
          user_id?: string
          verification_date?: string | null
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "fk_seller_profiles_user_id"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_payments: {
        Row: {
          amount_sol: number
          id: string
          payment_date: string
          period_end: string
          period_start: string
          subscription_id: string
          transaction_signature: string
        }
        Insert: {
          amount_sol: number
          id?: string
          payment_date?: string
          period_end: string
          period_start: string
          subscription_id: string
          transaction_signature: string
        }
        Update: {
          amount_sol?: number
          id?: string
          payment_date?: string
          period_end?: string
          period_start?: string
          subscription_id?: string
          transaction_signature?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount_sol: number
          created_at: string
          end_date: string | null
          id: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          start_date: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          transaction_signature: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_sol: number
          created_at?: string
          end_date?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          transaction_signature?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_sol?: number
          created_at?: string
          end_date?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          transaction_signature?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_statistics: {
        Args: never
        Returns: {
          average_rating: number
          gigs_available: number
          projects_completed: number
          talented_creators: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "buyer" | "seller" | "admin"
      gig_status: "draft" | "active" | "paused" | "deleted"
      order_status:
        | "pending"
        | "in_progress"
        | "delivered"
        | "completed"
        | "cancelled"
        | "disputed"
        | "awaiting_proof"
        | "proof_submitted"
        | "approved_for_release"
      subscription_plan: "free" | "pro"
      subscription_status: "active" | "cancelled" | "expired" | "pending"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["buyer", "seller", "admin"],
      gig_status: ["draft", "active", "paused", "deleted"],
      order_status: [
        "pending",
        "in_progress",
        "delivered",
        "completed",
        "cancelled",
        "disputed",
        "awaiting_proof",
        "proof_submitted",
        "approved_for_release",
      ],
      subscription_plan: ["free", "pro"],
      subscription_status: ["active", "cancelled", "expired", "pending"],
    },
  },
} as const
