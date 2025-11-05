import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormStep {
  id: string;
  label: string;
  percentage: number;
}

const FORM_STEPS: FormStep[] = [
  { id: 'wallet-section', label: 'Wallet', percentage: 20 },
  { id: 'bio-section', label: 'Bio', percentage: 40 },
  { id: 'skills-section', label: 'Skills', percentage: 60 },
  { id: 'portfolio-section', label: 'Portfolio', percentage: 80 },
  { id: 'terms-section', label: 'Terms', percentage: 100 },
];

interface FormProgressBarProps {
  containerRef: React.RefObject<HTMLElement>;
}

export const FormProgressBar = ({ containerRef }: FormProgressBarProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const percentage = latest * 100;
      const currentStepIndex = FORM_STEPS.findIndex(
        (step, index) => 
          percentage < step.percentage || index === FORM_STEPS.length - 1
      );
      setActiveStep(currentStepIndex);
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div className="fixed top-16 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      {/* Progress Bar */}
      <motion.div
        className="h-1 bg-gradient-to-r from-primary via-accent-pink to-accent-purple origin-left"
        style={{ scaleX }}
      />

      {/* Step Indicators */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {FORM_STEPS.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;

            return (
              <div key={step.id} className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const element = document.getElementById(step.id);
                    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className={cn(
                    "flex items-center gap-2 transition-all duration-300",
                    "hover:scale-105 cursor-pointer group"
                  )}
                >
                  {/* Circle */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                      "border-2",
                      isCompleted && "bg-primary border-primary text-primary-foreground",
                      isActive && !isCompleted && "border-primary bg-primary/10 scale-110",
                      !isActive && !isCompleted && "border-muted bg-muted"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-semibold">{index + 1}</span>
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={cn(
                      "hidden sm:inline text-sm font-medium transition-all duration-300",
                      isActive && "text-primary scale-105",
                      isCompleted && "text-muted-foreground",
                      !isActive && !isCompleted && "text-muted-foreground/60"
                    )}
                  >
                    {step.label}
                  </span>
                </button>

                {/* Connector Line */}
                {index < FORM_STEPS.length - 1 && (
                  <div
                    className={cn(
                      "hidden md:block h-0.5 w-12 transition-all duration-300",
                      isCompleted ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
