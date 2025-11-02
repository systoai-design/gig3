import { useScroll } from 'framer-motion';

export const useScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return scrollYProgress;
};
