export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      hotel_amenities: {
        Row: {
          amenity: string
          hotel_id: string
        }
        Insert: {
          amenity: string
          hotel_id: string
        }
        Update: {
          amenity?: string
          hotel_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotel_amenities_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_photos: {
        Row: {
          created_at: string
          description: string | null
          hotel_id: string
          id: string
          is_main_photo: boolean | null
          photo_url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          hotel_id: string
          id?: string
          is_main_photo?: boolean | null
          photo_url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          hotel_id?: string
          id?: string
          is_main_photo?: boolean | null
          photo_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotel_photos_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_reviews: {
        Row: {
          comment: string
          country: string | null
          date: string
          hotel_id: string
          id: string
          rating: number
          reviewer_name: string
          reviewer_photo: string | null
          source: string | null
        }
        Insert: {
          comment: string
          country?: string | null
          date?: string
          hotel_id: string
          id?: string
          rating: number
          reviewer_name: string
          reviewer_photo?: string | null
          source?: string | null
        }
        Update: {
          comment?: string
          country?: string | null
          date?: string
          hotel_id?: string
          id?: string
          rating?: number
          reviewer_name?: string
          reviewer_photo?: string | null
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hotel_reviews_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_rooms: {
        Row: {
          amenities: string[] | null
          capacity: number
          created_at: string
          description: string
          hotel_id: string
          id: string
          name: string
          photo_url: string | null
          price: number
          size_sqm: number | null
        }
        Insert: {
          amenities?: string[] | null
          capacity: number
          created_at?: string
          description: string
          hotel_id: string
          id?: string
          name: string
          photo_url?: string | null
          price: number
          size_sqm?: number | null
        }
        Update: {
          amenities?: string[] | null
          capacity?: number
          created_at?: string
          description?: string
          hotel_id?: string
          id?: string
          name?: string
          photo_url?: string | null
          price?: number
          size_sqm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "hotel_rooms_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotels: {
        Row: {
          address: string | null
          booking_platform: string | null
          booking_url: string | null
          created_at: string
          description: string
          email: string | null
          google_map_url: string | null
          id: string
          location: string
          logo_path: string | null
          name: string
          phone: string | null
          price: number
          rating: number
          short_description: string | null
          social_facebook: string | null
          social_instagram: string | null
          social_twitter: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          booking_platform?: string | null
          booking_url?: string | null
          created_at?: string
          description: string
          email?: string | null
          google_map_url?: string | null
          id?: string
          location: string
          logo_path?: string | null
          name: string
          phone?: string | null
          price: number
          rating: number
          short_description?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          booking_platform?: string | null
          booking_url?: string | null
          created_at?: string
          description?: string
          email?: string | null
          google_map_url?: string | null
          id?: string
          location?: string
          logo_path?: string | null
          name?: string
          phone?: string | null
          price?: number
          rating?: number
          short_description?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
