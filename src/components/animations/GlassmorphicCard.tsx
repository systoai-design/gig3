import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
  variant?: 'light' | 'dark';
  hover?: boolean;
}

const blurValues = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl'
};

export const GlassmorphicCard = ({ 
  children, 
  className = '',
  blur = 'md',
  opacity = 0.05,
  variant = 'light',
  hover = true
}: GlassmorphicCardProps) => {
  const baseClass = variant === 'light' 
    ? 'bg-white/[var(--opacity)] border-white/10 dark:bg-white/[calc(var(--opacity)*0.3)] dark:border-primary/10' 
    : 'bg-black/[var(--opacity)] border-white/5 dark:border-primary/5';

  return (
    <motion.div
      style={{ '--opacity': opacity } as React.CSSProperties}
      className={`${baseClass} ${blurValues[blur]} rounded-2xl border transition-all duration-300 ${className}`}
      {...(hover && {
        whileHover: { 
          y: -2,
          scale: 1.01,
        },
        transition: { type: "spring", stiffness: 300, damping: 20 }
      })}
    >
      {children}
    </motion.div>
  );
};
