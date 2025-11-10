-- Drop foreign keys that point to auth.users (except profiles.id which is correct)
ALTER TABLE orders 
  DROP CONSTRAINT IF EXISTS orders_buyer_id_fkey,
  DROP CONSTRAINT IF EXISTS orders_seller_id_fkey;

ALTER TABLE reviews 
  DROP CONSTRAINT IF EXISTS reviews_reviewer_id_fkey,
  DROP CONSTRAINT IF EXISTS reviews_reviewee_id_fkey;

ALTER TABLE messages 
  DROP CONSTRAINT IF EXISTS messages_sender_id_fkey,
  DROP CONSTRAINT IF EXISTS messages_receiver_id_fkey;

ALTER TABLE subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_user_id_fkey;

ALTER TABLE escrow_transactions
  DROP CONSTRAINT IF EXISTS escrow_transactions_approved_by_fkey;

ALTER TABLE user_roles
  DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;

-- Recreate foreign keys pointing to profiles table instead
ALTER TABLE orders 
  ADD CONSTRAINT orders_buyer_id_fkey 
  FOREIGN KEY (buyer_id) REFERENCES profiles(id) ON DELETE CASCADE,
  ADD CONSTRAINT orders_seller_id_fkey 
  FOREIGN KEY (seller_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE reviews 
  ADD CONSTRAINT reviews_reviewer_id_fkey 
  FOREIGN KEY (reviewer_id) REFERENCES profiles(id) ON DELETE CASCADE,
  ADD CONSTRAINT reviews_reviewee_id_fkey 
  FOREIGN KEY (reviewee_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE messages 
  ADD CONSTRAINT messages_sender_id_fkey 
  FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE,
  ADD CONSTRAINT messages_receiver_id_fkey 
  FOREIGN KEY (receiver_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE escrow_transactions
  ADD CONSTRAINT escrow_transactions_approved_by_fkey
  FOREIGN KEY (approved_by) REFERENCES profiles(id) ON DELETE SET NULL;

ALTER TABLE user_roles
  ADD CONSTRAINT user_roles_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;