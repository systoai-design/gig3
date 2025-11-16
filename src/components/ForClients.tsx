import { motion } from 'framer-motion';
import { Search, Lock, MessageCircle, CheckCircle, Shield, Award, Zap, Rocket, Palette, Code, TrendingUp, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { GlassmorphicCard } from '@/components/animations/GlassmorphicCard';
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer';

const steps = [
  {
    icon: Search,
    title: 'Browse & Choose',
    description: 'Explore thousands of services',
    detail: 'Filter by category, price, rating',
  },
  {
    icon: Lock,
    title: 'Pay Securely',
    description: 'Funds held in escrow',
    detail: 'Pay only when satisfied',
  },
  {
    icon: MessageCircle,
    title: 'Collaborate',
    description: 'Direct messaging',
    detail: 'Track progress in real-time',
  },
  {
    icon: CheckCircle,
    title: 'Receive & Review',
    description: 'Get your deliverables',
    detail: 'Release payment or request revisions',
  },
];

const guarantees = [
  {
    icon: Shield,
    title: 'Escrow Protection',
    description: 'Your funds are safe until you approve the work',
  },
  {
    icon: Award,
    title: 'Quality Assurance',
    description: 'Request revisions until you\'re satisfied',
  },
  {
    icon: Zap,
    title: 'Dispute Resolution',
    description: 'Fair admin mediation if issues arise',
  },
];

const useCases = [
  { icon: Rocket, title: 'Launch Your Startup', description: 'Logo, website, marketing' },
  { icon: Palette, title: 'Create Content', description: 'Videos, graphics, writing' },
  { icon: Code, title: 'Build an App', description: 'Development, testing, deployment' },
  { icon: TrendingUp, title: 'Grow Your Business', description: 'SEO, ads, social media' },
  { icon: MessageCircle, title: 'Learn Something New', description: 'Coaching, consulting' },
  { icon: Bot, title: 'Automate Tasks', description: 'AI, bots, smart contracts' },
];

const clientTestimonials = [
  {
    name: 'David Kim',
    company: 'TechStart Inc',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    quote: 'Found the perfect developer in minutes',
    project: 'Web3 DApp',
  },
  {
    name: 'Lisa Wang',
    company: 'Creative Agency',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    quote: 'Amazing quality at fair prices',
    project: 'Brand Identity',
  },
];

export const ForClients = () => {
  const navigate = useNavigate();

  return (
    <section className="py-32 bg-gradient-to-b from-background via-muted/10 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-40 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-10 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/20">
            <span className="text-accent-cyan font-semibold text-sm">For Clients</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Hire Talent</span>
            <br />
            <span className="bg-gradient-to-r from-accent-cyan via-accent-blue to-primary bg-clip-text text-transparent">
              With Confidence
            </span>
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto mb-8">
            Blockchain-secured payments. Quality guaranteed. Fair for everyone.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/explore')}
            className="text-lg px-8"
          >
            Explore Services
          </Button>
        </motion.div>

        {/* How it works timeline */}
        <div className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold gradient-text mb-3">How It Works</h3>
            <p className="text-muted-foreground text-lg">Simple, secure, and transparent</p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Connection line - hidden on mobile */}
              <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent-blue to-accent-cyan opacity-30" style={{ width: 'calc(100% - 120px)', margin: '0 60px' }}></div>
              
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    className="relative"
                  >
                    {/* Step number */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm z-10">
                      {index + 1}
                    </div>
                    
                    <GlassmorphicCard className="p-6 text-center h-full relative">
                      <div className="mb-4 flex justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent-cyan/20 flex items-center justify-center">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                      <p className="text-foreground mb-1 text-sm">{step.description}</p>
                      <p className="text-muted-foreground text-xs">{step.detail}</p>
                    </GlassmorphicCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-4xl font-bold gradient-text mb-3">Our Guarantees</h3>
            <p className="text-muted-foreground text-lg">Your success is our priority</p>
          </motion.div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {guarantees.map((guarantee, index) => {
              const Icon = guarantee.icon;
              return (
                <StaggerItem key={index}>
                  <GlassmorphicCard className="p-8 text-center h-full">
                    <div className="mb-4 flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent-cyan/20 flex items-center justify-center">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold mb-2">{guarantee.title}</h4>
                    <p className="text-muted-foreground">{guarantee.description}</p>
                  </GlassmorphicCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* Popular use cases */}
        <div className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-4xl font-bold gradient-text mb-3">What Can You Build?</h3>
            <p className="text-muted-foreground text-lg">From ideas to reality</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="group cursor-pointer"
                  onClick={() => navigate('/explore')}
                >
                  <div className="p-6 rounded-3xl bg-card/50 border border-border/50 hover:border-primary/50 transition-all duration-300 h-full">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent-cyan/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-accent-cyan/20 transition-all">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold mb-1 group-hover:text-primary transition-colors">{useCase.title}</h4>
                        <p className="text-sm text-muted-foreground">{useCase.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Client testimonials */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-4xl font-bold gradient-text mb-3">Client Success Stories</h3>
            <p className="text-muted-foreground text-lg">Trusted by businesses worldwide</p>
          </motion.div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {clientTestimonials.map((testimonial, index) => (
              <StaggerItem key={index}>
                <GlassmorphicCard className="p-8 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-bold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                    </div>
                  </div>
                  <p className="text-xl font-medium mb-3 italic">"{testimonial.quote}"</p>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Project:</span>
                    <span className="ml-2 font-semibold text-primary">{testimonial.project}</span>
                  </div>
                </GlassmorphicCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button 
            size="lg" 
            onClick={() => navigate('/explore')}
            className="text-lg px-12"
          >
            Start Your Project
          </Button>
          <p className="text-muted-foreground mt-4">
            <a href="/trust-safety" className="text-primary hover:underline">Learn about Trust & Safety →</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
