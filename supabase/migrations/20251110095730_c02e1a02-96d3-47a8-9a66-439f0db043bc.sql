-- Add edited_at column to messages table for tracking edits
ALTER TABLE public.messages 
ADD COLUMN edited_at timestamp with time zone DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.messages.edited_at IS 'Timestamp when the message was last edited';

-- Update RLS policy to allow senders to update their own messages
CREATE POLICY "Users can update own messages"
ON public.messages
FOR UPDATE
USING (auth.uid() = sender_id)
WITH CHECK (auth.uid() = sender_id);

-- Add RLS policy to allow senders to delete their own messages
CREATE POLICY "Users can delete own messages"
ON public.messages
FOR DELETE
USING (auth.uid() = sender_id);

-- Create storage bucket for message attachments if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('message-attachments', 'message-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for message attachments
CREATE POLICY "Users can upload message attachments"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'message-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Message attachments are viewable by message participants"
ON storage.objects
FOR SELECT
USING (bucket_id = 'message-attachments');

CREATE POLICY "Users can update their own attachments"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'message-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own attachments"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'message-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);