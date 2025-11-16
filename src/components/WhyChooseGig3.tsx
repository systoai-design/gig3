import { motion } from 'framer-motion';
import { Zap, Network, Crown } from 'lucide-react';
import { GlassmorphicCard } from '@/components/animations/GlassmorphicCard';
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer';

const features = [
  {
    icon: Zap,
    title: 'Powered by Solana',
    points: [
      'Fast, low-cost transactions',
      'Instant global payments',
      'No currency conversion fees',
    ],
    gradient: 'from-accent-amber to-primary',
  },
  {
    icon: Network,
    title: 'True Decentralization',
    points: [
      'Smart contract escrow',
      'No intermediary holding funds',
      'Transparent and secure',
    ],
    gradient: 'from-accent-cyan to-accent-blue',
  },
  {
    icon: Crown,
    title: 'Creator-First Platform',
    points: [
      'Lowest fees (5% vs 20% competitors)',
      'You own your reputation',
      'Direct client relationships',
    ],
    gradient: 'from-primary to-accent-purple',
  },
];

const comparison = [
  { feature: 'Platform Fee', gig3: '5%', traditional: '20%' },
  { feature: 'Payment Speed', gig3: 'Instant', traditional: '2-7 days' },
  { feature: 'Currency', gig3: 'SOL (Crypto)', traditional: 'Fiat only' },
  { feature: 'Escrow Type', gig3: 'Smart Contract', traditional: 'Centralized' },
  { feature: 'Global Access', gig3: '24/7', traditional: 'Banking hours' },
];

export const WhyChooseGig3 = () => {
  return (
    <section className="py-32 bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent-cyan/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Why Choose</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent-blue to-accent-cyan bg-clip-text text-transparent">
              GIG3?
            </span>
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            The future of freelancing is here. Experience the difference.
          </p>
        </motion.div>

        {/* Three unique selling points */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <StaggerItem key={index}>
                <GlassmorphicCard className="p-8 h-full relative overflow-hidden group">
                  {/* Gradient glow on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-0.5`}>
                        <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-6">{feature.title}</h3>

                    {/* Points */}
                    <ul className="space-y-3">
                      {feature.points.map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                          </div>
                          <span className="text-muted-foreground">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </GlassmorphicCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold gradient-text mb-3">GIG3 vs Traditional Platforms</h3>
            <p className="text-muted-foreground text-lg">See the difference for yourself</p>
          </div>

          <GlassmorphicCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-6 text-muted-foreground font-medium">Feature</th>
                    <th className="text-center p-6">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                        <span className="font-bold text-primary">GIG3</span>
                      </div>
                    </th>
                    <th className="text-center p-6 text-muted-foreground font-medium">Traditional</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-6 font-medium">{row.feature}</td>
                      <td className="p-6 text-center">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary font-bold">
                          {row.gig3}
                        </span>
                      </td>
                      <td className="p-6 text-center text-muted-foreground">{row.traditional}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassmorphicCard>

          {/* Bottom note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8 text-muted-foreground"
          >
            <p className="text-sm">
              * Competitor fees based on average rates from major freelance platforms
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
