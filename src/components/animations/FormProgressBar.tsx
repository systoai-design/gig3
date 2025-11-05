import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormStep {
  id: string;
  label: string;
  isComplete: boolean;
}

interface FormProgressBarProps {
  walletConnected: boolean;
  bioValid: boolean;
  skillsValid: boolean;
  termsAgreed: boolean;
}

export const FormProgressBar = ({ 
  walletConnected, 
  bioValid, 
  skillsValid, 
  termsAgreed 
}: FormProgressBarProps) => {
  const [activeStep, setActiveStep] = useState(0);

  const formSteps: FormStep[] = [
    { id: 'wallet-section', label: 'Wallet', isComplete: walletConnected },
    { id: 'bio-section', label: 'Bio', isComplete: bioValid },
    { id: 'skills-section', label: 'Skills', isComplete: skillsValid },
    { id: 'portfolio-section', label: 'Portfolio', isComplete: true }, // Optional
    { id: 'terms-section', label: 'Terms', isComplete: termsAgreed },
  ];

  // Calculate active step based on first incomplete step
  useEffect(() => {
    const firstIncompleteIndex = formSteps.findIndex(step => !step.isComplete);
    setActiveStep(firstIncompleteIndex === -1 ? formSteps.length - 1 : firstIncompleteIndex);
  }, [walletConnected, bioValid, skillsValid, termsAgreed]);

  // Calculate progress percentage
  const completedSteps = formSteps.filter(step => step.isComplete).length;
  const progressPercentage = (completedSteps / formSteps.length) * 100;

  return (
    <div className="sticky top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      {/* Progress Bar */}
      <motion.div
        className="h-1 bg-gradient-to-r from-primary via-accent-pink to-accent-purple origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progressPercentage / 100 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* Step Indicators */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {formSteps.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted = step.isComplete;

            return (
              <div key={step.id} className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (isCompleted || isActive) {
                      const element = document.getElementById(step.id);
                      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  disabled={!isCompleted && !isActive}
                  className={cn(
                    "flex items-center gap-2 transition-all duration-300",
                    (isCompleted || isActive) && "hover:scale-105 cursor-pointer group",
                    !isCompleted && !isActive && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {/* Circle */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                      "border-2",
                      isCompleted && "bg-primary border-primary text-primary-foreground",
                      isActive && !isCompleted && "border-primary bg-primary/10 scale-110 animate-pulse",
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
                {index < formSteps.length - 1 && (
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
