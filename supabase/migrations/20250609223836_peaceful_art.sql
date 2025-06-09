/*
  # Add source and country columns to hotel_reviews

  1. Changes
    - Add source column with default value 'site'
    - Add country column (nullable)
    - Enable full replica identity for realtime
    - Conditionally add table to realtime publication if not already a member
*/

-- Add source and country columns to hotel_reviews
ALTER TABLE hotel_reviews 
ADD COLUMN IF NOT EXISTS source text DEFAULT 'site',
ADD COLUMN IF NOT EXISTS country text;

-- Enable realtime for the hotel_reviews table
ALTER TABLE hotel_reviews REPLICA IDENTITY FULL;

-- Only add to publication if not already a member
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'hotel_reviews'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE hotel_reviews;
  END IF;
END
$$;