import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../theme/ThemeContext';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  maxLife: number;
  life: number;
}

interface Shockwave {
  id: number;
  x: number;
  y: number;
  color: string;
}

export const CustomCursor: React.FC = () => {
  const { colors, mode } = useTheme();

  const [isSupported, setIsSupported] = useState<boolean>(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const ringVel = useRef({ vx: 0, vy: 0 });
  const isHovered = useRef(false);
  const isMouseDown = useRef(false);
  const isVisible = useRef(false);

  const [shockwaves, setShockwaves] = useState<Shockwave[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Strict pointer & hover check
    const mql = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsSupported(mql.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsSupported(e.matches);
    };

    if (mql.addEventListener) {
      mql.addEventListener('change', handleMediaChange);
    }

    if (!mql.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible.current) {
        isVisible.current = true;
        ringPos.current = { x: e.clientX, y: e.clientY };
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '1';
      }

      // Check if hovering clickable interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = Boolean(
          target.closest('button, a, input, textarea, select, [role="button"], .cursor-pointer, [data-interactive="true"]')
        );
        isHovered.current = interactive;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown.current = true;

      // 1. Kinetic Radial Shockwave Wave Expansion
      const waveId = Date.now() + Math.random();
      setShockwaves((prev) => [
        ...prev.slice(-4),
        { id: waveId, x: e.clientX, y: e.clientY, color: colors.c3 },
      ]);
      setTimeout(() => {
        setShockwaves((prev) => prev.filter((w) => w.id !== waveId));
      }, 650);

      // 2. Spawn 4 to 6 Drift Particle Droplets
      const count = Math.floor(Math.random() * 3) + 4;
      const newParticles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.7;
        const speed = 2.2 + Math.random() * 3.8;
        newParticles.push({
          id: Date.now() + Math.random() + i,
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          size: 3 + Math.random() * 3.5,
          color: i % 2 === 0 ? colors.c3 : colors.c4,
          alpha: 1,
          maxLife: 32 + Math.floor(Math.random() * 16),
          life: 0,
        });
      }
      setParticles((prev) => [...prev.slice(-16), ...newParticles]);
    };

    const handleMouseUp = () => {
      isMouseDown.current = false;
    };

    const handleMouseLeave = () => {
      isVisible.current = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Physics Animation Loop
    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x - 3}px, ${mousePos.current.y - 3}px, 0)`;
        dotRef.current.style.opacity = isVisible.current ? (isHovered.current ? '0.4' : '1') : '0';
      }

      const dx = mousePos.current.x - ringPos.current.x;
      const dy = mousePos.current.y - ringPos.current.y;
      
      const spring = 0.18;
      const damping = 0.76;
      ringVel.current.vx = (ringVel.current.vx + dx * spring) * damping;
      ringVel.current.vy = (ringVel.current.vy + dy * spring) * damping;

      ringPos.current.x += ringVel.current.vx;
      ringPos.current.y += ringVel.current.vy;

      if (ringRef.current) {
        const scale = isMouseDown.current ? 0.85 : isHovered.current ? 1.8 : 1.0;
        const baseSize = 32;
        ringRef.current.style.transform = `translate3d(${ringPos.current.x - baseSize / 2}px, ${
          ringPos.current.y - baseSize / 2
        }px, 0) scale(${scale})`;
        
        ringRef.current.style.opacity = isVisible.current ? (isHovered.current ? '0.55' : '0.9') : '0';
        ringRef.current.style.mixBlendMode = isHovered.current ? 'difference' : (mode === 'dark' ? 'screen' : 'multiply');
      }

      setParticles((prev) => {
        if (prev.length === 0) return prev;
        return prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.14,
            vx: p.vx * 0.94,
            life: p.life + 1,
            alpha: Math.max(0, 1 - p.life / p.maxLife),
          }))
          .filter((p) => p.life < p.maxLife);
      });

      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', handleMediaChange);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [colors, mode]);

  // Completely disabled on touch devices / non-pointer devices
  if (!isSupported) return null;

  return (
    <div className="custom-cursor-container pointer-events-none fixed inset-0 z-[999999] overflow-hidden select-none">
      {/* 1. Central Pointer Dot (6px) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full pointer-events-none transition-opacity duration-150"
        style={{
          backgroundColor: colors.c4,
          boxShadow: `0 0 10px ${colors.c4}`,
          willChange: 'transform',
        }}
      />

      {/* 2. Elastic Outer Ring (32px) */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-[32px] h-[32px] rounded-full border pointer-events-none transition-[border-color,background-color] duration-150 ease-out"
        style={{
          borderColor: colors.c3,
          backgroundColor: `${colors.c3}1A`,
          boxShadow: `0 0 16px ${colors.c3}40`,
          willChange: 'transform',
        }}
      />

      {/* 3. Kinetic Radial Shockwaves */}
      {shockwaves.map((wave) => (
        <div
          key={wave.id}
          className="fixed pointer-events-none rounded-full animate-cursorShockwave"
          style={{
            left: wave.x,
            top: wave.y,
            borderColor: wave.color,
            boxShadow: `0 0 22px ${wave.color}`,
          }}
        />
      ))}

      {/* 4. Drifting Fluid Droplet Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed rounded-full pointer-events-none"
          style={{
            left: p.x,
            top: p.y,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 8px ${p.color}`,
            opacity: p.alpha,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
};
