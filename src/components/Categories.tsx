import { Code, Palette, Video, Megaphone, Music, PenTool, Sparkles, Briefcase, Users, Languages, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HoverTilt } from "@/components/animations/HoverTilt";
import { GlassmorphicCard } from "@/components/animations/GlassmorphicCard";
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { GradientMesh } from "@/components/ui/gradient-mesh";
import { NoiseTexture } from "@/components/ui/noise-texture";
import { useState } from "react";

const categories = [
  { name: "Programming & Tech", icon: Code, gradient: "from-accent-blue to-accent-cyan", count: 1234, trending: true },
  { name: "Graphics & Design", icon: Palette, gradient: "from-accent-cyan to-accent-purple", count: 856, trending: false },
  { name: "Digital Marketing", icon: Megaphone, gradient: "from-accent-amber to-primary", count: 643, trending: false },
  { name: "AI Services", icon: Sparkles, gradient: "from-accent-purple to-accent-blue", count: 943, trending: true },
  { name: "Video & Animation", icon: Video, gradient: "from-primary to-accent-cyan", count: 721, trending: false },
  { name: "Writing & Translation", icon: Languages, gradient: "from-accent-cyan to-accent-blue", count: 521, trending: false },
  { name: "Music & Audio", icon: Music, gradient: "from-accent-amber to-accent-cyan", count: 412, trending: false },
  { name: "Business", icon: Users, gradient: "from-accent-blue to-accent-purple", count: 589, trending: true },
  { name: "Consulting", icon: Briefcase, gradient: "from-accent-purple to-accent-blue", count: 367, trending: false },
];

export const Categories = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as const
      }
    }
  };

  const CategoryCard = ({ category, index }: { category: typeof categories[0], index: number }) => {
    const Icon = category.icon;
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <HoverTilt intensity={15} scale={1.05}>
        <GlassmorphicCard
          blur="sm"
          opacity={0.05}
          variant="light"
          className="h-[200px] cursor-pointer overflow-hidden group relative border-2 hover:border-primary/50 dark:hover:border-primary/60 transition-all duration-500 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.25),0_0_40px_rgba(var(--primary),0.2)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(var(--primary),0.3)]"
        >
          <button
            onClick={() => navigate('/explore')}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full h-full p-6 flex flex-col justify-between relative"
          >
            {/* Trending Badge - Top Left */}
            {category.trending && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-accent-amber to-primary text-white text-xs font-semibold shadow-lg"
              >
                <TrendingUp className="w-3 h-3" />
                <span>Trending</span>
              </motion.div>
            )}

            {/* Service Count Badge - Top Right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full backdrop-blur-md bg-background/80 border border-border/50 text-xs font-semibold text-muted-foreground shadow-lg"
            >
              {category.count.toLocaleString()}
            </motion.div>
            
            {/* Gradient Background - Enhanced */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${category.gradient} transition-opacity duration-500`}
              animate={{ opacity: isHovered ? 0.15 : 0 }}
            />
            
            {/* Shimmer Effect on Hover */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)`,
                backgroundSize: '200% 100%',
              }}
              animate={isHovered ? {
                backgroundPosition: ['0% 0%', '200% 0%'],
              } : {}}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Icon - Enhanced Animation */}
            <div className="relative z-10">
              <motion.div
                whileHover={{ 
                  rotate: [0, -10, 10, 0], 
                  scale: 1.2,
                  rotateY: 10
                }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 300 }}
                className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${category.gradient} p-3 md:p-4 shadow-lg group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-shadow duration-300`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Icon className="w-full h-full text-white" />
              </motion.div>
            </div>
            
            {/* Title - Enhanced */}
            <motion.h3
              className={`text-sm md:text-base font-bold text-left mt-auto relative z-10 transition-all duration-300 ${
                isHovered ? 'gradient-text' : 'text-foreground'
              }`}
            >
              {category.name}
            </motion.h3>
          </button>
        </GlassmorphicCard>
      </HoverTilt>
    );
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background - Match Hero pattern */}
      <div className="absolute inset-0 z-0">
        <GradientMesh 
          colors={[
            'hsl(212, 100%, 48%)',
            'hsl(200, 100%, 55%)',
            'hsl(180, 77%, 52%)'
          ]}
          className="opacity-30" 
          animated={true} 
        />
        <NoiseTexture opacity={0.02} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 to-transparent pointer-events-none z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-display-md gradient-text mb-4">
            Explore Categories
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover talented creators across every category imaginable
          </p>
        </motion.div>

        {isMobile ? (
          /* Mobile: Swipeable Carousel */
          <Carousel
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-4">
              {categories.map((category, index) => (
                <CarouselItem key={category.name} className="pl-4 basis-[85%] sm:basis-1/2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                  >
                    <CategoryCard category={category} index={index} />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          /* Desktop: Grid Layout */
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                variants={item}
                className="w-full"
              >
                <CategoryCard category={category} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};
