-- Enable full replica identity for messages table to capture complete row data
ALTER TABLE public.messages REPLICA IDENTITY FULL;