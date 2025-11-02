import { Button } from "@/components/ui/button";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { TextReveal } from "@/components/animations/TextReveal";
import { GlassmorphicCard } from "@/components/animations/GlassmorphicCard";
import { FloatingShapes } from "@/components/animations/FloatingShapes";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { GradientMesh } from "@/components/ui/gradient-mesh";
import { motion } from "framer-motion";

export const Hero = () => {
  const navigate = useNavigate();
  const [showSpline, setShowSpline] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setShowSpline(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const popularServices = [
    { label: "Website Development", icon: "→" },
    { label: "Logo Design", icon: "→" },
    { label: "Video Editing", icon: "→" },
    { label: "AI Services", icon: "→" },
    { label: "Smart Contracts", badge: "NEW", icon: "→" },
  ];

  return (
    <section className="relative min-h-[600px] md:min-h-[800px] flex items-center justify-center overflow-hidden bg-gray-900 will-change-transform">
      {/* Enhanced 3D Background */}
      {showSpline && (
        <div className="absolute inset-0 w-full h-full" style={{ contain: 'layout paint', transform: 'translateZ(0)' }}>
          <iframe 
            src="https://my.spline.design/animatedpaperboat-U6wecpseljShuR13EAC0IwfN/" 
            frameBorder="0" 
            width="100%" 
            height="100%"
            className="w-full h-full pointer-events-none"
            title="3D Background Animation"
            loading="lazy"
            style={{ willChange: 'transform' }}
          />
        </div>
      )}
      
      {/* Gradient Mesh Overlay */}
      <GradientMesh colors={['hsl(0, 99%, 59%)', 'hsl(280, 68%, 62%)', 'hsl(212, 100%, 48%)']} />
      
      {/* Floating Shapes */}
      <FloatingShapes count={6} className="opacity-30" />
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/70 to-gray-900/90"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-20 md:py-32">
        <div className="max-w-5xl mx-auto">
          {/* Massive Typography */}
          <div className="mb-12">
            <TextReveal className="text-display-xl text-white mb-4" delay={0.2}>
              Our Creators
            </TextReveal>
            <TextReveal className="text-display-lg text-white/90 font-light" delay={0.4}>
              Will Take It From Here
            </TextReveal>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-xl md:text-2xl text-white/70 mt-6 max-w-2xl"
            >
              Discover world-class talent on the decentralized marketplace. Powered by Solana.
            </motion.p>
          </div>
          
          {/* Glassmorphic Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="max-w-3xl mx-auto mb-8"
          >
            <GlassmorphicCard blur="xl" opacity={0.15} hover={false} className="p-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Search className="h-5 w-5 text-white/50" />
                  <input
                    type="text"
                    placeholder="What service are you looking for?"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="flex-1 py-4 text-lg bg-transparent text-white placeholder:text-white/40 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        navigate('/explore');
                      }
                    }}
                  />
                </div>
                <MagneticButton
                  onClick={() => navigate('/explore')}
                  className="bg-gradient-to-r from-primary to-accent-pink hover:from-primary/90 hover:to-accent-pink/90 text-white px-8 py-4 rounded-3xl font-semibold text-lg shadow-lg"
                >
                  Search
                </MagneticButton>
              </div>
            </GlassmorphicCard>
          </motion.div>

          {/* Popular Services with Glass Effect */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-wrap gap-3 mb-16 justify-center"
          >
            <span className="text-white/60 text-sm font-medium self-center mr-2">Popular:</span>
            {popularServices.map((service, index) => (
              <motion.button
                key={service.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + index * 0.1, duration: 0.4 }}
                onClick={() => navigate(`/explore?q=${encodeURIComponent(service.label)}`)}
                className="group relative"
              >
                <GlassmorphicCard blur="md" opacity={0.1} className="px-5 py-3 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">{service.label}</span>
                    {service.badge && (
                      <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-accent-amber to-accent-pink text-white rounded-full">
                        <Sparkles className="h-3 w-3" />
                        {service.badge}
                      </span>
                    )}
                    <ArrowRight className="h-3.5 w-3.5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </GlassmorphicCard>
              </motion.button>
            ))}
          </motion.div>

          {/* Animated Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            <GlassmorphicCard blur="lg" opacity={0.08} hover={false} className="px-8 py-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { value: "10K+", label: "Creators" },
                  { value: "50K+", label: "Services" },
                  { value: "99%", label: "Satisfaction" },
                  { value: "24/7", label: "Support" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 + index * 0.1, duration: 0.4 }}
                  >
                    <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                    <div className="text-white/60 text-sm font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </GlassmorphicCard>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};
