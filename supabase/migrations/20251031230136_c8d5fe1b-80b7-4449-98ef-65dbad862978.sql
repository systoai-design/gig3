-- Add packages support to gigs table
ALTER TABLE gigs 
ADD COLUMN IF NOT EXISTS packages JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS has_packages BOOLEAN DEFAULT false;

-- Add comment for the packages column structure
COMMENT ON COLUMN gigs.packages IS 'Array of package objects: [{name: string, description: string, price_sol: number, delivery_days: number, revisions: number, features: string[]}]';

-- Update existing gigs to have a basic package if they don't have packages
UPDATE gigs 
SET 
  packages = jsonb_build_array(
    jsonb_build_object(
      'name', 'Basic',
      'description', 'Standard package',
      'price_sol', price_sol,
      'delivery_days', delivery_days,
      'revisions', 2,
      'features', ARRAY['All basic features', 'Source files included']
    )
  ),
  has_packages = false
WHERE packages = '[]'::jsonb OR packages IS NULL;