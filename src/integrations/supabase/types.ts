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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ab_test_variants: {
        Row: {
          configuration: Json
          created_at: string
          id: string
          is_active: boolean
          test_name: string
          traffic_percentage: number
          updated_at: string
          variant_name: string
        }
        Insert: {
          configuration: Json
          created_at?: string
          id?: string
          is_active?: boolean
          test_name: string
          traffic_percentage?: number
          updated_at?: string
          variant_name: string
        }
        Update: {
          configuration?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          test_name?: string
          traffic_percentage?: number
          updated_at?: string
          variant_name?: string
        }
        Relationships: []
      }
      abandoned_bookings: {
        Row: {
          booking_data: Json | null
          booking_type: string
          check_in_date: string | null
          check_out_date: string | null
          converted: boolean | null
          converted_at: string | null
          created_at: string | null
          estimated_price: number | null
          ferry_route: string | null
          guests: number | null
          hotel_id: string | null
          id: string
          package_id: string | null
          recovery_email_sent: boolean | null
          recovery_email_sent_at: string | null
          session_id: string
          updated_at: string | null
          user_email: string | null
          user_name: string | null
        }
        Insert: {
          booking_data?: Json | null
          booking_type: string
          check_in_date?: string | null
          check_out_date?: string | null
          converted?: boolean | null
          converted_at?: string | null
          created_at?: string | null
          estimated_price?: number | null
          ferry_route?: string | null
          guests?: number | null
          hotel_id?: string | null
          id?: string
          package_id?: string | null
          recovery_email_sent?: boolean | null
          recovery_email_sent_at?: string | null
          session_id: string
          updated_at?: string | null
          user_email?: string | null
          user_name?: string | null
        }
        Update: {
          booking_data?: Json | null
          booking_type?: string
          check_in_date?: string | null
          check_out_date?: string | null
          converted?: boolean | null
          converted_at?: string | null
          created_at?: string | null
          estimated_price?: number | null
          ferry_route?: string | null
          guests?: number | null
          hotel_id?: string | null
          id?: string
          package_id?: string | null
          recovery_email_sent?: boolean | null
          recovery_email_sent_at?: string | null
          session_id?: string
          updated_at?: string | null
          user_email?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "abandoned_bookings_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "abandoned_bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "travel_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      agoda_hotels: {
        Row: {
          agoda_hotel_id: number
          cached_at: string
          check_in_date: string
          check_out_date: string
          created_at: string
          crossed_out_rate: number | null
          currency: string | null
          daily_rate: number | null
          discount_percentage: number | null
          expires_at: string
          free_wifi: boolean | null
          id: string
          image_url: string | null
          include_breakfast: boolean | null
          landing_url: string | null
          name: string
          number_of_adults: number | null
          number_of_children: number | null
          review_count: number | null
          review_score: number | null
          star_rating: number | null
        }
        Insert: {
          agoda_hotel_id: number
          cached_at?: string
          check_in_date: string
          check_out_date: string
          created_at?: string
          crossed_out_rate?: number | null
          currency?: string | null
          daily_rate?: number | null
          discount_percentage?: number | null
          expires_at?: string
          free_wifi?: boolean | null
          id?: string
          image_url?: string | null
          include_breakfast?: boolean | null
          landing_url?: string | null
          name: string
          number_of_adults?: number | null
          number_of_children?: number | null
          review_count?: number | null
          review_score?: number | null
          star_rating?: number | null
        }
        Update: {
          agoda_hotel_id?: number
          cached_at?: string
          check_in_date?: string
          check_out_date?: string
          created_at?: string
          crossed_out_rate?: number | null
          currency?: string | null
          daily_rate?: number | null
          discount_percentage?: number | null
          expires_at?: string
          free_wifi?: boolean | null
          id?: string
          image_url?: string | null
          include_breakfast?: boolean | null
          landing_url?: string | null
          name?: string
          number_of_adults?: number | null
          number_of_children?: number | null
          review_count?: number | null
          review_score?: number | null
          star_rating?: number | null
        }
        Relationships: []
      }
      area_pois: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          distance_from_apollonia: number | null
          distance_from_kamares: number | null
          distance_from_platis_gialos: number | null
          featured: boolean | null
          google_maps_url: string | null
          id: string
          image_url: string | null
          location: string
          name: string
          opening_hours: Json | null
          phone: string | null
          price_range: string | null
          tags: string[] | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          distance_from_apollonia?: number | null
          distance_from_kamares?: number | null
          distance_from_platis_gialos?: number | null
          featured?: boolean | null
          google_maps_url?: string | null
          id?: string
          image_url?: string | null
          location: string
          name: string
          opening_hours?: Json | null
          phone?: string | null
          price_range?: string | null
          tags?: string[] | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          distance_from_apollonia?: number | null
          distance_from_kamares?: number | null
          distance_from_platis_gialos?: number | null
          featured?: boolean | null
          google_maps_url?: string | null
          id?: string
          image_url?: string | null
          location?: string
          name?: string
          opening_hours?: Json | null
          phone?: string | null
          price_range?: string | null
          tags?: string[] | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      booking_sessions: {
        Row: {
          check_in_date: string
          check_out_date: string
          created_at: string
          expires_at: string
          guests: number
          hotel_id: string
          id: string
          room_id: string | null
          session_id: string
          status: string
          updated_at: string
          user_email: string | null
          user_id: string | null
          user_phone: string | null
        }
        Insert: {
          check_in_date: string
          check_out_date: string
          created_at?: string
          expires_at?: string
          guests?: number
          hotel_id: string
          id?: string
          room_id?: string | null
          session_id: string
          status?: string
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
          user_phone?: string | null
        }
        Update: {
          check_in_date?: string
          check_out_date?: string
          created_at?: string
          expires_at?: string
          guests?: number
          hotel_id?: string
          id?: string
          room_id?: string | null
          session_id?: string
          status?: string
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
          user_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_sessions_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_sessions_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "hotel_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          body_template: string
          created_at: string
          delay_hours: number | null
          id: string
          is_active: boolean
          name: string
          subject_template: string
          trigger_event: string
          type: string
          updated_at: string
        }
        Insert: {
          body_template: string
          created_at?: string
          delay_hours?: number | null
          id?: string
          is_active?: boolean
          name: string
          subject_template: string
          trigger_event: string
          type: string
          updated_at?: string
        }
        Update: {
          body_template?: string
          created_at?: string
          delay_hours?: number | null
          id?: string
          is_active?: boolean
          name?: string
          subject_template?: string
          trigger_event?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_sends: {
        Row: {
          booking_session_id: string | null
          campaign_id: string
          clicked_at: string | null
          id: string
          opened_at: string | null
          recipient_email: string
          sent_at: string
          status: string
          user_id: string | null
        }
        Insert: {
          booking_session_id?: string | null
          campaign_id: string
          clicked_at?: string | null
          id?: string
          opened_at?: string | null
          recipient_email: string
          sent_at?: string
          status?: string
          user_id?: string | null
        }
        Update: {
          booking_session_id?: string | null
          campaign_id?: string
          clicked_at?: string | null
          id?: string
          opened_at?: string | null
          recipient_email?: string
          sent_at?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_sends_booking_session_id_fkey"
            columns: ["booking_session_id"]
            isOneToOne: false
            referencedRelation: "booking_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_sends_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_sends_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ferry_schedules: {
        Row: {
          arrival_code: string
          arrival_datetime: string
          arrival_name: string
          basic_price: number
          company: string
          created_at: string
          departure_code: string
          departure_datetime: string
          departure_name: string
          duration_minutes: number | null
          id: string
          is_from_sifnos: boolean | null
          is_to_sifnos: boolean | null
          route_key: string | null
          updated_at: string
        }
        Insert: {
          arrival_code: string
          arrival_datetime: string
          arrival_name: string
          basic_price: number
          company: string
          created_at?: string
          departure_code: string
          departure_datetime: string
          departure_name: string
          duration_minutes?: number | null
          id?: string
          is_from_sifnos?: boolean | null
          is_to_sifnos?: boolean | null
          route_key?: string | null
          updated_at?: string
        }
        Update: {
          arrival_code?: string
          arrival_datetime?: string
          arrival_name?: string
          basic_price?: number
          company?: string
          created_at?: string
          departure_code?: string
          departure_datetime?: string
          departure_name?: string
          duration_minutes?: number | null
          id?: string
          is_from_sifnos?: boolean | null
          is_to_sifnos?: boolean | null
          route_key?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      guest_guide_sections: {
        Row: {
          created_at: string | null
          hotel_id: string
          icon_name: string | null
          id: string
          is_active: boolean | null
          section_content: string
          section_order: number | null
          section_title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          hotel_id: string
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          section_content: string
          section_order?: number | null
          section_title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          hotel_id?: string
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          section_content?: string
          section_order?: number | null
          section_title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guest_guide_sections_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_requests: {
        Row: {
          assigned_to: string | null
          booking_id: string
          category: string
          created_at: string | null
          description: string
          hotel_id: string
          id: string
          priority: string | null
          resolved_at: string | null
          resolved_by: string | null
          staff_notes: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          booking_id: string
          category: string
          created_at?: string | null
          description: string
          hotel_id: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          staff_notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          booking_id?: string
          category?: string
          created_at?: string | null
          description?: string
          hotel_id?: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          staff_notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guest_requests_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_requests_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "room_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_requests_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_requests_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
      hotel_owners: {
        Row: {
          created_at: string
          hotel_id: string
          id: string
          is_verified: boolean
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hotel_id: string
          id?: string
          is_verified?: boolean
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          hotel_id?: string
          id?: string
          is_verified?: boolean
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotel_owners_hotel_id_fkey"
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
      hotel_registrations: {
        Row: {
          address: string | null
          airbnb_url: string | null
          booking_url: string | null
          contact_name: string
          created_at: string
          email: string
          google_maps_url: string | null
          hotel_name: string
          id: string
          location: string
          message: string | null
          phone: string
          selected_plan: string
          social_facebook: string | null
          social_instagram: string | null
          social_twitter: string | null
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          airbnb_url?: string | null
          booking_url?: string | null
          contact_name: string
          created_at?: string
          email: string
          google_maps_url?: string | null
          hotel_name: string
          id?: string
          location: string
          message?: string | null
          phone: string
          selected_plan: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          airbnb_url?: string | null
          booking_url?: string | null
          contact_name?: string
          created_at?: string
          email?: string
          google_maps_url?: string | null
          hotel_name?: string
          id?: string
          location?: string
          message?: string | null
          phone?: string
          selected_plan?: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
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
          check_in_time: string | null
          check_out_time: string | null
          created_at: string
          created_by: string | null
          description: string
          email: string | null
          featured_end_date: string | null
          featured_notes: string | null
          featured_priority: number | null
          featured_start_date: string | null
          featured_tier: string | null
          google_map_url: string | null
          guest_welcome_message: string | null
          guest_wifi_name: string | null
          guest_wifi_password: string | null
          hotel_types: string[] | null
          id: string
          is_featured: boolean | null
          location: string
          logo_path: string | null
          name: string
          owner_user_id: string | null
          phone: string | null
          price: number
          primary_color: string | null
          rating: number
          secondary_color: string | null
          short_description: string | null
          slug: string
          social_facebook: string | null
          social_instagram: string | null
          social_twitter: string | null
          source: string | null
          status: Database["public"]["Enums"]["hotel_status"]
          updated_at: string
          updated_by: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          booking_platform?: string | null
          booking_url?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          email?: string | null
          featured_end_date?: string | null
          featured_notes?: string | null
          featured_priority?: number | null
          featured_start_date?: string | null
          featured_tier?: string | null
          google_map_url?: string | null
          guest_welcome_message?: string | null
          guest_wifi_name?: string | null
          guest_wifi_password?: string | null
          hotel_types?: string[] | null
          id?: string
          is_featured?: boolean | null
          location: string
          logo_path?: string | null
          name: string
          owner_user_id?: string | null
          phone?: string | null
          price: number
          primary_color?: string | null
          rating: number
          secondary_color?: string | null
          short_description?: string | null
          slug: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["hotel_status"]
          updated_at?: string
          updated_by?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          booking_platform?: string | null
          booking_url?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          email?: string | null
          featured_end_date?: string | null
          featured_notes?: string | null
          featured_priority?: number | null
          featured_start_date?: string | null
          featured_tier?: string | null
          google_map_url?: string | null
          guest_welcome_message?: string | null
          guest_wifi_name?: string | null
          guest_wifi_password?: string | null
          hotel_types?: string[] | null
          id?: string
          is_featured?: boolean | null
          location?: string
          logo_path?: string | null
          name?: string
          owner_user_id?: string | null
          phone?: string | null
          price?: number
          primary_color?: string | null
          rating?: number
          secondary_color?: string | null
          short_description?: string | null
          slug?: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["hotel_status"]
          updated_at?: string
          updated_by?: string | null
          website?: string | null
        }
        Relationships: []
      }
      package_bookings: {
        Row: {
          booking_status: string | null
          check_in_date: string
          check_out_date: string
          created_at: string | null
          ferry_departure_date: string
          guest_email: string
          guest_name: string
          guest_phone: string | null
          id: string
          number_of_guests: number
          package_id: string | null
          special_requests: string | null
          total_price: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          booking_status?: string | null
          check_in_date: string
          check_out_date: string
          created_at?: string | null
          ferry_departure_date: string
          guest_email: string
          guest_name: string
          guest_phone?: string | null
          id?: string
          number_of_guests: number
          package_id?: string | null
          special_requests?: string | null
          total_price: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          booking_status?: string | null
          check_in_date?: string
          check_out_date?: string
          created_at?: string | null
          ferry_departure_date?: string
          guest_email?: string
          guest_name?: string
          guest_phone?: string | null
          id?: string
          number_of_guests?: number
          package_id?: string | null
          special_requests?: string | null
          total_price?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "package_bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "travel_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      room_availability: {
        Row: {
          created_at: string
          date: string
          id: string
          is_available: boolean
          min_stay: number | null
          price: number | null
          room_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          is_available?: boolean
          min_stay?: number | null
          price?: number | null
          room_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          is_available?: boolean
          min_stay?: number | null
          price?: number | null
          room_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_availability_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "hotel_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_bookings: {
        Row: {
          booking_status: string
          check_in: string
          check_out: string
          checkin_completed: boolean | null
          checkin_completed_at: string | null
          created_at: string
          guest_email: string
          guest_link_sent: boolean | null
          guest_link_sent_at: string | null
          guest_name: string
          guest_phone: string | null
          guest_token: string
          id: string
          room_id: string
          special_requests: string | null
          total_price: number
          updated_at: string
        }
        Insert: {
          booking_status?: string
          check_in: string
          check_out: string
          checkin_completed?: boolean | null
          checkin_completed_at?: string | null
          created_at?: string
          guest_email: string
          guest_link_sent?: boolean | null
          guest_link_sent_at?: string | null
          guest_name: string
          guest_phone?: string | null
          guest_token: string
          id?: string
          room_id: string
          special_requests?: string | null
          total_price: number
          updated_at?: string
        }
        Update: {
          booking_status?: string
          check_in?: string
          check_out?: string
          checkin_completed?: boolean | null
          checkin_completed_at?: string | null
          created_at?: string
          guest_email?: string
          guest_link_sent?: boolean | null
          guest_link_sent_at?: string | null
          guest_name?: string
          guest_phone?: string | null
          guest_token?: string
          id?: string
          room_id?: string
          special_requests?: string | null
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "hotel_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      social_proof_events: {
        Row: {
          anonymous_user_id: string | null
          created_at: string
          event_type: string
          hotel_id: string
          id: string
          user_country: string | null
          user_location: string | null
        }
        Insert: {
          anonymous_user_id?: string | null
          created_at?: string
          event_type: string
          hotel_id: string
          id?: string
          user_country?: string | null
          user_location?: string | null
        }
        Update: {
          anonymous_user_id?: string | null
          created_at?: string
          event_type?: string
          hotel_id?: string
          id?: string
          user_country?: string | null
          user_location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_proof_events_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_packages: {
        Row: {
          base_price: number
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          ferry_route: string
          final_price: number
          hotel_id: string | null
          id: string
          included_amenities: string[] | null
          is_active: boolean | null
          max_guests: number | null
          name: string
          updated_at: string | null
          valid_from: string
          valid_until: string
        }
        Insert: {
          base_price: number
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          ferry_route: string
          final_price: number
          hotel_id?: string | null
          id?: string
          included_amenities?: string[] | null
          is_active?: boolean | null
          max_guests?: number | null
          name: string
          updated_at?: string | null
          valid_from: string
          valid_until: string
        }
        Update: {
          base_price?: number
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          ferry_route?: string
          final_price?: number
          hotel_id?: string | null
          id?: string
          included_amenities?: string[] | null
          is_active?: boolean | null
          max_guests?: number | null
          name?: string
          updated_at?: string | null
          valid_from?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "travel_packages_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string
          hotel_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hotel_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          hotel_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          currency: string | null
          hotel_types: string[] | null
          id: string
          language: string | null
          location_preferences: string[] | null
          preferred_amenities: string[] | null
          price_range_max: number | null
          price_range_min: number | null
          session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          currency?: string | null
          hotel_types?: string[] | null
          id?: string
          language?: string | null
          location_preferences?: string[] | null
          preferred_amenities?: string[] | null
          price_range_max?: number | null
          price_range_min?: number | null
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          currency?: string | null
          hotel_types?: string[] | null
          id?: string
          language?: string | null
          location_preferences?: string[] | null
          preferred_amenities?: string[] | null
          price_range_max?: number | null
          price_range_min?: number | null
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"]
          avatar_url: string | null
          business_address: string | null
          business_name: string | null
          business_phone: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          onboarding_completed: boolean
          updated_at: string
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["account_type"]
          avatar_url?: string | null
          business_address?: string | null
          business_name?: string | null
          business_phone?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          onboarding_completed?: boolean
          updated_at?: string
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"]
          avatar_url?: string | null
          business_address?: string | null
          business_name?: string | null
          business_phone?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          onboarding_completed?: boolean
          updated_at?: string
        }
        Relationships: []
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
        Relationships: []
      }
      user_test_assignments: {
        Row: {
          assigned_at: string
          id: string
          session_id: string | null
          test_name: string
          user_id: string | null
          variant_name: string
        }
        Insert: {
          assigned_at?: string
          id?: string
          session_id?: string | null
          test_name: string
          user_id?: string | null
          variant_name: string
        }
        Update: {
          assigned_at?: string
          id?: string
          session_id?: string | null
          test_name?: string
          user_id?: string | null
          variant_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_test_assignments_test_name_variant_name_fkey"
            columns: ["test_name", "variant_name"]
            isOneToOne: false
            referencedRelation: "ab_test_variants"
            referencedColumns: ["test_name", "variant_name"]
          },
          {
            foreignKeyName: "user_test_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weather_recommendations: {
        Row: {
          created_at: string
          hotel_types: string[] | null
          id: string
          location: string
          priority_score: number | null
          recommendation_type: string
          temperature_range: string | null
          weather_condition: string
        }
        Insert: {
          created_at?: string
          hotel_types?: string[] | null
          id?: string
          location: string
          priority_score?: number | null
          recommendation_type: string
          temperature_range?: string | null
          weather_condition: string
        }
        Update: {
          created_at?: string
          hotel_types?: string[] | null
          id?: string
          location?: string
          priority_score?: number | null
          recommendation_type?: string
          temperature_range?: string | null
          weather_condition?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      account_type: "user" | "hotel_business"
      app_role: "admin" | "hotel_owner" | "user"
      hotel_status: "draft" | "pending_review" | "active" | "inactive"
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
      account_type: ["user", "hotel_business"],
      app_role: ["admin", "hotel_owner", "user"],
      hotel_status: ["draft", "pending_review", "active", "inactive"],
    },
  },
} as const
