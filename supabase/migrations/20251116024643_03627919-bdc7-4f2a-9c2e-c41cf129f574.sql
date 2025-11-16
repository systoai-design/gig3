-- Fix search_path for get_public_statistics function
CREATE OR REPLACE FUNCTION get_public_statistics()
RETURNS TABLE (
  gigs_available bigint,
  talented_creators bigint,
  projects_completed bigint,
  average_rating numeric
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT 
    (SELECT COUNT(*) FROM gigs WHERE status = 'active'),
    (SELECT COUNT(DISTINCT user_id) FROM seller_profiles),
    (SELECT COUNT(*) FROM orders WHERE status = 'completed'),
    (SELECT COALESCE(AVG(rating), 0) FROM reviews);
$$;