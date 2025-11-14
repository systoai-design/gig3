import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    if (!user) {
      setFavorites(new Set());
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('gig_id')
        .eq('user_id', user.id);

      if (error) throw error;

      setFavorites(new Set(data?.map((f) => f.gig_id) || []));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (gigId: string) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to save favorites',
        variant: 'destructive',
      });
      return;
    }

    const isFavorited = favorites.has(gigId);

    try {
      if (isFavorited) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('gig_id', gigId);

        if (error) throw error;

        setFavorites((prev) => {
          const newSet = new Set(prev);
          newSet.delete(gigId);
          return newSet;
        });

        toast({
          title: 'Removed from favorites',
          description: 'Gig removed from your favorites',
        });
      } else {
        // Get gig details for tracking
        const { data: gigData } = await supabase
          .from('gigs')
          .select('seller_id')
          .eq('id', gigId)
          .single();

        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            gig_id: gigId,
          });

        if (error) throw error;

        setFavorites((prev) => new Set([...prev, gigId]));

        // Track analytics
        if (gigData?.seller_id) {
          const { trackGigEvent } = await import('@/lib/analytics');
          trackGigEvent(gigId, gigData.seller_id, 'favorite', user.id);
        }

        toast({
          title: 'Added to favorites',
          description: 'Gig added to your favorites',
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to update favorites',
        variant: 'destructive',
      });
    }
  };

  const isFavorited = (gigId: string) => favorites.has(gigId);

  useEffect(() => {
    fetchFavorites();

    // Subscribe to favorites changes
    if (user) {
      const channel = supabase
        .channel('favorites_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'favorites',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchFavorites();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorited,
    refreshFavorites: fetchFavorites,
  };
};
