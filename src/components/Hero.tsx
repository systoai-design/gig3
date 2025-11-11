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

const CACHE_KEY = 'hero_stats_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const Hero = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchValue, setSearchValue] = useState("");
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
      }
    };

    // Defer stats loading to prioritize critical content
    const timer = setTimeout(fetchStats, 300);
    return () => clearTimeout(timer);
  }, []);

  const popularServices = [
    { label: "Website Development", icon: "→", borderColor: "border-accent-blue/70" },
    { label: "Logo Design", icon: "→", borderColor: "border-accent-purple/70" },
    { label: "Video Editing", icon: "→", borderColor: "border-accent-pink/70" },
    { label: "AI Services", icon: "→", borderColor: "border-accent-amber/70" },
    { label: "Smart Contracts", badge: "NEW", icon: "→", borderColor: "border-accent-cyan/80" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20">
      {/* Ultra-minimal Background */}
      <NoiseTexture opacity={0.015} />
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-32 md:py-40 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-12 md:space-y-16">
          {/* Hero Text - Apple style: lighter weight, more dramatic */}
          <TextReveal delay={0.05}>
            <h1 className="text-display-xl mb-8 leading-tight tracking-tight">
              <span className="gradient-text">Hire Top Creators.</span><br/>
              <span className="text-foreground/90">Pay with Crypto.</span>
            </h1>
          </TextReveal>
          
          <TextReveal delay={0.1}>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              Secure freelance marketplace powered by Solana blockchain.<br className="hidden md:block" />
              Smart escrow. Instant payments. Zero fraud.
            </p>
          </TextReveal>
          
          {/* Search Bar - cleaner, more Apple-like */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.15 }}
            className="max-w-2xl mx-auto"
          >
            <form onSubmit={(e) => {
              e.preventDefault();
              if (searchValue.trim()) navigate(`/explore?q=${encodeURIComponent(searchValue.trim())}`);
            }} className="relative group">
              <div className="bg-muted/50 dark:bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-md hover:shadow-lg hover:border-border transition-all duration-300">
                <div className="flex items-center gap-3 p-3">
                  <Search className="h-5 w-5 text-muted-foreground ml-2" />
                  <input
                    type="text"
                    placeholder="What service are you looking for?"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="flex-1 border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground outline-none rounded-2xl py-2"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold shadow-sm hover:shadow-md transition-shadow whitespace-nowrap"
                  >
                    Search
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Popular Services Tags - simpler pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <span className="text-sm text-muted-foreground font-medium">Popular:</span>
            {popularServices.map((service, index) => (
              <motion.button
                key={service.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.25 + index * 0.02,
                  type: "spring",
                  stiffness: 150
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/explore?q=${encodeURIComponent(service.label)}`)}
                className="px-4 py-2 rounded-full text-sm font-medium bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors duration-200"
              >
                {service.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Stats Section - larger numbers, cleaner layout */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16 max-w-5xl mx-auto pt-12 border-t border-border/30"
            >
              {[
                { label: 'Active Users', value: stats.totalUsers.toLocaleString() + '+' },
                { label: 'Creators', value: stats.creators.toLocaleString() + '+' },
                { label: 'Services', value: stats.services.toLocaleString() + '+' },
                { label: 'Avg Rating', value: stats.avgRating.toFixed(1), suffix: '/5' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: 0.35 + index * 0.03,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="text-center space-y-2"
                >
                  <div className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
