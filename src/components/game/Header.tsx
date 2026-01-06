import React from 'react';
import { Activity } from 'lucide-react';
import { BackgroundMusic } from './BackgroundMusic';
import exampleImage from 'figma:asset/0298e19d3ed89925d39517ac594ea1b7d707bbbf.png';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/5 bg-[#0A0A0F]/80 p-6 backdrop-blur-md">
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="relative group">
          <div className="absolute -inset-2 rounded-lg bg-[#00E6FF]/20 blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
          <img
            src={exampleImage}
            alt="UTech Logo"
            className="relative h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(0,230,255,0.5)]"
          />
        </div>

        {/* System Status */}
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-1.5">
          <div className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00E6FF] opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00E6FF]"></span>
          </div>
          <span className="font-mono text-xs tracking-widest text-[#00E6FF] shadow-[#00E6FF]">
            SYSTEM STATUS: REBUILDING...
          </span>
        </div>
      </div>

      {/* Decorative Top Elements */}
      <div className="flex items-center gap-4 text-white/20">
        <BackgroundMusic />
        <div className="h-8 w-px bg-white/10 mx-2" /> {/* Separator */}
        <Activity size={16} />
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <span className="font-mono text-xs">V.2.0.45</span>
      </div>
    </header>
  );
};
