-- ============================================
-- CREATE HOTEL OWNERS JUNCTION TABLE
-- ============================================

-- Create hotel_owners table to link users with their hotels
CREATE TABLE IF NOT EXISTS public.hotel_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'manager', 'editor')),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, hotel_id)
);

-- Add missing columns if table already exists
DO $$ 
BEGIN
  -- Add role column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'hotel_owners' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE public.hotel_owners ADD COLUMN role TEXT DEFAULT 'owner';
  END IF;

  -- Add is_verified column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'hotel_owners' 
    AND column_name = 'is_verified'
  ) THEN
    ALTER TABLE public.hotel_owners ADD COLUMN is_verified BOOLEAN DEFAULT false;
    ALTER TABLE public.hotel_owners ALTER COLUMN is_verified SET NOT NULL;
    ALTER TABLE public.hotel_owners ALTER COLUMN is_verified SET DEFAULT false;
  END IF;

  -- Add created_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'hotel_owners' 
    AND column_name = 'created_at'
  ) THEN
    ALTER TABLE public.hotel_owners ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
    ALTER TABLE public.hotel_owners ALTER COLUMN created_at SET NOT NULL;
  END IF;

  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'hotel_owners' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.hotel_owners ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
    ALTER TABLE public.hotel_owners ALTER COLUMN updated_at SET NOT NULL;
  END IF;
END $$;

-- Add constraint for role if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'hotel_owners_role_check'
  ) THEN
    ALTER TABLE public.hotel_owners
    ADD CONSTRAINT hotel_owners_role_check 
    CHECK (role IN ('owner', 'manager', 'editor'));
  END IF;
END $$;

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'hotel_owners_user_id_hotel_id_key'
  ) THEN
    ALTER TABLE public.hotel_owners
    ADD CONSTRAINT hotel_owners_user_id_hotel_id_key 
    UNIQUE (user_id, hotel_id);
  END IF;
END $$;

-- Add index for efficient querying
CREATE INDEX IF NOT EXISTS idx_hotel_owners_user_id ON public.hotel_owners(user_id);
CREATE INDEX IF NOT EXISTS idx_hotel_owners_hotel_id ON public.hotel_owners(hotel_id);
CREATE INDEX IF NOT EXISTS idx_hotel_owners_verified ON public.hotel_owners(is_verified);

-- Enable RLS
ALTER TABLE public.hotel_owners ENABLE ROW LEVEL SECURITY;

-- Owners can view their own ownership records
CREATE POLICY "Users can view their own hotel ownerships"
ON public.hotel_owners
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Owners can insert their own ownership records (for creating hotels)
CREATE POLICY "Hotel owners can create ownership records"
ON public.hotel_owners
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND
  public.has_role(auth.uid(), 'hotel_owner')
);

-- Only admins can update ownership records (for verification)
CREATE POLICY "Admins can manage hotel ownerships"
ON public.hotel_owners
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_hotel_owners_updated_at
  BEFORE UPDATE ON public.hotel_owners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT SELECT ON public.hotel_owners TO authenticated;
GRANT INSERT ON public.hotel_owners TO authenticated;

