import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Users, Briefcase, CheckCircle, Star } from 'lucide-react';

interface StatItem {
  icon: typeof Users;
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

const stats: StatItem[] = [
  { icon: Briefcase, value: 10000, label: 'Gigs Available', suffix: '+' },
  { icon: Users, value: 5000, label: 'Talented Creators', suffix: '+' },
  { icon: CheckCircle, value: 50000, label: 'Projects Completed', suffix: '+' },
  { icon: Star, value: 4.8, label: 'Average Rating', prefix: '★' },
];

const Counter = ({ value, duration = 2000, suffix = '', prefix = '' }: { value: number; duration?: number; suffix?: string; prefix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    const startTime = Date.now();
    const endValue = value;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = easeOutQuart * endValue;
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isInView, value, duration]);

  const displayValue = value < 10 ? count.toFixed(1) : Math.floor(count).toLocaleString();

  return (
    <div ref={ref} className="text-5xl md:text-6xl font-bold">
      {prefix}{displayValue}{suffix}
    </div>
  );
};

export const StatisticsShowcase = () => {
  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Gradient blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-cyan/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join a thriving community of creators and clients building the future of work
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className="p-8 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                  {/* Icon */}
                  <div className="mb-6 flex justify-center">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent-cyan/20 group-hover:from-primary/30 group-hover:to-accent-cyan/30 transition-all duration-300">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>

                  {/* Counter */}
                  <div className="mb-3">
                    <div className="bg-gradient-to-r from-primary via-accent-blue to-accent-cyan bg-clip-text text-transparent">
                      <Counter 
                        value={stat.value} 
                        suffix={stat.suffix} 
                        prefix={stat.prefix}
                      />
                    </div>
                  </div>

                  {/* Label */}
                  <div className="text-muted-foreground font-medium text-lg">
                    {stat.label}
                  </div>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/0 to-accent-cyan/0 group-hover:from-primary/5 group-hover:to-accent-cyan/5 transition-all duration-300 pointer-events-none"></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
