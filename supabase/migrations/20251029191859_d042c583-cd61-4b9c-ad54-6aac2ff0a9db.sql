-- Create storage bucket for gig images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gig-images',
  'gig-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- RLS policy for authenticated users to upload images
CREATE POLICY "Authenticated users can upload gig images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gig-images');

-- RLS policy for public read access
CREATE POLICY "Gig images are publicly accessible"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'gig-images');

-- RLS policy for users to update their own images
CREATE POLICY "Users can update their own gig images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'gig-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- RLS policy for users to delete their own images
CREATE POLICY "Users can delete their own gig images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'gig-images' AND auth.uid()::text = (storage.foldername(name))[1]);