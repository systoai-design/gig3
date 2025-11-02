import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MarqueeCarouselProps {
  children: ReactNode[];
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  className?: string;
}

export const MarqueeCarousel = ({ 
  children, 
  speed = 50,
  direction = 'left',
  pauseOnHover = true,
  className = ''
}: MarqueeCarouselProps) => {
  const duration = children.length * speed;
  const directionValue = direction === 'left' ? -1 : 1;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="flex gap-6"
        animate={{
          x: directionValue * -1 * (100 / children.length) + '%'
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration,
            ease: "linear",
          },
        }}
        {...(pauseOnHover && {
          whileHover: { animationPlayState: 'paused' }
        })}
      >
        {[...children, ...children].map((child, index) => (
          <div key={index} className="flex-shrink-0">
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  );
};
