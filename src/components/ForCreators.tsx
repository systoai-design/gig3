import { motion } from 'framer-motion';
import { Wallet, Sliders, Globe, Award, BarChart3, MessageSquare, Shield, Image, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassmorphicCard } from '@/components/animations/GlassmorphicCard';
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer';
import { GradientMesh } from '@/components/ui/gradient-mesh';
import { NoiseTexture } from '@/components/ui/noise-texture';
import { useCreatorRegistration } from '@/hooks/useCreatorRegistration';

const benefits = [
  {
    icon: Wallet,
    title: 'Earn Crypto',
    description: 'Get paid instantly in SOL',
    detail: 'No waiting for bank transfers',
  },
  {
    icon: Sliders,
    title: 'Full Control',
    description: 'Set your own prices & packages',
    detail: 'Build your reputation',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Connect with clients worldwide',
    detail: '24/7 marketplace',
  },
];

const features = [
  { icon: Award, title: 'PRO Membership', description: 'Get verified badge & priority listing' },
  { icon: BarChart3, title: 'Analytics Dashboard', description: 'Track views, clicks, sales' },
  { icon: MessageSquare, title: 'Direct Messaging', description: 'Communicate with clients' },
  { icon: Shield, title: 'Escrow Protection', description: 'Secure payments guaranteed' },
  { icon: Image, title: 'Portfolio Gallery', description: 'Showcase your best work' },
  { icon: Package, title: 'Custom Packages', description: 'Offer tiered pricing' },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'UI/UX Designer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    quote: "I've earned 15 SOL in 3 months!",
    stats: { orders: 45, rating: 4.9, responseTime: '2h' },
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Full Stack Developer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    quote: 'Best freelance platform for crypto payments',
    stats: { orders: 120, rating: 5.0, responseTime: '1h' },
  },
  {
    name: 'Aisha Patel',
    role: 'Content Writer',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
    quote: 'Finally, a platform that values creators',
    stats: { orders: 78, rating: 4.8, responseTime: '3h' },
  },
];

interface ForCreatorsProps {
  onOpenAuthDialog?: () => void;
}

export const ForCreators = ({ onOpenAuthDialog }: ForCreatorsProps) => {
  const navigate = useNavigate();
  const { handleBecomeCreator } = useCreatorRegistration();
  const [gigsPerMonth, setGigsPerMonth] = useState(10);
  const [avgPrice, setAvgPrice] = useState(2);
  const platformFee = 0.05;
  
  const monthlyEarnings = gigsPerMonth * avgPrice;
  const platformFeeAmount = monthlyEarnings * platformFee;
  const takeHome = monthlyEarnings - platformFeeAmount;
  const usdEstimate = (takeHome * 180).toFixed(0); // Rough SOL to USD conversion

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Unified Background Pattern */}
      <div className="absolute inset-0 z-0">
        <GradientMesh className="opacity-30" animated={true} />
        <NoiseTexture opacity={0.02} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-primary font-semibold text-sm">For Creators</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-accent-blue to-accent-cyan bg-clip-text text-transparent">
              Turn Your Skills Into
            </span>
            <br />
            <span className="gradient-text">Solana Earnings</span>
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto mb-8">
            Join thousands of creators earning crypto for their services
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              onClick={() => handleBecomeCreator()}
              className="text-lg px-8"
            >
              Start Selling
            </Button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">No fees to join</span>
            </div>
          </div>
        </motion.div>

        {/* Benefits grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <StaggerItem key={index}>
                <GlassmorphicCard className="p-8 h-full">
                  <div className="mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent-cyan/20 flex items-center justify-center">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-foreground mb-1">{benefit.description}</p>
                  <p className="text-muted-foreground text-sm">{benefit.detail}</p>
                </GlassmorphicCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Earnings calculator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <GlassmorphicCard className="p-8 md:p-12 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-2 gradient-text">Earnings Calculator</h3>
              <p className="text-muted-foreground">See your potential monthly income</p>
            </div>

            <div className="space-y-8">
              {/* Gigs per month slider */}
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium">Gigs per month</label>
                  <span className="text-primary font-bold">{gigsPerMonth}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={gigsPerMonth}
                  onChange={(e) => setGigsPerMonth(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Average price slider */}
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium">Average gig price</label>
                  <span className="text-primary font-bold">{avgPrice} SOL</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={avgPrice}
                  onChange={(e) => setAvgPrice(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Results */}
              <div className="pt-6 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-muted-foreground text-sm mb-1">Monthly Earnings</div>
                    <div className="text-3xl font-bold text-primary">{monthlyEarnings.toFixed(1)} SOL</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground text-sm mb-1">Platform Fee (5%)</div>
                    <div className="text-3xl font-bold text-muted-foreground">-{platformFeeAmount.toFixed(2)} SOL</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground text-sm mb-1">Take Home</div>
                    <div className="text-3xl font-bold gradient-text">{takeHome.toFixed(1)} SOL</div>
                  </div>
                </div>
                <div className="text-center mt-6 text-muted-foreground">
                  That's approximately <span className="text-primary font-bold">${usdEstimate}</span> USD at current rates
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        </motion.div>

        {/* Success stories */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-4xl font-bold gradient-text mb-3">Creator Success Stories</h3>
            <p className="text-muted-foreground text-lg">Real creators, real earnings</p>
          </motion.div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <StaggerItem key={index}>
                <GlassmorphicCard className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-lg font-medium mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Orders:</span>
                      <span className="ml-1 font-semibold">{testimonial.stats.orders}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Rating:</span>
                      <span className="ml-1 font-semibold">★{testimonial.stats.rating}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Response:</span>
                      <span className="ml-1 font-semibold">{testimonial.stats.responseTime}</span>
                    </div>
                  </div>
                </GlassmorphicCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-3xl font-bold text-center mb-12 gradient-text">Creator Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.03 }}
                  className="flex gap-4 p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">{feature.title}</div>
                    <div className="text-sm text-muted-foreground">{feature.description}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button 
            size="lg" 
            onClick={() => handleBecomeCreator(onOpenAuthDialog)}
            className="text-lg px-12"
          >
            Become a Creator
          </Button>
          <p className="text-muted-foreground mt-4">
            <a href="/how-it-works" className="text-primary hover:underline">Learn how it works →</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
