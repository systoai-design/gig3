-- Create subscription plan enum
CREATE TYPE subscription_plan AS ENUM ('free', 'pro');

-- Create subscription status enum  
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'pending');

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan subscription_plan NOT NULL DEFAULT 'free',
  status subscription_status NOT NULL DEFAULT 'pending',
  amount_sol NUMERIC NOT NULL,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  transaction_signature TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, plan)
);

-- Enable RLS on subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscriptions"
ON public.subscriptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create subscriptions"
ON public.subscriptions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create subscription payments history table
CREATE TABLE public.subscription_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE NOT NULL,
  amount_sol NUMERIC NOT NULL,
  transaction_signature TEXT NOT NULL,
  payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL
);

-- Enable RLS on subscription_payments
ALTER TABLE public.subscription_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policy for subscription payments
CREATE POLICY "Users can view own payment history"
ON public.subscription_payments FOR SELECT
TO authenticated
USING (
  subscription_id IN (
    SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
  )
);

-- Add pro_member columns to seller_profiles
ALTER TABLE public.seller_profiles 
ADD COLUMN pro_member BOOLEAN DEFAULT FALSE,
ADD COLUMN pro_since TIMESTAMPTZ;

-- Create function to update pro status when subscription changes
CREATE OR REPLACE FUNCTION public.update_pro_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'active' AND NEW.plan = 'pro' THEN
    UPDATE public.seller_profiles 
    SET pro_member = TRUE, pro_since = NEW.start_date
    WHERE user_id = NEW.user_id;
  ELSIF NEW.status IN ('cancelled', 'expired') THEN
    UPDATE public.seller_profiles 
    SET pro_member = FALSE
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for automatic Pro status updates
CREATE TRIGGER on_subscription_status_change
AFTER INSERT OR UPDATE OF status ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_pro_status();

-- Add trigger for updated_at on subscriptions
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add is_pro_only column to gigs table
ALTER TABLE public.gigs 
ADD COLUMN is_pro_only BOOLEAN DEFAULT FALSE;

-- Create indexes for performance
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_end_date ON public.subscriptions(end_date);
CREATE INDEX idx_seller_profiles_pro_member ON public.seller_profiles(pro_member);
CREATE INDEX idx_gigs_is_pro_only ON public.gigs(is_pro_only);