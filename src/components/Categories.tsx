import { Code, Palette, Video, Megaphone, Music, PenTool, Sparkles, Briefcase, Users, Languages } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HoverTilt } from "@/components/animations/HoverTilt";
import { GlassmorphicCard } from "@/components/animations/GlassmorphicCard";
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";

const categories = [
  { name: "Programming & Tech", icon: Code, gradient: "from-accent-blue to-accent-cyan" },
  { name: "Graphics & Design", icon: Palette, gradient: "from-accent-cyan to-accent-purple" },
  { name: "Digital Marketing", icon: Megaphone, gradient: "from-accent-amber to-primary" },
  { name: "AI Services", icon: Sparkles, gradient: "from-accent-purple to-accent-blue" },
  { name: "Video & Animation", icon: Video, gradient: "from-primary to-accent-cyan" },
  { name: "Writing & Translation", icon: Languages, gradient: "from-accent-cyan to-accent-blue" },
  { name: "Music & Audio", icon: Music, gradient: "from-accent-amber to-accent-cyan" },
  { name: "Business", icon: Users, gradient: "from-accent-blue to-accent-purple" },
  { name: "Consulting", icon: Briefcase, gradient: "from-accent-purple to-accent-blue" },
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
    
    return (
      <motion.button
        onClick={() => navigate('/explore')}
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full h-[200px] cursor-pointer overflow-hidden group relative rounded-2xl bg-card border border-border hover:border-border/80 hover:shadow-lg transition-all duration-300 p-6 flex flex-col justify-between"
      >
        {/* Icon */}
        <div className="relative">
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 dark:bg-primary/5 p-3 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300`}>
            <Icon className="w-full h-full text-primary" />
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-sm md:text-base font-semibold text-foreground text-left mt-auto">
          {category.name}
        </h3>
      </motion.button>
    );
  };

  return (
    <section className="py-32 md:py-40 bg-background relative overflow-hidden">
      
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
