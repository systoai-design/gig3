-- Allow buyers to view gigs they have purchased (even if not active)
CREATE POLICY "Buyers can view ordered gigs"
ON public.gigs
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.orders
    WHERE orders.gig_id = gigs.id
      AND orders.buyer_id = auth.uid()
  )
);