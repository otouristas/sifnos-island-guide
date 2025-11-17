-- ============================================
-- EXTEND USER PROFILES FOR HOTEL BUSINESSES
-- ============================================

-- Create account_type enum
DO $$ BEGIN
  CREATE TYPE public.account_type AS ENUM ('user', 'hotel_business');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add new columns to user_profiles
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS account_type public.account_type NOT NULL DEFAULT 'user';

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS business_name TEXT;

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS business_phone TEXT;

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS business_address TEXT;

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT false;

-- Add index for account type queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_account_type ON public.user_profiles(account_type);

-- Update the handle_new_user function to set default account type
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, account_type)
  VALUES (NEW.id, 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Create function to automatically assign role based on account type
CREATE OR REPLACE FUNCTION public.assign_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Assign 'user' role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- If account_type is hotel_business, also assign hotel_owner role
  IF NEW.account_type = 'hotel_business' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'hotel_owner')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to assign roles on profile insert/update
DROP TRIGGER IF EXISTS on_user_profile_created ON public.user_profiles;
CREATE TRIGGER on_user_profile_created
  AFTER INSERT ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_user_role();

DROP TRIGGER IF EXISTS on_user_profile_account_type_updated ON public.user_profiles;
CREATE TRIGGER on_user_profile_account_type_updated
  AFTER UPDATE OF account_type ON public.user_profiles
  FOR EACH ROW
  WHEN (OLD.account_type IS DISTINCT FROM NEW.account_type)
  EXECUTE FUNCTION public.assign_user_role();

-- Grant permissions
GRANT UPDATE (business_name, business_phone, business_address, onboarding_completed) ON public.user_profiles TO authenticated;

