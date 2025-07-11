-- Create tables for enhanced booking system
CREATE TABLE public.booking_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  hotel_id UUID NOT NULL REFERENCES public.hotels(id),
  room_id UUID REFERENCES public.hotel_rooms(id),
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 2,
  user_email TEXT,
  user_phone TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '30 minutes'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user preferences and personalization
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id),
  session_id TEXT,
  language TEXT DEFAULT 'en',
  currency TEXT DEFAULT 'EUR',
  hotel_types TEXT[] DEFAULT '{}',
  price_range_min INTEGER,
  price_range_max INTEGER,
  preferred_amenities TEXT[] DEFAULT '{}',
  location_preferences TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for A/B testing framework
CREATE TABLE public.ab_test_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_name TEXT NOT NULL,
  variant_name TEXT NOT NULL,
  configuration JSONB NOT NULL,
  traffic_percentage INTEGER NOT NULL DEFAULT 50,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(test_name, variant_name)
);

-- Create table for user test assignments
CREATE TABLE public.user_test_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id),
  session_id TEXT,
  test_name TEXT NOT NULL,
  variant_name TEXT NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (test_name, variant_name) REFERENCES public.ab_test_variants(test_name, variant_name)
);

-- Create table for email campaigns and automation
CREATE TABLE public.email_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- welcome, abandoned_booking, promotion, review_request
  trigger_event TEXT NOT NULL,
  subject_template TEXT NOT NULL,
  body_template TEXT NOT NULL,
  delay_hours INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for tracking email sends
CREATE TABLE public.email_sends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.email_campaigns(id),
  recipient_email TEXT NOT NULL,
  user_id UUID REFERENCES public.user_profiles(id),
  booking_session_id UUID REFERENCES public.booking_sessions(id),
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'sent' -- sent, delivered, opened, clicked, bounced
);

-- Create table for social proof events
CREATE TABLE public.social_proof_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL, -- booking, viewing, favorite
  hotel_id UUID NOT NULL REFERENCES public.hotels(id),
  user_location TEXT,
  user_country TEXT,
  anonymous_user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for weather-based recommendations
CREATE TABLE public.weather_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  weather_condition TEXT NOT NULL,
  temperature_range TEXT,
  recommendation_type TEXT NOT NULL, -- hotel, activity, amenity
  hotel_types TEXT[] DEFAULT '{}',
  priority_score INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.booking_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_test_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_test_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_proof_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_recommendations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for booking sessions
CREATE POLICY "Users can view their own booking sessions" 
ON public.booking_sessions 
FOR SELECT 
USING (auth.uid()::text = user_email OR session_id IN (
  SELECT session_id FROM public.user_preferences WHERE user_id = auth.uid()
));

CREATE POLICY "Anyone can create booking sessions" 
ON public.booking_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own booking sessions" 
ON public.booking_sessions 
FOR UPDATE 
USING (auth.uid()::text = user_email OR session_id IN (
  SELECT session_id FROM public.user_preferences WHERE user_id = auth.uid()
));

-- Create policies for user preferences
CREATE POLICY "Users can manage their own preferences" 
ON public.user_preferences 
FOR ALL 
USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- Create policies for A/B testing
CREATE POLICY "Anyone can view active A/B test variants" 
ON public.ab_test_variants 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage A/B test variants" 
ON public.ab_test_variants 
FOR ALL 
USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can be assigned to tests" 
ON public.user_test_assignments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their test assignments" 
ON public.user_test_assignments 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- Create policies for email campaigns
CREATE POLICY "Admins can manage email campaigns" 
ON public.email_campaigns 
FOR ALL 
USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can view active campaigns" 
ON public.email_campaigns 
FOR SELECT 
USING (is_active = true);

-- Create policies for email sends
CREATE POLICY "Admins can manage email sends" 
ON public.email_sends 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Create policies for social proof events
CREATE POLICY "Anyone can view social proof events" 
ON public.social_proof_events 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create social proof events" 
ON public.social_proof_events 
FOR INSERT 
WITH CHECK (true);

-- Create policies for weather recommendations
CREATE POLICY "Anyone can view weather recommendations" 
ON public.weather_recommendations 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage weather recommendations" 
ON public.weather_recommendations 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Create triggers for updated_at columns
CREATE TRIGGER update_booking_sessions_updated_at
BEFORE UPDATE ON public.booking_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ab_test_variants_updated_at
BEFORE UPDATE ON public.ab_test_variants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_campaigns_updated_at
BEFORE UPDATE ON public.email_campaigns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data for weather recommendations
INSERT INTO public.weather_recommendations (location, weather_condition, recommendation_type, hotel_types, priority_score) VALUES
('Sifnos', 'sunny', 'hotel', '{"Beach Hotels", "Luxury Hotels"}', 10),
('Sifnos', 'cloudy', 'hotel', '{"Boutique Hotels", "Traditional Hotels"}', 8),
('Sifnos', 'rainy', 'hotel', '{"Luxury Hotels", "Boutique Hotels"}', 9),
('Sifnos', 'windy', 'hotel', '{"Traditional Hotels", "Family Hotels"}', 7);

-- Insert initial A/B test variants
INSERT INTO public.ab_test_variants (test_name, variant_name, configuration, traffic_percentage) VALUES
('hero_cta', 'control', '{"button_text": "Book Now", "color": "primary"}', 50),
('hero_cta', 'variant_a', '{"button_text": "Find Your Perfect Stay", "color": "accent"}', 50),
('hotel_card_layout', 'control', '{"layout": "standard", "show_amenities": true}', 50),
('hotel_card_layout', 'variant_a', '{"layout": "compact", "show_amenities": false}', 50);

-- Insert initial email campaigns
INSERT INTO public.email_campaigns (name, type, trigger_event, subject_template, body_template, delay_hours) VALUES
('Welcome Email', 'welcome', 'user_signup', 'Welcome to Sifnos Hotels!', 'Thank you for joining us. Discover the best hotels in Sifnos.', 0),
('Abandoned Booking Recovery', 'abandoned_booking', 'booking_abandoned', 'Complete your booking - Special offer inside!', 'Your Sifnos getaway is waiting. Complete your booking with 10% off.', 2),
('Seasonal Promotion', 'promotion', 'seasonal_campaign', 'Summer in Sifnos - Limited Time Offer', 'Experience the magic of Sifnos this summer with our exclusive deals.', 0),
('Review Request', 'review_request', 'booking_completed', 'How was your stay in Sifnos?', 'We hope you had an amazing time. Please share your experience with us.', 72);