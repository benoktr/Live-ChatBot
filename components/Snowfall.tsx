import React, { useEffect, useRef } from 'react';

const Snowfall: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    resize();
    window.addEventListener('resize', resize);

    // Particle configuration
    const particles: {
      x: number;
      y: number;
      radius: number;
      speed: number;
      wind: number;
      opacity: number;
      wobble: number;
      wobbleSpeed: number;
    }[] = [];

    // Density based on screen width
    const particleCount = Math.min(Math.floor(width * 0.15), 150);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.5, // slightly smaller max size for elegance
        speed: Math.random() * 1.5 + 0.5, 
        wind: (Math.random() - 0.5) * 0.5, 
        opacity: Math.random() * 0.4 + 0.1, // slightly reduced max opacity to be subtle
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.05 + 0.01
      });
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(p => {
        // Draw flake
        ctx.beginPath();
        // create a gradient for softer flakes
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        // Pure white for crisp look against dark background
        gradient.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`); 
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Update position
        p.y += p.speed;
        p.x += Math.sin(p.wobble) * 0.5 + p.wind;
        p.wobble += p.wobbleSpeed;

        // Reset if out of bounds (bottom)
        if (p.y > height) {
          p.y = -5;
          p.x = Math.random() * width;
        }
        
        // Wrap horizontal
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[5]"
      style={{ mixBlendMode: 'plus-lighter' }}
    />
  );
};

export default Snowfall;