import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  type?: 'word' | 'line' | 'char';
}

export const TextReveal = ({ 
  children, 
  className = '',
  delay = 0,
  duration = 0.5,
  type = 'line'
}: TextRevealProps) => {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: type === 'char' ? 0.02 : type === 'word' ? 0.05 : 0.1,
        delayChildren: delay
      }
    }
  };

  const item = {
    hidden: { 
      y: type === 'char' ? 20 : 60, 
      opacity: 0,
      rotateX: -20
    },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        duration,
        ease: [0.25, 0.1, 0.25, 1] as const
      }
    }
  };

  const text = String(children);
  let elements: string[] = [];

  if (type === 'char') {
    elements = text.split('');
  } else if (type === 'word') {
    elements = text.split(' ');
  } else {
    elements = [text];
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className={className}
    >
      {elements.map((element, index) => (
        <motion.span
          key={index}
          variants={item}
          style={{ display: 'inline-block' }}
        >
          {element}
          {type === 'word' && index < elements.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </motion.div>
  );
};
