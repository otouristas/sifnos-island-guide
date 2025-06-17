
-- Create table for caching Agoda hotel results
CREATE TABLE public.agoda_hotels (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agoda_hotel_id integer NOT NULL,
  name text NOT NULL,
  star_rating numeric,
  review_score numeric,
  review_count integer,
  daily_rate numeric,
  crossed_out_rate numeric,
  discount_percentage numeric,
  currency text DEFAULT 'USD',
  image_url text,
  landing_url text,
  include_breakfast boolean DEFAULT false,
  free_wifi boolean DEFAULT false,
  check_in_date date NOT NULL,
  check_out_date date NOT NULL,
  number_of_adults integer DEFAULT 2,
  number_of_children integer DEFAULT 0,
  cached_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '1 hour'),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add index for efficient querying
CREATE INDEX idx_agoda_hotels_dates ON agoda_hotels(check_in_date, check_out_date);
CREATE INDEX idx_agoda_hotels_cached ON agoda_hotels(cached_at, expires_at);
CREATE INDEX idx_agoda_hotels_hotel_id ON agoda_hotels(agoda_hotel_id);

-- Add source field to existing hotels table to distinguish between local and Agoda hotels
ALTER TABLE public.hotels ADD COLUMN IF NOT EXISTS source text DEFAULT 'local';

-- Enable RLS for agoda_hotels (public read access for now)
ALTER TABLE public.agoda_hotels ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to agoda hotels
CREATE POLICY "Anyone can view agoda hotels" 
  ON public.agoda_hotels 
  FOR SELECT 
  USING (true);
