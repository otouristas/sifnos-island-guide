
-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  is_read BOOLEAN DEFAULT false NOT NULL
);

-- Set up RLS policies so only authenticated administrative users can read contact submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- We leave insert open so the contact form can work without auth
CREATE POLICY "Anyone can insert contact submissions" 
  ON public.contact_submissions 
  FOR INSERT 
  WITH CHECK (true);

-- Only authenticated users with admin role would be able to select/read submissions
-- For now, this is commented out as we don't have auth set up yet
-- CREATE POLICY "Only authenticated users can read contact submissions" 
--   ON public.contact_submissions 
--   FOR SELECT 
--   USING (auth.role() = 'authenticated');

-- But we at least want some security, so let's not allow anyone to update or delete
CREATE POLICY "No one can update or delete contact submissions" 
  ON public.contact_submissions 
  FOR ALL 
  USING (false);
