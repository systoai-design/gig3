import { motion } from 'framer-motion';
import { Star, Award } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { GlassmorphicCard } from '@/components/animations/GlassmorphicCard';
import { AnimatedBadge } from '@/components/ui/animated-badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const featuredCreators = [
  {
    id: 1,
    name: 'Alex Rivera',
    username: '@alexrivera',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    specialty: 'Logo & Brand Designer',
    rating: 4.9,
    orders: 234,
    completionRate: 98,
    isPro: true,
    portfolio: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&q=80',
      'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=400&q=80',
      'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=400&q=80',
    ],
  },
  {
    id: 2,
    name: 'Maya Chen',
    username: '@mayachen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    specialty: 'UI/UX Designer',
    rating: 5.0,
    orders: 189,
    completionRate: 100,
    isPro: true,
    portfolio: [
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80',
      'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&q=80',
      'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?w=400&q=80',
    ],
  },
  {
    id: 3,
    name: 'Jordan Smith',
    username: '@jordansmith',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    specialty: 'Full Stack Developer',
    rating: 4.8,
    orders: 312,
    completionRate: 97,
    isPro: true,
    portfolio: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80',
      'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&q=80',
    ],
  },
  {
    id: 4,
    name: 'Sofia Martinez',
    username: '@sofiamartinez',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
    specialty: 'Content Writer',
    rating: 4.9,
    orders: 167,
    completionRate: 99,
    isPro: true,
    portfolio: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&q=80',
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&q=80',
    ],
  },
  {
    id: 5,
    name: 'Kai Johnson',
    username: '@kaijohnson',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    specialty: 'Video Editor',
    rating: 5.0,
    orders: 201,
    completionRate: 100,
    isPro: true,
    portfolio: [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&q=80',
      'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=400&q=80',
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80',
    ],
  },
];

export const FeaturedCreators = () => {
  const navigate = useNavigate();

  return (
    <section className="py-32 bg-gradient-to-b from-background via-accent-purple/5 to-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-40 right-10 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 left-10 w-96 h-96 bg-accent-cyan/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-accent-purple/10 border border-accent-purple/20">
            <Award className="h-4 w-4 text-accent-purple" />
            <span className="text-accent-purple font-semibold text-sm">Featured Creators</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Meet Our Top</span>
            <br />
            <span className="bg-gradient-to-r from-accent-purple via-primary to-accent-cyan bg-clip-text text-transparent">
              Talent
            </span>
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            Work with verified professionals who deliver exceptional results
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {featuredCreators.map((creator) => (
                <CarouselItem key={creator.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <GlassmorphicCard className="p-6 h-full group">
                    {/* Creator header */}
                    <div className="flex items-start gap-4 mb-6">
                      {/* Avatar with PRO badge */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="w-20 h-20 rounded-2xl object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
                        />
                        {creator.isPro && (
                          <div className="absolute -bottom-2 -right-2">
                            <AnimatedBadge 
                              glow 
                              className="bg-gradient-to-r from-accent-blue to-accent-cyan text-white text-xs px-2 py-1"
                            >
                              PRO
                            </AnimatedBadge>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold mb-1 truncate">{creator.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2 truncate">{creator.username}</p>
                        <p className="text-sm font-medium text-primary">{creator.specialty}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">{creator.rating}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {creator.orders}+ orders
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {creator.completionRate}% complete
                      </div>
                    </div>

                    {/* Portfolio preview */}
                    <div className="mb-6">
                      <div className="grid grid-cols-3 gap-2">
                        {creator.portfolio.map((image, index) => (
                          <div
                            key={index}
                            className="aspect-square rounded-xl overflow-hidden group/img"
                          >
                            <img
                              src={image}
                              alt={`Portfolio ${index + 1}`}
                              className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate(`/profile/${creator.username.slice(1)}`)}
                    >
                      View Profile
                    </Button>
                  </GlassmorphicCard>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-8">
              <CarouselPrevious className="static" />
              <CarouselNext className="static" />
            </div>
          </Carousel>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <Button 
            size="lg" 
            onClick={() => navigate('/explore')}
            className="text-lg px-8"
          >
            Explore All Creators
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
