-- Add proof_urls column to reviews table for proof of work
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS proof_urls text[] DEFAULT '{}';

-- Make order_id nullable in messages table to allow pre-order communication
ALTER TABLE messages ALTER COLUMN order_id DROP NOT NULL;

-- Update messages RLS policies to handle nullable order_id
DROP POLICY IF EXISTS "Users can view messages in their orders" ON messages;
DROP POLICY IF EXISTS "Users can send messages in their orders" ON messages;

CREATE POLICY "Users can view their messages"
ON messages FOR SELECT
TO authenticated
USING (
  auth.uid() = sender_id OR 
  auth.uid() = receiver_id
);

CREATE POLICY "Users can send messages"
ON messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id);

-- Create storage bucket for review proofs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('review-proofs', 'review-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for review proofs storage
CREATE POLICY "Users can upload review proofs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'review-proofs');

CREATE POLICY "Review proofs are viewable by everyone"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'review-proofs');