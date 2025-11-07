import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
}

interface ParticleBackgroundProps {
  particleCount?: number;
  particleColor?: string;
  glowColor?: string;
  glowSize?: number;
  connectionDistance?: number;
}

export const ParticleBackground = ({
  particleCount = 50,
  particleColor = 'var(--primary)',
  glowColor = 'var(--primary)',
  glowSize = 150,
  connectionDistance = 100
}: ParticleBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const mouseTrailRef = useRef<Array<{ x: number; y: number; opacity: number }>>([]);
  const animationFrameRef = useRef<number>();
  const resolvedColorsRef = useRef({ particle: '', glow: '' });

  // Resolve CSS variables to actual color values
  const resolveCSSColor = (cssColor: string): string => {
    if (cssColor.startsWith('var(')) {
      const varName = cssColor.match(/var\((--[\w-]+)\)/)?.[1];
      if (varName) {
        const computedValue = getComputedStyle(document.documentElement)
          .getPropertyValue(varName)
          .trim();
        return computedValue || '0, 99%, 59%'; // Fallback HSL values
      }
    }
    return cssColor;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resolve colors once
    resolvedColorsRef.current = {
      particle: resolveCSSColor(particleColor),
      glow: resolveCSSColor(glowColor)
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      hue: Math.random() * 60 - 30 // Hue variation
    }));

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      
      // Add to mouse trail
      mouseTrailRef.current.push({
        x: e.clientX,
        y: e.clientY,
        opacity: 1
      });
      
      // Limit trail length
      if (mouseTrailRef.current.length > 20) {
        mouseTrailRef.current.shift();
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
      mouseTrailRef.current = [];
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw mouse glow effect
      if (mouseRef.current.x > 0 && mouseRef.current.y > 0) {
        const gradient = ctx.createRadialGradient(
          mouseRef.current.x, mouseRef.current.y, 0,
          mouseRef.current.x, mouseRef.current.y, glowSize
        );
        gradient.addColorStop(0, `hsla(${resolvedColorsRef.current.glow}, 0.4)`);
        gradient.addColorStop(0.3, `hsla(${resolvedColorsRef.current.glow}, 0.2)`);
        gradient.addColorStop(1, `hsla(${resolvedColorsRef.current.glow}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw mouse trail
      mouseTrailRef.current.forEach((trail, index) => {
        trail.opacity *= 0.95;
        
        if (trail.opacity > 0.05) {
          const gradient = ctx.createRadialGradient(
            trail.x, trail.y, 0,
            trail.x, trail.y, 30
          );
          gradient.addColorStop(0, `hsla(${resolvedColorsRef.current.glow}, ${trail.opacity * 0.3})`);
          gradient.addColorStop(1, `hsla(${resolvedColorsRef.current.glow}, 0)`);
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(trail.x, trail.y, 30, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Clean up faded trails
      mouseTrailRef.current = mouseTrailRef.current.filter(trail => trail.opacity > 0.05);

      particlesRef.current.forEach((particle, i) => {
        // Mouse interaction - repel particles
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < glowSize) {
          const force = (glowSize - distance) / glowSize;
          particle.vx -= (dx / distance) * force * 0.15;
          particle.vy -= (dy / distance) * force * 0.15;
          
          // Increase particle brightness near mouse
          particle.opacity = Math.min(1, particle.opacity + force * 0.3);
        } else {
          // Fade back to normal
          particle.opacity = Math.max(0.3, particle.opacity * 0.99);
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with glow
        const particleGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        particleGradient.addColorStop(0, `hsla(${resolvedColorsRef.current.particle}, ${particle.opacity})`);
        particleGradient.addColorStop(0.5, `hsla(${resolvedColorsRef.current.particle}, ${particle.opacity * 0.5})`);
        particleGradient.addColorStop(1, `hsla(${resolvedColorsRef.current.particle}, 0)`);
        
        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw solid particle core
        ctx.fillStyle = `hsla(${resolvedColorsRef.current.particle}, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        particlesRef.current.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const lineOpacity = 0.2 * (1 - distance / connectionDistance);
            ctx.strokeStyle = `hsla(${resolvedColorsRef.current.particle}, ${lineOpacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });

        // Draw connection to mouse if close
        if (distance < glowSize * 0.8) {
          const lineOpacity = 0.3 * (1 - distance / (glowSize * 0.8));
          ctx.strokeStyle = `hsla(${resolvedColorsRef.current.glow}, ${lineOpacity})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.stroke();
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particleCount, particleColor, glowColor, glowSize, connectionDistance]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
};
