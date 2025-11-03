-- Phase 1: Update order status enum and add tracking columns

-- Add proof_submitted status to order_status enum
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'proof_submitted';

-- Add deadline and fee tracking columns to orders
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS expected_delivery_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deadline_notified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS platform_fee_sol NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS refund_amount_sol NUMERIC,
ADD COLUMN IF NOT EXISTS dispute_resolved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS revision_requested BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS revision_notes TEXT;

-- Create function to set expected delivery date when order starts
CREATE OR REPLACE FUNCTION public.set_expected_delivery()
RETURNS TRIGGER AS $$
BEGIN
  -- When order moves to in_progress, calculate expected delivery date
  IF NEW.status = 'in_progress' AND (OLD.status IS NULL OR OLD.status = 'pending') THEN
    -- Get delivery days from gig and set expected date
    SELECT NEW.created_at + (COALESCE(g.delivery_days, 7) || ' days')::INTERVAL
    INTO NEW.expected_delivery_date
    FROM gigs g
    WHERE g.id = NEW.gig_id;
    
    -- Calculate and store platform fee (5%)
    NEW.platform_fee_sol := NEW.amount_sol * 0.05;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for expected delivery date
DROP TRIGGER IF EXISTS trigger_set_expected_delivery ON public.orders;
CREATE TRIGGER trigger_set_expected_delivery
BEFORE INSERT OR UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.set_expected_delivery();

-- Add index for deadline monitoring
CREATE INDEX IF NOT EXISTS idx_orders_expected_delivery ON public.orders(expected_delivery_date) 
WHERE status IN ('in_progress', 'proof_submitted');

-- Add index for escrow tracking
CREATE INDEX IF NOT EXISTS idx_orders_escrow_status ON public.orders(status, escrow_released) 
WHERE escrow_released = FALSE;