
-- Create hotel registrations table
CREATE TABLE IF NOT EXISTS hotel_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  selected_plan TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE hotel_registrations ENABLE ROW LEVEL SECURITY;

-- Only allow admin users to view registrations
CREATE POLICY "Allow admins to view registrations" ON hotel_registrations
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow anyone to insert new registrations
CREATE POLICY "Allow anyone to insert registrations" ON hotel_registrations
  FOR INSERT WITH CHECK (true);

-- Only allow admin users to update registrations
CREATE POLICY "Allow admins to update registrations" ON hotel_registrations
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for updated_at
CREATE TRIGGER update_hotel_registrations_updated_at
  BEFORE UPDATE ON hotel_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
