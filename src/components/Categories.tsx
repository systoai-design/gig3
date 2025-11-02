import { Code, Palette, Video, Megaphone, Music, PenTool, Sparkles, Briefcase, Users, Languages } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HoverTilt } from "@/components/animations/HoverTilt";
import { GlassmorphicCard } from "@/components/animations/GlassmorphicCard";
import { motion } from "framer-motion";

const categories = [
  { name: "Programming & Tech", icon: Code, gradient: "from-accent-blue to-accent-cyan" },
  { name: "Graphics & Design", icon: Palette, gradient: "from-accent-pink to-accent-purple" },
  { name: "Digital Marketing", icon: Megaphone, gradient: "from-accent-amber to-primary" },
  { name: "AI Services", icon: Sparkles, gradient: "from-accent-purple to-accent-pink" },
  { name: "Video & Animation", icon: Video, gradient: "from-primary to-accent-pink" },
  { name: "Writing & Translation", icon: Languages, gradient: "from-accent-cyan to-accent-blue" },
  { name: "Music & Audio", icon: Music, gradient: "from-accent-amber to-accent-pink" },
  { name: "Business", icon: Users, gradient: "from-accent-blue to-accent-purple" },
  { name: "Consulting", icon: Briefcase, gradient: "from-accent-purple to-accent-blue" },
];

export const Categories = () => {
  const navigate = useNavigate();

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

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-transparent pointer-events-none"></div>
      
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

        {/* Bento Grid Layout */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            
            return (
              <motion.div
                key={category.name}
                variants={item}
                className="w-full"
              >
                <HoverTilt intensity={10} scale={1.03}>
                  <GlassmorphicCard
                    blur="sm"
                    opacity={0.05}
                    variant="light"
                    className="h-[200px] cursor-pointer overflow-hidden group"
                  >
                    <button
                      onClick={() => navigate('/explore')}
                      className="w-full h-full p-6 flex flex-col justify-between relative"
                    >
                      {/* Gradient Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                      
                      {/* Icon */}
                      <div className="relative">
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                          className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${category.gradient} p-3 md:p-4 shadow-lg`}
                        >
                          <Icon className="w-full h-full text-white" />
                        </motion.div>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-sm md:text-base font-bold text-foreground text-left mt-auto group-hover:gradient-text transition-all duration-300">
                        {category.name}
                      </h3>
                    </button>
                  </GlassmorphicCard>
                </HoverTilt>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
