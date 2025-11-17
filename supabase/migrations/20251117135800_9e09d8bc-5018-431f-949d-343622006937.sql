-- Create travel packages table for ferry + hotel combos
CREATE TABLE IF NOT EXISTS public.travel_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  ferry_route TEXT NOT NULL,
  hotel_id UUID REFERENCES public.hotels(id),
  base_price DECIMAL(10,2) NOT NULL,
  discount_percentage INTEGER DEFAULT 0,
  final_price DECIMAL(10,2) NOT NULL,
  included_amenities TEXT[],
  valid_from DATE NOT NULL,
  valid_until DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  max_guests INTEGER DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create abandoned bookings table for recovery emails
CREATE TABLE IF NOT EXISTS public.abandoned_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_email TEXT,
  user_name TEXT,
  booking_type TEXT NOT NULL, -- 'hotel', 'ferry', 'package'
  hotel_id UUID REFERENCES public.hotels(id),
  ferry_route TEXT,
  package_id UUID REFERENCES public.travel_packages(id),
  check_in_date DATE,
  check_out_date DATE,
  guests INTEGER,
  estimated_price DECIMAL(10,2),
  booking_data JSONB,
  recovery_email_sent BOOLEAN DEFAULT false,
  recovery_email_sent_at TIMESTAMPTZ,
  converted BOOLEAN DEFAULT false,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for abandoned booking queries
CREATE INDEX IF NOT EXISTS idx_abandoned_bookings_session ON public.abandoned_bookings(session_id);
CREATE INDEX IF NOT EXISTS idx_abandoned_bookings_email ON public.abandoned_bookings(user_email);
CREATE INDEX IF NOT EXISTS idx_abandoned_bookings_recovery ON public.abandoned_bookings(recovery_email_sent, created_at);

-- Create package bookings table
CREATE TABLE IF NOT EXISTS public.package_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES public.travel_packages(id),
  user_id UUID,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  number_of_guests INTEGER NOT NULL,
  ferry_departure_date DATE NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  booking_status TEXT DEFAULT 'pending',
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.travel_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abandoned_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for travel_packages (public read)
CREATE POLICY "Anyone can view active packages"
  ON public.travel_packages FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage packages"
  ON public.travel_packages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- RLS Policies for abandoned_bookings (service role only)
CREATE POLICY "Service role can manage abandoned bookings"
  ON public.abandoned_bookings FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- RLS Policies for package_bookings
CREATE POLICY "Users can view their own package bookings"
  ON public.package_bookings FOR SELECT
  USING (auth.uid()::text = user_id::text OR guest_email = auth.email());

CREATE POLICY "Anyone can create package bookings"
  ON public.package_bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage all package bookings"
  ON public.package_bookings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Add triggers for updated_at
CREATE TRIGGER update_travel_packages_updated_at
  BEFORE UPDATE ON public.travel_packages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_abandoned_bookings_updated_at
  BEFORE UPDATE ON public.abandoned_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_package_bookings_updated_at
  BEFORE UPDATE ON public.package_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample travel packages
INSERT INTO public.travel_packages (name, description, ferry_route, base_price, discount_percentage, final_price, included_amenities, valid_from, valid_until, max_guests)
VALUES 
  (
    'Summer Paradise Package',
    'Perfect beach getaway: Ferry tickets + 3 nights at beachfront hotel with breakfast included',
    'Piraeus - Sifnos',
    450.00,
    15,
    382.50,
    ARRAY['Round-trip ferry tickets', 'Airport transfer', 'Daily breakfast', 'Welcome drink', 'Beach equipment'],
    '2026-05-01',
    '2026-09-30',
    2
  ),
  (
    'Romantic Escape Package',
    'Couples retreat: Ferry + 2 nights in luxury villa with private pool and romantic dinner',
    'Piraeus - Sifnos',
    680.00,
    20,
    544.00,
    ARRAY['Round-trip ferry tickets', 'Private transfer', 'Champagne on arrival', 'Romantic dinner', 'Couples spa treatment'],
    '2026-04-01',
    '2026-10-31',
    2
  ),
  (
    'Family Fun Package',
    'Family adventure: Ferry + 5 nights with kids activities and family-friendly amenities',
    'Piraeus - Sifnos',
    890.00,
    25,
    667.50,
    ARRAY['Round-trip ferry tickets for 4', 'Airport transfer', 'Half-board meals', 'Kids club access', 'Water sports equipment'],
    '2026-06-01',
    '2026-08-31',
    4
  );