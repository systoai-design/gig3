-- Add transaction_signature field to orders table
ALTER TABLE public.orders 
ADD COLUMN transaction_signature text;

-- Add index for faster lookups
CREATE INDEX idx_orders_transaction_signature ON public.orders(transaction_signature);