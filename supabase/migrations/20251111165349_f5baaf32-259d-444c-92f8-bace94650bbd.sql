-- Create profile badges table
CREATE TABLE public.profile_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_type)
);

-- Enable RLS
ALTER TABLE public.profile_badges ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view all badges"
  ON public.profile_badges
  FOR SELECT
  USING (true);

CREATE POLICY "System can insert badges"
  ON public.profile_badges
  FOR INSERT
  WITH CHECK (true);

-- Create index for performance
CREATE INDEX idx_profile_badges_user_id ON public.profile_badges(user_id);