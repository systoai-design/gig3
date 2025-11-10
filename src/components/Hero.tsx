import { motion } from "framer-motion";
import { Search, TrendingUp, Shield, Zap, Code, Palette, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlassmorphicCard } from "./animations/GlassmorphicCard";
import { TextReveal } from "./animations/TextReveal";
import { FloatingShapes } from "./animations/FloatingShapes";
import { MagneticButton } from "./animations/MagneticButton";
import { ParticleBackground } from "./animations/ParticleBackground";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { NoiseTexture } from "./ui/noise-texture";
import { GradientMesh } from "./ui/gradient-mesh";

export const Hero = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchValue, setSearchValue] = useState("");

  const popularServices = [
    { label: "Website Development", icon: "→" },
    { label: "Logo Design", icon: "→" },
    { label: "Video Editing", icon: "→" },
    { label: "AI Services", icon: "→" },
    { label: "Smart Contracts", badge: "NEW", icon: "→" },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Animated Background Layers */}
      <div className="absolute inset-0 z-0">
        {/* Particle System with Mouse Interaction */}
        <ParticleBackground 
          particleCount={60}
          particleColor="var(--primary)"
          glowColor="var(--primary)"
          glowSize={180}
          connectionDistance={120}
        />
        
        {/* Gradient Mesh */}
        <GradientMesh className="opacity-40" animated={false} />
        
        {/* Floating Shapes */}
        <FloatingShapes count={3} />
        
        {/* Noise Texture */}
        <NoiseTexture opacity={0.03} />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-5xl mx-auto">
          {/* Massive Typography */}
          <div className="mb-12 text-center">
            <TextReveal className="text-display-xl mb-4" delay={0.2}>
              Our Freelancers
            </TextReveal>
            <TextReveal className="text-display-lg font-light" delay={0.4}>
              Will Take It From Here
            </TextReveal>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-xl md:text-2xl text-muted-foreground mt-6 max-w-2xl mx-auto"
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
                  className="bg-gradient-to-r from-primary to-accent-pink hover:from-primary/90 hover:to-accent-pink/90 text-white px-6 sm:px-8 py-4 rounded-3xl font-semibold text-base sm:text-lg shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
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
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-wrap gap-3 mb-16 justify-center"
          >
            <span className="text-muted-foreground text-sm font-medium self-center mr-2">Popular:</span>
            {popularServices.map((service, index) => (
              <motion.button
                key={service.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ 
                  y: -4,
                  scale: 1.02,
                  boxShadow: "0 8px 30px hsla(var(--primary) / 0.3)"
                }}
                transition={{ 
                  delay: 1.1 + index * 0.1, 
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                onClick={() => navigate(`/explore?q=${encodeURIComponent(service.label)}`)}
                className="group relative"
              >
                <GlassmorphicCard blur="md" opacity={0.1} className="px-5 py-3 hover:bg-accent/20 transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-sm font-medium">{service.label}</span>
                    {service.badge && (
                      <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-accent-amber to-accent-pink text-white rounded-full">
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
                    <div className="text-muted-foreground text-sm font-medium">{stat.label}</div>
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
