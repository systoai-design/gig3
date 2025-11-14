-- Create gig_analytics table for tracking views, clicks, favorites, etc.
CREATE TABLE IF NOT EXISTS public.gig_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gig_id UUID NOT NULL REFERENCES public.gigs(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click', 'add_to_cart', 'favorite')),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for fast queries
CREATE INDEX idx_gig_analytics_gig_id ON public.gig_analytics(gig_id);
CREATE INDEX idx_gig_analytics_seller_id ON public.gig_analytics(seller_id);
CREATE INDEX idx_gig_analytics_created_at ON public.gig_analytics(created_at);
CREATE INDEX idx_gig_analytics_event_type ON public.gig_analytics(event_type);

-- Enable Row Level Security
ALTER TABLE public.gig_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert analytics (for tracking)
CREATE POLICY "Anyone can insert analytics"
ON public.gig_analytics
FOR INSERT
TO public
WITH CHECK (true);

-- Sellers can view their own analytics
CREATE POLICY "Sellers can view own analytics"
ON public.gig_analytics
FOR SELECT
USING (seller_id = auth.uid());

-- Admins can view all analytics
CREATE POLICY "Admins can view all analytics"
ON public.gig_analytics
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));