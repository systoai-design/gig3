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
  opacity = 0.1,
  variant = 'light',
  hover = true
}: GlassmorphicCardProps) => {
  const baseClass = variant === 'light' 
    ? 'bg-white/[var(--opacity)] border-white/20' 
    : 'bg-black/[var(--opacity)] border-white/10';

  return (
    <motion.div
      style={{ '--opacity': opacity } as React.CSSProperties}
      className={`${baseClass} ${blurValues[blur]} rounded-3xl border ${className}`}
      {...(hover && {
        whileHover: { 
          scale: 1.02,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
        },
        transition: { duration: 0.3 }
      })}
    >
      {children}
    </motion.div>
  );
};
