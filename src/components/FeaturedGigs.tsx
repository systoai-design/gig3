import { Badge } from "@/components/ui/badge";
import { Star, PackageOpen, ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { HoverTilt } from "@/components/animations/HoverTilt";
import { GlassmorphicCard } from "@/components/animations/GlassmorphicCard";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProBadge } from "@/components/ProBadge";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreatorRegistration } from "@/hooks/useCreatorRegistration";

interface Gig {
  id: string;
  title: string;
  price_sol: number;
  category: string;
  images: string[];
  seller_id: string;
  profiles?: {
    username: string;
    avatar_url: string | null;
    name: string | null;
  } | null;
  seller_profiles?: {
    pro_member: boolean;
    pro_since: string | null;
  } | null;
  avg_rating?: number;
  review_count?: number;
}

interface FeaturedGigsProps {
  onOpenAuthDialog?: () => void;
}

export const FeaturedGigs = ({ onOpenAuthDialog }: FeaturedGigsProps) => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { handleBecomeCreator } = useCreatorRegistration();

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      // Fetch gigs with seller profiles for creator info
      const { data: gigsData, error: gigsError } = await supabase
        .from('gigs')
        .select(`
          *,
          profiles:seller_id (
            username,
            avatar_url,
            name
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(8);

      if (gigsError) throw gigsError;

      // Fetch seller profiles for PRO badge in one query
      const sellerIds = (gigsData || []).map(g => g.seller_id);
      const { data: profilesData } = await supabase
        .from('seller_profiles')
        .select('user_id, pro_member, pro_since')
        .in('user_id', sellerIds);

      const profilesMap = new Map(
        (profilesData || []).map(p => [p.user_id, p])
      );

      // Fetch reviews for ratings
      const gigsWithReviews = await Promise.all(
        (gigsData || []).map(async (gig) => {
          const { data: reviews } = await supabase
            .from('reviews')
            .select('rating')
            .eq('reviewee_id', gig.seller_id);

          const avgRating = reviews && reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

          return {
            ...gig,
            seller_profiles: profilesMap.get(gig.seller_id) || null,
            avg_rating: avgRating,
            review_count: reviews?.length || 0,
          };
        })
      );
      
      setGigs(gigsWithReviews as Gig[]);
    } catch (error) {
      console.error('Error fetching gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-16">
            <div>
              <Skeleton className="h-12 w-64 mb-3" />
              <Skeleton className="h-6 w-96" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="space-y-3 px-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-9 w-20 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (gigs.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <PackageOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-4">
              No Services Available Yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Be the first to create a service and start offering your expertise!
            </p>
            <MagneticButton 
              onClick={() => handleBecomeCreator(onOpenAuthDialog)}
              className="bg-gradient-to-r from-primary to-accent-cyan text-white px-8 py-4 rounded-full font-semibold"
            >
              Become a Creator
            </MagneticButton>
          </div>
        </div>
      </section>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-16"
        >
          <div>
            <h2 className="text-display-md gradient-text mb-3">
              Featured Services
            </h2>
            <p className="text-muted-foreground text-lg">
              Top-rated services from our talented creator community
            </p>
          </div>
          <motion.button
            whileHover={{ x: 5 }}
            onClick={() => navigate('/explore')}
            className="hidden md:flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-300"
          >
            View All
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </motion.div>

        {/* Masonry-style Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {gigs.map((gig) => (
            <motion.div key={gig.id} variants={item}>
              <HoverTilt intensity={8} scale={1.03}>
                <GlassmorphicCard
                  blur="sm"
                  opacity={0.03}
                  hover={false}
                  className="overflow-hidden cursor-pointer group h-full"
                >
                  <div onClick={() => navigate(`/gig/${gig.id}`)}>
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      {gig.images && gig.images.length > 0 ? (
                        <img
                          src={gig.images[0]}
                          alt={gig.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PackageOpen className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      
                      {/* Floating Category Badge */}
                      <div className="absolute top-3 left-3">
                        <AnimatedBadge className="glass-dark text-white text-xs backdrop-blur-md">
                          {gig.category}
                        </AnimatedBadge>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5">
                      {/* Creator Info */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-cyan overflow-hidden flex items-center justify-center">
                          {gig.profiles?.avatar_url ? (
                            <img 
                              src={gig.profiles.avatar_url} 
                              alt={gig.profiles.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-xs font-semibold">
                              {gig.profiles?.username?.[0]?.toUpperCase() || 'U'}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-foreground truncate block">
                            {gig.profiles?.name || gig.profiles?.username || 'Anonymous'}
                          </span>
                          {(gig.review_count || 0) > 0 && (
                            <div className="flex items-center gap-1 text-xs">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{(gig.avg_rating || 0).toFixed(1)}</span>
                              <span className="text-muted-foreground">({gig.review_count})</span>
                            </div>
                          )}
                        </div>
                        {gig.seller_profiles?.pro_member && (
                          <AnimatedBadge glow pulse className="bg-gradient-to-r from-accent-blue to-accent-cyan text-white text-xs flex-shrink-0">
                            PRO
                          </AnimatedBadge>
                        )}
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-bold text-foreground mb-4 line-clamp-2 group-hover:gradient-text transition-all duration-300 text-lg">
                        {gig.title}
                      </h3>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Starting at</p>
                          <p className="text-xl font-bold gradient-text">{gig.price_sol} SOL</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/gig/${gig.id}`);
                          }}
                          className="bg-gradient-to-r from-primary to-accent-cyan text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:scale-105 transition-transform"
                        >
                          View
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassmorphicCard>
              </HoverTilt>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
