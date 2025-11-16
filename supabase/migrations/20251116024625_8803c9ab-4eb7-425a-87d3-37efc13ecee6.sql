-- Create a function that returns aggregate statistics for public display
-- SECURITY DEFINER allows it to bypass RLS policies safely
CREATE OR REPLACE FUNCTION get_public_statistics()
RETURNS TABLE (
  gigs_available bigint,
  talented_creators bigint,
  projects_completed bigint,
  average_rating numeric
) 
SECURITY DEFINER
LANGUAGE sql
AS $$
  SELECT 
    (SELECT COUNT(*) FROM gigs WHERE status = 'active'),
    (SELECT COUNT(DISTINCT user_id) FROM seller_profiles),
    (SELECT COUNT(*) FROM orders WHERE status = 'completed'),
    (SELECT COALESCE(AVG(rating), 0) FROM reviews);
$$;

-- Grant execute permission to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION get_public_statistics() TO anon;
GRANT EXECUTE ON FUNCTION get_public_statistics() TO authenticated;