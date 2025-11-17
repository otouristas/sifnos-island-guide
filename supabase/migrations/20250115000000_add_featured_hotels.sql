-- Add featured hotel fields to hotels table
ALTER TABLE public.hotels 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS featured_priority INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS featured_start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS featured_end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS featured_tier TEXT CHECK (featured_tier IN ('bronze', 'silver', 'gold', 'platinum')) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS featured_notes TEXT;

-- Create indexes for efficient featured hotel queries
CREATE INDEX IF NOT EXISTS idx_hotels_is_featured ON public.hotels(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_hotels_featured_priority ON public.hotels(featured_priority DESC) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_hotels_featured_dates ON public.hotels(featured_start_date, featured_end_date) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_hotels_featured_tier ON public.hotels(featured_tier) WHERE is_featured = true;

-- Create a composite index for featured hotel queries (date filtering done in application code)
CREATE INDEX IF NOT EXISTS idx_hotels_featured_composite ON public.hotels(is_featured, featured_priority DESC, featured_tier) 
WHERE is_featured = true;

-- Add comment for documentation
COMMENT ON COLUMN public.hotels.is_featured IS 'Whether this hotel is featured on the homepage and in AI recommendations';
COMMENT ON COLUMN public.hotels.featured_priority IS 'Priority order for featured hotels (higher = more prominent). Used for sorting.';
COMMENT ON COLUMN public.hotels.featured_start_date IS 'Start date for featured status. NULL means no start date restriction.';
COMMENT ON COLUMN public.hotels.featured_end_date IS 'End date for featured status. NULL means no end date restriction.';
COMMENT ON COLUMN public.hotels.featured_tier IS 'Tier level: bronze, silver, gold, or platinum. Higher tiers get priority in AI recommendations.';
COMMENT ON COLUMN public.hotels.featured_notes IS 'Admin notes about this featured hotel listing';

