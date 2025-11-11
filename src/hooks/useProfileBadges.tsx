import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Badge {
  type: string;
  label: string;
  description: string;
  icon: string;
  threshold: number;
  perk?: string;
}

export const BADGES: Badge[] = [
  {
    type: "profile_starter",
    label: "Profile Starter",
    description: "Complete your first profile section",
    icon: "🌱",
    threshold: 20,
    perk: "Visibility boost in search"
  },
  {
    type: "halfway_hero",
    label: "Halfway Hero",
    description: "Complete 50% of your profile",
    icon: "⭐",
    threshold: 50,
    perk: "Featured in recommendations"
  },
  {
    type: "almost_there",
    label: "Almost There",
    description: "Complete 75% of your profile",
    icon: "🔥",
    threshold: 75,
    perk: "Priority customer support"
  },
  {
    type: "profile_master",
    label: "Profile Master",
    description: "Complete 100% of your profile",
    icon: "👑",
    threshold: 100,
    perk: "Premium profile badge + 10% commission discount"
  },
];

export const useProfileBadges = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: earnedBadges = [], isLoading } = useQuery({
    queryKey: ['profile-badges', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('profile_badges')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  const awardBadge = useMutation({
    mutationFn: async ({ userId, badgeType }: { userId: string; badgeType: string }) => {
      const { data, error } = await supabase
        .from('profile_badges')
        .insert({ user_id: userId, badge_type: badgeType })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile-badges', variables.userId] });
      const badge = BADGES.find(b => b.type === variables.badgeType);
      if (badge) {
        toast.success(`🎉 Badge Earned: ${badge.label}!`, {
          description: badge.perk ? `Perk unlocked: ${badge.perk}` : badge.description,
          duration: 5000,
        });
      }
    },
  });

  const checkAndAwardBadges = async (userId: string, completionPercent: number) => {
    const eligibleBadges = BADGES.filter(b => completionPercent >= b.threshold);
    const earnedTypes = earnedBadges.map(eb => eb.badge_type);
    
    for (const badge of eligibleBadges) {
      if (!earnedTypes.includes(badge.type)) {
        await awardBadge.mutateAsync({ userId, badgeType: badge.type });
      }
    }
  };

  const getNextBadge = (completionPercent: number) => {
    return BADGES.find(b => completionPercent < b.threshold);
  };

  const earnedBadgeTypes = earnedBadges.map(eb => eb.badge_type);
  const badgesWithStatus = BADGES.map(badge => ({
    ...badge,
    earned: earnedBadgeTypes.includes(badge.type),
    earnedAt: earnedBadges.find(eb => eb.badge_type === badge.type)?.earned_at,
  }));

  return {
    badges: badgesWithStatus,
    earnedBadges,
    isLoading,
    checkAndAwardBadges,
    getNextBadge,
  };
};
