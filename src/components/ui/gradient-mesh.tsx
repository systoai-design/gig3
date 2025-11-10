import { motion } from 'framer-motion';

interface GradientMeshProps {
  className?: string;
  colors?: string[];
  animated?: boolean;
}

export const GradientMesh = ({ 
  className = '',
  colors = ['hsl(212, 100%, 48%)', 'hsl(200, 100%, 55%)', 'hsl(180, 77%, 52%)'],
  animated = true
}: GradientMeshProps) => {
  return (
    <motion.div
      className={`absolute inset-0 ${className}`}
      style={{
        background: `radial-gradient(at 0% 0%, ${colors[0]} 0%, transparent 50%),
                     radial-gradient(at 100% 0%, ${colors[1]} 0%, transparent 50%),
                     radial-gradient(at 100% 100%, ${colors[2]} 0%, transparent 50%),
                     radial-gradient(at 0% 100%, ${colors[0]} 0%, transparent 50%)`,
        opacity: 0.05,
        filter: 'blur(40px)'
      }}
      {...(animated && {
        animate: {
          opacity: [0.03, 0.08, 0.03]
        },
        transition: {
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }
      })}
    />
  );
};
