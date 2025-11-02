import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProStatus {
  isPro: boolean;
  expiresAt: string | null;
  daysLeft: number | null;
  proSince: string | null;
}

export const useProStatus = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['pro-status', userId],
    queryFn: async (): Promise<ProStatus> => {
      if (!userId) {
        return { isPro: false, expiresAt: null, daysLeft: null, proSince: null };
      }

      // Check subscription status
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('status, end_date')
        .eq('user_id', userId)
        .eq('plan', 'pro')
        .maybeSingle();

      if (subError) {
        console.error('Error fetching subscription:', subError);
        return { isPro: false, expiresAt: null, daysLeft: null, proSince: null };
      }

      // Check seller profile pro status
      const { data: sellerProfile } = await supabase
        .from('seller_profiles')
        .select('pro_member, pro_since')
        .eq('user_id', userId)
        .maybeSingle();

      const isPro = subscription?.status === 'active' && sellerProfile?.pro_member === true;
      const expiresAt = subscription?.end_date || null;
      
      let daysLeft: number | null = null;
      if (expiresAt) {
        const now = new Date();
        const expiry = new Date(expiresAt);
        daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      }

      return {
        isPro,
        expiresAt,
        daysLeft,
        proSince: sellerProfile?.pro_since || null,
      };
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};