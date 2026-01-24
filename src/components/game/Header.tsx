import React from 'react';
import { BackgroundMusic } from './BackgroundMusic';
import exampleImage from '../../assets/utech-logo.png';

interface HeaderProps {
  userName?: string;
}

const LogoSection = () => (
  <div className="relative group flex-shrink-0">
    <div className="absolute -inset-2 rounded-lg bg-[#00E6FF]/20 blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
    <img
      src={exampleImage}
      alt="UTech Logo"
      className="relative h-8 md:h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(0,230,255,0.5)]"
    />
  </div>
);

const SystemStatus = () => (
  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 backdrop-blur-sm">
    <div className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00E6FF] opacity-75"></span>
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00E6FF]"></span>
    </div>
    <span className="hidden sm:block font-mono text-[10px] tracking-widest text-[#00E6FF] shadow-[#00E6FF]">
      SYSTEM STATUS: REBUILDING...
    </span>
    <span className="sm:hidden font-mono text-[10px] tracking-widest text-[#00E6FF] shadow-[#00E6FF]">
      ACTIVE
    </span>
  </div>
);

const OperatorDisplay = ({ userName }: { userName?: string }) => {
  if (!userName) return null;
  return (
    <div className="flex flex-col items-center justify-center text-[#00E6FF] font-mono tracking-widest">
      <span className="text-[8px] opacity-50 leading-none mb-0.5">OPERATOR</span>
      <span className="text-xs md:text-sm font-bold leading-none drop-shadow-[0_0_5px_rgba(0,230,255,0.3)]">
        {userName.toUpperCase()}
      </span>
    </div>
  );
};

export const Header: React.FC<HeaderProps> = ({ userName }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0A0A0F]/90 backdrop-blur-md transition-all duration-300">
      <div className="max-w-[1920px] mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4">

        {/* Left Section: Logo */}
        <div className="flex items-center flex-shrink-0">
          <LogoSection />
        </div>

        {/* Center Section: Operator Name (Absolute on Desktop, Hidden/Different on Mobile?) 
            Actually, let's keep it in the flow for better responsiveness or absolute if we want perfect centering.
            For this design, absolute centering on desktop looks premium.
        */}


        {/* Right Section: Status + Music */}
        <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
          {/* Mobile Operator Display (Visible only on small screens) */}
          <div className="md:hidden">
            <OperatorDisplay userName={userName} />
          </div>

          <div className="hidden sm:block">
            <SystemStatus />
          </div>

          <div className="w-px h-8 bg-white/10 hidden sm:block" />

          <BackgroundMusic />
        </div>
      </div>
    </header>
  );
};
