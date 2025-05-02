
-- Add source and country columns to hotel_reviews
ALTER TABLE hotel_reviews 
ADD COLUMN IF NOT EXISTS source text DEFAULT 'site',
ADD COLUMN IF NOT EXISTS country text;

-- Enable realtime for the hotel_reviews table
ALTER TABLE hotel_reviews REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE hotel_reviews;
