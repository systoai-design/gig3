import { supabase } from '@/integrations/supabase/client';

export type AnalyticsEventType = 'view' | 'click' | 'add_to_cart' | 'favorite';

/**
 * Track analytics events for gigs
 * Silent failure - doesn't disrupt UX if tracking fails
 */
export const trackGigEvent = async (
  gigId: string,
  sellerId: string,
  eventType: AnalyticsEventType,
  userId?: string
) => {
  try {
    await supabase.from('gig_analytics').insert({
      gig_id: gigId,
      seller_id: sellerId,
      event_type: eventType,
      user_id: userId || null,
    });
  } catch (error) {
    // Silent failure - don't disrupt user experience
    console.error('Analytics tracking error:', error);
  }
};
