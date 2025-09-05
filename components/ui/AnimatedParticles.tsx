'use client';

import React, { useRef, useEffect } from 'react';

interface AnimatedParticlesProps {
  className?: string;
  particleColor?: string;
  lineColor?: string;
  particleCount?: number;
  speed?: number;
  interactive?: boolean;
}

export default function AnimatedParticles({ 
  className = '',
  particleColor = 'rgba(115,255,245,0.6)',
  lineColor = 'rgba(120,207,255',
  particleCount,
  speed = 0.25,
  interactive = true
}: AnimatedParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0;
    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
    }

    let particles: Particle[] = [];
    let lastTime = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.floor(rect.width);
      h = Math.floor(rect.height);
      
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      
      // Calculate particle count based on screen size or use provided value
      const count = particleCount || Math.max(48, Math.min(160, Math.floor((w * h) / 18000)));
      
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        r: 0.6 + Math.random() * 1.2
      }));
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const animate = (currentTime: number) => {
      const dt = Math.min(33, currentTime - lastTime);
      lastTime = currentTime;
      
      // Clear canvas
      ctx.clearRect(0, 0, w, h);
      
      // Add subtle gradient background
      const gradient = ctx.createRadialGradient(
        w * 0.5, h * 0.5, Math.min(w, h) * 0.2,
        w * 0.5, h * 0.5, Math.max(w, h) * 0.9
      );
      gradient.addColorStop(0, 'rgba(18,26,35,0.05)');
      gradient.addColorStop(1, 'rgba(5,8,12,0.05)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
      
      const linkDistance = 90;
      
      // Mouse influence
      const mouseInfluenceX = interactive ? (mouseRef.current.x - w * 0.5) * 0.005 : 0;
      const mouseInfluenceY = interactive ? (mouseRef.current.y - h * 0.5) * 0.005 : 0;
      
      // Update and draw particles
      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx + mouseInfluenceX;
        particle.y += particle.vy + mouseInfluenceY;
        
        // Wrap around edges
        if (particle.x < -10) particle.x = w + 10;
        if (particle.x > w + 10) particle.x = -10;
        if (particle.y < -10) particle.y = h + 10;
        if (particle.y > h + 10) particle.y = -10;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      });
      
      // Draw connections between nearby particles
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < linkDistance) {
            const alpha = 0.18 * (1 - distance / linkDistance);
            ctx.strokeStyle = `${lineColor},${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      
      rafRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    resize();
    window.addEventListener('resize', resize);
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    rafRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [particleColor, lineColor, particleCount, speed, interactive]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 -z-10 pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}