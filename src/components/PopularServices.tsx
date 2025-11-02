import { useNavigate } from "react-router-dom";
import { MarqueeCarousel } from "@/components/animations/MarqueeCarousel";
import { HoverTilt } from "@/components/animations/HoverTilt";
import { GlassmorphicCard } from "@/components/animations/GlassmorphicCard";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const services = [
  { 
    title: "AI Automation",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    gradient: "from-accent-purple/90 to-accent-blue/90"
  },
  { 
    title: "Website Development",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    gradient: "from-accent-cyan/90 to-accent-blue/90"
  },
  { 
    title: "Video Editing",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80",
    gradient: "from-primary/90 to-accent-pink/90"
  },
  { 
    title: "3D Animation",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    gradient: "from-accent-amber/90 to-primary/90"
  },
  { 
    title: "Logo Design",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
    gradient: "from-accent-pink/90 to-accent-purple/90"
  },
  { 
    title: "Smart Contracts",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    gradient: "from-accent-blue/90 to-accent-purple/90"
  },
];

export const PopularServices = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-3">
              Popular Services
            </h2>
            <p className="text-muted-foreground text-lg">
              Trending services from top creators
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
      </div>

      {/* Marquee Carousel */}
      <MarqueeCarousel speed={40} pauseOnHover>
        {services.map((service, index) => (
          <div key={index} className="w-[380px]">
            <HoverTilt intensity={8} scale={1.05}>
              <button
                onClick={() => navigate('/explore')}
                className="w-full group relative overflow-hidden rounded-3xl"
              >
                <GlassmorphicCard
                  blur="md"
                  opacity={0.05}
                  hover={false}
                  className="h-[320px] overflow-hidden"
                >
                  {/* Image with overlay */}
                  <div className="relative h-full">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-60 group-hover:opacity-70 transition-opacity duration-300`}></div>
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <h3 className="text-white text-3xl font-bold mb-2 drop-shadow-lg">
                          {service.title}
                        </h3>
                        <div className="flex items-center gap-2 text-white/90 font-medium">
                          <span className="text-sm">Explore services</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </motion.div>
                    </div>

                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                  </div>
                </GlassmorphicCard>
              </button>
            </HoverTilt>
          </div>
        ))}
      </MarqueeCarousel>
    </section>
  );
};
