-- Fix User Roles RLS Policy to allow users to become sellers
DROP POLICY IF EXISTS "Only admins can manage roles" ON user_roles;

-- Allow users to insert their own seller/buyer roles
CREATE POLICY "Users can create own seller/buyer roles"
ON user_roles FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND role IN ('seller', 'buyer')
);

-- Allow admins to manage all roles
CREATE POLICY "Admins can manage all roles"
ON user_roles FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Verify and recreate the foreign key for gigs.seller_id
ALTER TABLE gigs DROP CONSTRAINT IF EXISTS gigs_seller_id_fkey;

ALTER TABLE gigs 
ADD CONSTRAINT gigs_seller_id_fkey 
FOREIGN KEY (seller_id) 
REFERENCES profiles(id) 
ON DELETE CASCADE;