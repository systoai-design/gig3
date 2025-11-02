import { Search, MessageSquare, CreditCard, CheckCircle } from "lucide-react";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { GlassmorphicCard } from "@/components/animations/GlassmorphicCard";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Browse & Discover",
    description: "Explore thousands of services from verified creators across all categories"
  },
  {
    number: "02",
    icon: MessageSquare,
    title: "Connect & Discuss",
    description: "Chat with creators, discuss your project requirements and get custom quotes"
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Secure Payment",
    description: "Pay safely with SOL through our escrow system powered by x402 protocol"
  },
  {
    number: "04",
    icon: CheckCircle,
    title: "Get Delivered",
    description: "Receive high-quality work, review it, and release funds when satisfied"
  },
];

export const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-display-md gradient-text mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Four simple steps to bring your project to life with world-class creators
          </p>
        </motion.div>

        {/* Vertical Timeline */}
        <div className="max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                    className="absolute left-1/2 top-32 w-0.5 h-32 bg-gradient-to-b from-primary/50 to-transparent -translate-x-1/2 origin-top"
                  />
                )}

                <div className={`flex items-center gap-8 mb-16 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Card */}
                  <div className="flex-1">
                    <GlassmorphicCard blur="sm" opacity={0.05} className="p-8 hover:bg-white/5 transition-all duration-300">
                      <div className={`flex items-start gap-6 ${isEven ? 'flex-row' : 'flex-row-reverse text-right'}`}>
                        <motion.div
                          whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                          className="flex-shrink-0"
                        >
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent-pink flex items-center justify-center shadow-lg">
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                        </motion.div>
                        
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
                            <span className="gradient-text">{step.title}</span>
                          </h3>
                          <p className="text-muted-foreground text-base leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </GlassmorphicCard>
                  </div>

                  {/* Number Badge */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent-pink flex items-center justify-center shadow-xl"
                  >
                    <span className="text-2xl font-black text-white">{step.number}</span>
                  </motion.div>

                  {/* Spacer for alignment */}
                  <div className="flex-1 hidden lg:block"></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <MagneticButton
            onClick={() => navigate('/explore')}
            className="bg-gradient-to-r from-primary to-accent-pink hover:from-primary/90 hover:to-accent-pink/90 text-white px-12 py-6 rounded-full font-bold text-lg shadow-xl"
          >
            Start Your Project Now
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
};
