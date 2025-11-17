-- ============================================
-- UPDATE HOTELS TABLE FOR OWNERSHIP AND STATUS
-- ============================================

-- Create hotel_status enum
DO $$ BEGIN
  CREATE TYPE public.hotel_status AS ENUM ('draft', 'pending_review', 'active', 'inactive');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add new columns to hotels table
ALTER TABLE public.hotels
ADD COLUMN IF NOT EXISTS owner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.hotels
ADD COLUMN IF NOT EXISTS status public.hotel_status NOT NULL DEFAULT 'draft';

ALTER TABLE public.hotels
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

ALTER TABLE public.hotels
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

-- Add indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_hotels_owner_user_id ON public.hotels(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_hotels_status ON public.hotels(status);
CREATE INDEX IF NOT EXISTS idx_hotels_created_by ON public.hotels(created_by);

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can view hotels" ON public.hotels;
DROP POLICY IF EXISTS "Public hotels are viewable by everyone" ON public.hotels;

-- Create new RLS policies

-- Public can view only active hotels
CREATE POLICY "Public can view active hotels"
ON public.hotels
FOR SELECT
TO public
USING (status = 'active');

-- Authenticated users can view active hotels
CREATE POLICY "Authenticated users can view active hotels"
ON public.hotels
FOR SELECT
TO authenticated
USING (status = 'active');

-- Hotel owners can view their own hotels (any status)
CREATE POLICY "Hotel owners can view their own hotels"
ON public.hotels
FOR SELECT
TO authenticated
USING (
  owner_user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.hotel_owners
    WHERE hotel_owners.hotel_id = hotels.id
    AND hotel_owners.user_id = auth.uid()
  )
);

-- Hotel owners can create new hotels
CREATE POLICY "Hotel owners can create hotels"
ON public.hotels
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'hotel_owner') AND
  owner_user_id = auth.uid()
);

-- Hotel owners can update their own hotels
CREATE POLICY "Hotel owners can update their own hotels"
ON public.hotels
FOR UPDATE
TO authenticated
USING (
  owner_user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.hotel_owners
    WHERE hotel_owners.hotel_id = hotels.id
    AND hotel_owners.user_id = auth.uid()
    AND hotel_owners.role IN ('owner', 'manager')
  )
)
WITH CHECK (
  owner_user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.hotel_owners
    WHERE hotel_owners.hotel_id = hotels.id
    AND hotel_owners.user_id = auth.uid()
    AND hotel_owners.role IN ('owner', 'manager')
  )
);

-- Admins can do everything
CREATE POLICY "Admins can manage all hotels"
ON public.hotels
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create function to automatically set created_by and updated_by
CREATE OR REPLACE FUNCTION public.set_hotel_audit_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.created_by = auth.uid();
    NEW.updated_by = auth.uid();
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.updated_by = auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

-- Add trigger for audit fields
DROP TRIGGER IF EXISTS set_hotels_audit_fields ON public.hotels;
CREATE TRIGGER set_hotels_audit_fields
  BEFORE INSERT OR UPDATE ON public.hotels
  FOR EACH ROW
  EXECUTE FUNCTION public.set_hotel_audit_fields();

-- Grant permissions
GRANT SELECT ON public.hotels TO anon, authenticated;
GRANT INSERT, UPDATE ON public.hotels TO authenticated;

