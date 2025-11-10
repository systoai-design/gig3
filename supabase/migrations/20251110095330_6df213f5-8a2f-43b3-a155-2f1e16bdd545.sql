-- Add read_at column to messages table for read receipts
ALTER TABLE public.messages 
ADD COLUMN read_at timestamp with time zone DEFAULT NULL;

-- Create index for performance when querying unread messages
CREATE INDEX idx_messages_read_at ON public.messages(receiver_id, read_at) 
WHERE read_at IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.messages.read_at IS 'Timestamp when the message was read by the recipient';

-- Ensure users can update read_at for messages they receive
CREATE POLICY "Users can mark received messages as read"
ON public.messages
FOR UPDATE
USING (auth.uid() = receiver_id)
WITH CHECK (auth.uid() = receiver_id);