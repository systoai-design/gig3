-- Phase 2: Add timestamp columns to orders table for status tracking
ALTER TABLE orders 
  ADD COLUMN payment_confirmed_at TIMESTAMPTZ,
  ADD COLUMN delivered_at TIMESTAMPTZ,
  ADD COLUMN completed_at TIMESTAMPTZ,
  ADD COLUMN disputed_at TIMESTAMPTZ;

-- Create trigger function to automatically set timestamps on status changes
CREATE OR REPLACE FUNCTION update_order_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'in_progress' AND (OLD.status IS NULL OR OLD.status = 'pending') THEN
    NEW.payment_confirmed_at = NOW();
  END IF;
  
  IF NEW.status = 'delivered' AND OLD.status = 'in_progress' THEN
    NEW.delivered_at = NOW();
  END IF;
  
  IF NEW.status = 'completed' AND OLD.status = 'delivered' THEN
    NEW.completed_at = NOW();
  END IF;
  
  IF NEW.status = 'disputed' AND OLD.status != 'disputed' THEN
    NEW.disputed_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Attach trigger to orders table
CREATE TRIGGER order_status_timestamps
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_order_timestamps();

-- Phase 3: Create seller_profiles table for additional seller metadata
CREATE TABLE seller_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  skills TEXT[] NOT NULL DEFAULT '{}',
  portfolio_links TEXT[] NOT NULL DEFAULT '{}',
  application_notes TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  verification_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_seller_profiles_user_id FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Enable RLS on seller_profiles
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;

-- Seller profiles are viewable by everyone
CREATE POLICY "Seller profiles viewable by everyone"
  ON seller_profiles FOR SELECT
  USING (true);

-- Users can insert their own seller profile
CREATE POLICY "Users can insert own seller profile"
  ON seller_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own seller profile
CREATE POLICY "Users can update own seller profile"
  ON seller_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Add trigger for seller_profiles updated_at
CREATE TRIGGER update_seller_profiles_updated_at
  BEFORE UPDATE ON seller_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();