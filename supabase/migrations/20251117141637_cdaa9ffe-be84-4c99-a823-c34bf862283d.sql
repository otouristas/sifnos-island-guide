-- Phase 1: Foundation - Guest Experience Module Database Schema

-- ==============================================
-- MIGRATION 1: Hotels Table Extensions
-- ==============================================

-- Add guest experience fields to hotels table
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#1E2E48';
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '#E3D7C3';
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS guest_welcome_message TEXT;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS guest_wifi_name TEXT;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS guest_wifi_password TEXT;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS check_in_time TEXT DEFAULT '14:00';
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS check_out_time TEXT DEFAULT '11:00';

-- Generate slugs for existing hotels (replace spaces and special chars with hyphens)
UPDATE hotels 
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g'), '^-|-$', '', 'g'))
WHERE slug IS NULL;

-- Make slug unique and required
ALTER TABLE hotels ALTER COLUMN slug SET NOT NULL;
ALTER TABLE hotels ADD CONSTRAINT hotels_slug_unique UNIQUE (slug);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_hotels_slug ON hotels(slug);

-- ==============================================
-- MIGRATION 2: Guest Bookings Enhancement
-- ==============================================

-- Add guest token and tracking fields to room_bookings
ALTER TABLE room_bookings ADD COLUMN IF NOT EXISTS guest_token TEXT;
ALTER TABLE room_bookings ADD COLUMN IF NOT EXISTS guest_link_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE room_bookings ADD COLUMN IF NOT EXISTS guest_link_sent_at TIMESTAMPTZ;
ALTER TABLE room_bookings ADD COLUMN IF NOT EXISTS checkin_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE room_bookings ADD COLUMN IF NOT EXISTS checkin_completed_at TIMESTAMPTZ;

-- Generate secure tokens for existing bookings
UPDATE room_bookings 
SET guest_token = encode(gen_random_bytes(16), 'hex')
WHERE guest_token IS NULL;

-- Make guest_token unique and required
ALTER TABLE room_bookings ALTER COLUMN guest_token SET NOT NULL;
ALTER TABLE room_bookings ADD CONSTRAINT room_bookings_guest_token_unique UNIQUE (guest_token);

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_room_bookings_guest_token ON room_bookings(guest_token);

-- ==============================================
-- MIGRATION 3: Guest Guide Content
-- ==============================================

-- Hotel-specific guest guide sections
CREATE TABLE IF NOT EXISTS guest_guide_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  section_title TEXT NOT NULL,
  section_content TEXT NOT NULL,
  section_order INTEGER DEFAULT 0,
  icon_name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guest_guide_hotel ON guest_guide_sections(hotel_id);
CREATE INDEX IF NOT EXISTS idx_guest_guide_order ON guest_guide_sections(hotel_id, section_order);

-- RLS Policies for guest_guide_sections
ALTER TABLE guest_guide_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hotel owners can manage their guide sections"
  ON guest_guide_sections FOR ALL
  USING (
    hotel_id IN (
      SELECT hotel_id FROM hotel_owners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view active guide sections"
  ON guest_guide_sections FOR SELECT
  USING (is_active = TRUE);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_guest_guide_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_guest_guide_sections_updated_at
  BEFORE UPDATE ON guest_guide_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_guest_guide_updated_at();

-- ==============================================
-- MIGRATION 4: Area POIs (Points of Interest)
-- ==============================================

-- Shared POIs for all hotels (restaurants, beaches, bars, attractions)
CREATE TABLE IF NOT EXISTS area_pois (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  google_maps_url TEXT,
  phone TEXT,
  website TEXT,
  image_url TEXT,
  distance_from_kamares NUMERIC,
  distance_from_apollonia NUMERIC,
  distance_from_platis_gialos NUMERIC,
  price_range TEXT,
  opening_hours JSONB,
  tags TEXT[],
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_area_pois_category ON area_pois(category);
CREATE INDEX IF NOT EXISTS idx_area_pois_location ON area_pois(location);
CREATE INDEX IF NOT EXISTS idx_area_pois_featured ON area_pois(featured) WHERE featured = TRUE;

-- RLS Policies for area_pois
ALTER TABLE area_pois ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view POIs"
  ON area_pois FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage POIs"
  ON area_pois FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Trigger to update updated_at
CREATE TRIGGER update_area_pois_updated_at
  BEFORE UPDATE ON area_pois
  FOR EACH ROW
  EXECUTE FUNCTION update_guest_guide_updated_at();

-- ==============================================
-- MIGRATION 5: Guest Requests System
-- ==============================================

-- Guest requests (housekeeping, maintenance, reception, etc.)
CREATE TABLE IF NOT EXISTS guest_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES room_bookings(id) ON DELETE CASCADE,
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'normal',
  assigned_to UUID REFERENCES user_profiles(id),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES user_profiles(id),
  staff_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guest_requests_booking ON guest_requests(booking_id);
CREATE INDEX IF NOT EXISTS idx_guest_requests_hotel ON guest_requests(hotel_id);
CREATE INDEX IF NOT EXISTS idx_guest_requests_status ON guest_requests(status);
CREATE INDEX IF NOT EXISTS idx_guest_requests_created ON guest_requests(created_at DESC);

-- RLS Policies for guest_requests
ALTER TABLE guest_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create requests"
  ON guest_requests FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Anyone can view requests for their booking"
  ON guest_requests FOR SELECT
  USING (TRUE);

CREATE POLICY "Hotel staff can manage requests for their hotels"
  ON guest_requests FOR ALL
  USING (
    hotel_id IN (
      SELECT hotel_id FROM hotel_owners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all requests"
  ON guest_requests FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Trigger to update updated_at
CREATE TRIGGER update_guest_requests_updated_at
  BEFORE UPDATE ON guest_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_guest_guide_updated_at();