-- ============================================
-- COMPREHENSIVE SECURITY FIX MIGRATION (REVISED)
-- ============================================

-- Phase 1: Create RBAC System (Skip if already exists)
-- ============================================

-- Create app_role enum only if it doesn't exist
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'hotel_owner', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can view their own roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Only admins can manage roles
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Phase 2: Fix booking_sessions RLS vulnerabilities
-- ============================================

-- Add user_id column to booking_sessions
ALTER TABLE public.booking_sessions
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Drop old broken RLS policies
DROP POLICY IF EXISTS "Users can view their own booking sessions" ON public.booking_sessions;
DROP POLICY IF EXISTS "Users can update their own booking sessions" ON public.booking_sessions;

-- Create correct RLS policies using user_id
CREATE POLICY "Users can view their own booking sessions"
ON public.booking_sessions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own booking sessions"
ON public.booking_sessions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Phase 3: Fix email_sends RLS vulnerabilities
-- ============================================

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Admins can manage email sends" ON public.email_sends;

-- Create proper admin-only policies using has_role function
DROP POLICY IF EXISTS "Admins can view all email sends" ON public.email_sends;
DROP POLICY IF EXISTS "Admins can insert email sends" ON public.email_sends;
DROP POLICY IF EXISTS "Admins can update email sends" ON public.email_sends;
DROP POLICY IF EXISTS "Admins can delete email sends" ON public.email_sends;

CREATE POLICY "Admins can view all email sends"
ON public.email_sends
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert email sends"
ON public.email_sends
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update email sends"
ON public.email_sends
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete email sends"
ON public.email_sends
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Phase 4: Fix other admin policies across tables
-- ============================================

-- Fix ab_test_variants policies
DROP POLICY IF EXISTS "Admins can manage A/B test variants" ON public.ab_test_variants;
CREATE POLICY "Admins can manage A/B test variants"
ON public.ab_test_variants
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix email_campaigns policies
DROP POLICY IF EXISTS "Admins can manage email campaigns" ON public.email_campaigns;
CREATE POLICY "Admins can manage email campaigns"
ON public.email_campaigns
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix weather_recommendations policies
DROP POLICY IF EXISTS "Admins can manage weather recommendations" ON public.weather_recommendations;
CREATE POLICY "Admins can manage weather recommendations"
ON public.weather_recommendations
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix hotel_registrations policies
DROP POLICY IF EXISTS "Allow admins to update registrations" ON public.hotel_registrations;
DROP POLICY IF EXISTS "Allow admins to view registrations" ON public.hotel_registrations;
DROP POLICY IF EXISTS "Admins can view all hotel registrations" ON public.hotel_registrations;
DROP POLICY IF EXISTS "Admins can update hotel registrations" ON public.hotel_registrations;
DROP POLICY IF EXISTS "Admins can delete hotel registrations" ON public.hotel_registrations;

CREATE POLICY "Admins can view all hotel registrations"
ON public.hotel_registrations
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update hotel registrations"
ON public.hotel_registrations
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete hotel registrations"
ON public.hotel_registrations
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix ferry_schedules admin policy
DROP POLICY IF EXISTS "Authenticated users can manage ferry schedules" ON public.ferry_schedules;
DROP POLICY IF EXISTS "Admins can manage ferry schedules" ON public.ferry_schedules;
CREATE POLICY "Admins can manage ferry schedules"
ON public.ferry_schedules
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Phase 5: Add database function search_path security
-- ============================================

-- Update existing functions to set search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_ferry_schedules_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add indexes for better performance on role checks
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id_role ON public.user_roles(user_id, role);
CREATE INDEX IF NOT EXISTS idx_booking_sessions_user_id ON public.booking_sessions(user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role TO authenticated, anon;