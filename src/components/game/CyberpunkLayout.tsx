import React from 'react';
import { cn } from '../../lib/utils';

interface CyberpunkLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const CyberpunkLayout: React.FC<CyberpunkLayoutProps> = ({ children, className }) => {
  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden bg-[#0A0A0F] text-white font-mono selection:bg-[#00E6FF] selection:text-black", className)}>
      {/* Ambient Glows */}
      <div className="pointer-events-none absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#00E6FF]/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[#B066FF]/10 blur-[100px]" />

      {/* Grid Overlay (Scanlines) */}
      <div 
        className="pointer-events-none absolute inset-0 z-50 opacity-[0.15]"
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 4px, 6px 100%'
        }}
      />

      {/* Noise Grain */}
      <div className="pointer-events-none absolute inset-0 z-40 opacity-[0.03] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 z-30 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,15,0.6)_100%)]" />

      {/* Content */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
};
