-- Phase 1 & 2: Fix Database Triggers and Add Name Field

-- Add name column to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS name TEXT DEFAULT 'Anonymous User';

-- Make it NOT NULL
ALTER TABLE public.profiles
  ALTER COLUMN name SET NOT NULL;

-- Remove default after setting
ALTER TABLE public.profiles
  ALTER COLUMN name DROP DEFAULT;

-- Update handle_new_user function to include name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert profile with name from metadata
  INSERT INTO public.profiles (id, username, name, wallet_address)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'name', 'Anonymous User'),
    NEW.raw_user_meta_data->>'wallet_address'
  );
  
  -- Assign default buyer role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'buyer');
  
  RETURN NEW;
END;
$function$;

-- Create trigger for user signup (CRITICAL FIX)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create trigger for order timestamps (CRITICAL FIX)
DROP TRIGGER IF EXISTS order_status_timestamps ON public.orders;
CREATE TRIGGER order_status_timestamps
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_order_timestamps();