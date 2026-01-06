import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameModule } from './types';
import { Database, Layout, Lock, Check, ShieldAlert, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DropZoneProps {
  id: string;
  label: string;
  acceptsType: string;
  filledBy?: GameModule;
  isHovered: boolean;
  isLocked: boolean; // New Prop
  className?: string;
  domRef?: React.RefObject<HTMLDivElement | null>;
}

const IconMap: Record<string, any> = {
  'Database': Database,
  'Layout': Layout,
  'Lock': Lock
};

export const DropZone: React.FC<DropZoneProps> = ({ 
  id, label, acceptsType, filledBy, isHovered, isLocked, className, domRef 
}) => {
  const Icon = filledBy ? IconMap[filledBy.icon] : null;

  return (
    <div 
      ref={domRef}
      className={cn(
        "relative flex h-32 w-32 flex-col items-center justify-center rounded-xl border-2 transition-all duration-300",
        filledBy 
          ? "border-[#00E6FF] bg-[#00E6FF]/10 shadow-[0_0_30px_rgba(0,230,255,0.3)]" 
          : isLocked
            ? "border-red-500/50 bg-red-900/10" // Locked state
            : isHovered 
              ? "border-[#B066FF] bg-[#B066FF]/10 scale-110 shadow-[0_0_40px_rgba(176,102,255,0.4)]" // Ready to drop
              : "border-green-500/30 bg-green-900/5", // Open state
        className
      )}
    >
      {/* Background Pulse (Circuit Pattern) */}
      {!filledBy && (
        <div className="absolute inset-0 overflow-hidden rounded-xl opacity-20">
           <svg className="h-full w-full" width="100%" height="100%">
             <pattern id={`circuit-${id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
               <path d="M 10 0 V 20 M 0 10 H 20" stroke="currentColor" strokeWidth="1" className="text-white/30" />
             </pattern>
             <rect width="100%" height="100%" fill={`url(#circuit-${id})`} />
           </svg>
        </div>
      )}

      {/* LOCK / SHIELD VISUAL */}
      {!filledBy && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
           <motion.div
             animate={{ color: isLocked ? '#EF4444' : '#10B981' }}
             className="flex flex-col items-center"
           >
             {isLocked ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
             <span className="text-[10px] font-bold tracking-widest">
               {isLocked ? "FIREWALL_ACTIVE" : "PORT_OPEN"}
             </span>
           </motion.div>
        </div>
      )}

      {/* Rotating Shield Ring for Locked State */}
      <AnimatePresence>
        {isLocked && !filledBy && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, rotate: 360 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ rotate: { duration: 4, repeat: Infinity, ease: "linear" } }}
            className="absolute -inset-4 rounded-full border border-dashed border-red-500/30 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Content */}
      {filledBy ? (
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="z-20 flex flex-col items-center gap-2"
        >
          <div className="rounded-full bg-[#00E6FF]/20 p-2 text-[#00E6FF]">
            <Icon size={32} />
          </div>
          <span className="text-[10px] font-bold tracking-widest text-[#00E6FF]">{filledBy.label}</span>
          
          <div className="absolute -right-2 -top-2 rounded-full bg-[#00E6FF] p-1 text-black shadow-[0_0_10px_#00E6FF]">
            <Check size={12} strokeWidth={4} />
          </div>
        </motion.div>
      ) : (
        <div className="z-20 flex flex-col items-center gap-1 opacity-50">
          <span className="text-xs font-mono text-white/50">{label}</span>
          <div className="h-1 w-8 bg-white/20" />
        </div>
      )}

      {/* Connection Node */}
      <div className="absolute -bottom-3 h-3 w-3 rounded-full border-2 border-white/20 bg-black" />
    </div>
  );
};
