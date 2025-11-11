import { motion } from "framer-motion";
import { Search, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlassmorphicCard } from "./animations/GlassmorphicCard";
import { TextReveal } from "./animations/TextReveal";
import { MagneticButton } from "./animations/MagneticButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect, startTransition } from "react";
import { NoiseTexture } from "./ui/noise-texture";
import { GradientMesh } from "./ui/gradient-mesh";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "./ui/skeleton";

const CACHE_KEY = 'hero_stats_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const Hero = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    creators: 0,
    services: 0,
    avgRating: 0,
    reviewCount: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setStats(data);
            setLoading(false);
            return;
          }
        }

        // Use aggregation for better performance
        const [totalUsersRes, creatorsRes, servicesRes, reviewsRes] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('seller_profiles').select('user_id', { count: 'exact', head: true }),
          supabase.from('gigs').select('id', { count: 'exact', head: true }).eq('status', 'active'),
          supabase.from('reviews').select('rating')
        ]);

        const totalUsers = totalUsersRes.count || 0;
        const creators = creatorsRes.count || 0;
        const services = servicesRes.count || 0;
        const reviews = reviewsRes.data || [];
        const avgRating = reviews.length > 0 
          ? Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
          : 0;

        const newStats = {
          totalUsers,
          creators,
          services,
          avgRating,
          reviewCount: reviews.length
        };

        // Update state with low priority
        startTransition(() => {
          setStats(newStats);
          setLoading(false);
        });

        // Cache the results
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: newStats,
          timestamp: Date.now()
        }));
      } catch (err) {
        console.error('Error fetching stats:', err);
        // Show fallback stats on error
        setStats({
          totalUsers: 1000,
          creators: 250,
          services: 500,
          avgRating: 5,
          reviewCount: 1000
        });
        setLoading(false);
      }
    };

    // Defer stats loading to prioritize critical content
    const timer = setTimeout(fetchStats, 300);
    return () => clearTimeout(timer);
  }, []);

  const popularServices = [
    { label: "Website Development", icon: "→", borderColor: "border-black dark:border-white" },
    { label: "Logo Design", icon: "→", borderColor: "border-black dark:border-white" },
    { label: "Video Editing", icon: "→", borderColor: "border-black dark:border-white" },
    { label: "AI Services", icon: "→", borderColor: "border-black dark:border-white" },
    { label: "Smart Contracts", badge: "NEW", icon: "→", borderColor: "border-black dark:border-white" },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Simplified Background */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Mesh */}
        <GradientMesh className="opacity-30" animated={true} />
        
        {/* Noise Texture */}
        <NoiseTexture opacity={0.02} />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-5xl mx-auto">
          {/* Massive Typography */}
          <div className="mb-12 text-center">
            <TextReveal className="text-display-xl mb-4" delay={0.1}>
              Our Freelancers
            </TextReveal>
            <TextReveal className="text-display-lg font-light" delay={0.2}>
              Will Take It From Here
            </TextReveal>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-xl md:text-2xl text-muted-foreground mt-6 max-w-2xl mx-auto"
            >
              Discover world-class talent on the decentralized marketplace. Powered by Solana.
            </motion.p>
          </div>
          
          {/* Glassmorphic Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-3xl mx-auto mb-8"
          >
            <GlassmorphicCard blur="xl" opacity={0.15} hover={false} className="p-2 border-2 border-primary/70 dark:border-primary/60">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate('/explore');
                }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
              >
                <div className="flex-1 flex items-center gap-3 px-4 min-w-0">
                  <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="What service are you looking for?"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="flex-1 py-4 text-base sm:text-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none min-w-0"
                  />
                </div>
                <MagneticButton
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate('/explore');
                  }}
                  className="bg-gradient-to-r from-primary to-accent-cyan hover:from-primary/90 hover:to-accent-cyan/90 text-white px-6 sm:px-8 py-4 rounded-3xl font-semibold text-base sm:text-lg shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {isMobile ? (
                    <>
                      <Search className="h-5 w-5" />
                      <span>Search</span>
                    </>
                  ) : (
                    "Search"
                  )}
                </MagneticButton>
              </form>
            </GlassmorphicCard>
          </motion.div>

          {/* Popular Services with Glass Effect */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-wrap gap-3 mb-16 justify-center"
          >
            <span className="text-muted-foreground text-sm font-medium self-center mr-2">Popular:</span>
            {popularServices.map((service, index) => (
              <motion.button
                key={service.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ 
                  y: -2,
                  scale: 1.02,
                  boxShadow: "0 8px 30px hsla(var(--primary) / 0.3)",
                  transition: { duration: 0.2, type: "spring", stiffness: 400, damping: 30 }
                }}
                transition={{ 
                  delay: 0.6 + index * 0.05, 
                  duration: 0.3,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                onClick={() => navigate(`/explore?q=${encodeURIComponent(service.label)}`)}
                className="group relative"
              >
                <GlassmorphicCard blur="md" opacity={0.1} className={`px-5 py-3 hover:bg-accent/20 transition-all duration-300 border-2 ${service.borderColor}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-sm font-medium">{service.label}</span>
                    {service.badge && (
                      <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-accent-blue to-accent-cyan text-white rounded-full">
                        <TrendingUp className="h-3 w-3" />
                        {service.badge}
                      </span>
                    )}
                  </div>
                </GlassmorphicCard>
              </motion.button>
            ))}
          </motion.div>

          {/* Animated Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <GlassmorphicCard blur="lg" opacity={0.08} hover={false} className="px-8 py-6 border-2 border-primary/50 dark:border-primary/40">
              {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 text-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <Skeleton className="h-10 w-20 mb-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 text-center">
                  {[
                    { 
                      value: stats.totalUsers > 0 ? `${stats.totalUsers.toLocaleString()}${stats.totalUsers >= 1000 ? '+' : ''}` : '0', 
                      label: "Users" 
                    },
                    { 
                      value: stats.creators > 0 ? `${stats.creators.toLocaleString()}${stats.creators >= 1000 ? '+' : ''}` : '0', 
                      label: "Creators" 
                    },
                    { 
                      value: stats.services > 0 ? `${stats.services.toLocaleString()}${stats.services >= 1000 ? '+' : ''}` : '0', 
                      label: "Services" 
                    },
                    { 
                      value: stats.reviewCount > 0 ? `${stats.avgRating}★` : 'New', 
                      label: "Satisfaction" 
                    },
                    { 
                      value: "24/7", 
                      label: "Support" 
                    }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.04, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                      <div className="text-muted-foreground text-sm font-medium">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              )}
            </GlassmorphicCard>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};
