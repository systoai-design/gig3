-- Add new columns to profiles table for enhanced profile features
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS banner_url TEXT,
  ADD COLUMN IF NOT EXISTS tagline TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT ARRAY['English'],
  ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;

-- Add check constraint for social_links structure
ALTER TABLE public.profiles
  ADD CONSTRAINT valid_social_links CHECK (jsonb_typeof(social_links) = 'object');

-- Extend seller_profiles table with professional details
ALTER TABLE public.seller_profiles
  ADD COLUMN IF NOT EXISTS portfolio_items JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS languages_proficiency JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS response_time_hours INTEGER DEFAULT 24,
  ADD COLUMN IF NOT EXISTS completion_rate INTEGER DEFAULT 100;

-- Add constraints for seller_profiles
ALTER TABLE public.seller_profiles
  ADD CONSTRAINT valid_portfolio CHECK (jsonb_typeof(portfolio_items) = 'array'),
  ADD CONSTRAINT valid_education CHECK (jsonb_typeof(education) = 'array'),
  ADD CONSTRAINT valid_certifications CHECK (jsonb_typeof(certifications) = 'array'),
  ADD CONSTRAINT valid_completion_rate CHECK (completion_rate >= 0 AND completion_rate <= 100);

-- Create profile-media storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-media',
  'profile-media',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for profile-media bucket
CREATE POLICY "Users can upload own profile media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-media' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own profile media"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-media' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own profile media"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-media' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Profile media is publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-media');

-- Backfill existing rows with default values
UPDATE public.profiles
SET
  languages = ARRAY['English'],
  social_links = '{}'::jsonb
WHERE languages IS NULL OR social_links IS NULL;

UPDATE public.seller_profiles
SET
  portfolio_items = '[]'::jsonb,
  education = '[]'::jsonb,
  certifications = '[]'::jsonb,
  languages_proficiency = '{}'::jsonb
WHERE portfolio_items IS NULL OR education IS NULL;