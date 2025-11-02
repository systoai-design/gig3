-- Add escrow and proof of work columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS escrow_account TEXT DEFAULT 'BBRKYbrTZc1toK1R7E4WeZWiiAhY4vNJSaW4Bd3uiPgR';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS proof_description TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS proof_files TEXT[] DEFAULT '{}';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS escrow_released BOOLEAN DEFAULT FALSE;

-- Add new order statuses for proof workflow
DO $$ BEGIN
    ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'awaiting_proof';
    ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'proof_submitted';
    ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'approved_for_release';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create escrow transactions table for audit trail
CREATE TABLE IF NOT EXISTS escrow_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) NOT NULL,
  amount_sol NUMERIC NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'release', 'refund')),
  transaction_signature TEXT,
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on escrow_transactions
ALTER TABLE escrow_transactions ENABLE ROW LEVEL SECURITY;

-- Admins can manage escrow
CREATE POLICY "Admins can manage escrow" ON escrow_transactions
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Users can view their own escrow transactions
CREATE POLICY "Users can view own escrow" ON escrow_transactions
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders 
      WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
    )
  );