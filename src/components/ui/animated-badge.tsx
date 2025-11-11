import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedBadgeProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  pulse?: boolean;
}

export const AnimatedBadge = ({ 
  children, 
  className = '',
  glow = false,
  pulse = false
}: AnimatedBadgeProps) => {
  return (
    <motion.div
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold ${className}`}
      {...(pulse && {
        animate: {
          scale: [1, 1.05],
          opacity: [1, 0.8]
        },
        transition: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      })}
      {...(glow && {
        style: {
          boxShadow: '0 0 20px currentColor'
        }
      })}
      whileHover={{ scale: 1.1 }}
    >
      {children}
    </motion.div>
  );
};
