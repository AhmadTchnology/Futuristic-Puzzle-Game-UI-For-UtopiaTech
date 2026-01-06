import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Share2, ArrowRight, User, Cpu, Zap, Eye, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PersonalityAnalysisProps {
  startTime: number;
  endTime: number;
  onContinue: () => void;
  onClose: () => void; // For re-viewing without "Continue" flow
  isReplay?: boolean; // If viewing again from hub
}

const ARCHETYPES = [
  {
    id: 'PHANTOM',
    maxTime: 60, // < 60s
    title: 'THE PHANTOM',
    description: 'You were never here. Security logs show nothing but a ghost.',
    stats: { stealth: 98, speed: 99, chaos: 10 },
    color: '#00E6FF',
    icon: <Eye size={32} />
  },
  {
    id: 'NETRUNNER',
    maxTime: 120, // < 2m
    title: 'ELITE NETRUNNER',
    description: 'Efficient. Lethal. You see the code as it truly is.',
    stats: { stealth: 85, speed: 90, chaos: 40 },
    color: '#F0E68C', // Khaki/Gold
    icon: <Zap size={32} />
  },
  {
    id: 'CRYPTOGRAPHER',
    maxTime: 240, // < 4m
    title: 'MASTER CRYPTOGRAPHER',
    description: 'Methodical and precise. No encryption can withstand your patience.',
    stats: { stealth: 90, speed: 60, chaos: 20 },
    color: '#A855F7', // Purple
    icon: <Cpu size={32} />
  },
  {
    id: 'ANARCHIST',
    maxTime: 999999, // > 4m
    title: 'DIGITAL ANARCHIST',
    description: 'You prefer brute force and persistence. The system broke before you did.',
    stats: { stealth: 20, speed: 40, chaos: 99 },
    color: '#EF4444', // Red
    icon: <ShieldAlert size={32} />
  }
];

export const PersonalityAnalysis: React.FC<PersonalityAnalysisProps> = ({ startTime, endTime, onContinue, onClose, isReplay }) => {
  const duration = (endTime - startTime) / 1000; // seconds
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  
  const archetype = ARCHETYPES.find(a => duration < a.maxTime) || ARCHETYPES[ARCHETYPES.length - 1];

  const handleShare = () => {
    const text = `I breached the Utech Mainframe in ${minutes}m ${seconds}s. My hacker class: ${archetype.title}. #ConstructYourReality #UtechBreach`;
    const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, rotateX: 20 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        className="relative w-full max-w-md overflow-hidden rounded-xl border bg-[#0A0A0F] shadow-2xl"
        style={{ borderColor: archetype.color, boxShadow: `0 0 50px ${archetype.color}33` }}
      >
        {/* Header / ID Card Top */}
        <div className="relative h-32 overflow-hidden bg-gradient-to-b from-white/5 to-transparent p-6">
           <div className="absolute top-0 right-0 p-4 opacity-20">
              <User size={100} color={archetype.color} />
           </div>
           <div className="relative z-10">
              <div className="font-mono text-[10px] tracking-widest text-white/50">IDENTITY_ANALYSIS_COMPLETE</div>
              <h2 className="mt-2 text-3xl font-black italic tracking-tighter text-white" style={{ textShadow: `0 0 20px ${archetype.color}` }}>
                {archetype.title}
              </h2>
              <div className="mt-1 font-mono text-xl text-white/80">
                TIME: {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
              </div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 p-6">
           <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white/5" style={{ color: archetype.color }}>
                 {archetype.icon}
              </div>
              <div>
                 <p className="text-sm font-medium text-white/90 leading-relaxed">
                   "{archetype.description}"
                 </p>
              </div>
           </div>

           <div className="space-y-3 font-mono text-xs">
              <div>
                 <div className="flex justify-between text-white/50 mb-1">STEALTH</div>
                 <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${archetype.stats.stealth}%` }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: archetype.color }}
                    />
                 </div>
              </div>
              <div>
                 <div className="flex justify-between text-white/50 mb-1">SPEED</div>
                 <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${archetype.stats.speed}%` }}
                      transition={{ delay: 0.7, duration: 1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: archetype.color }}
                    />
                 </div>
              </div>
              <div>
                 <div className="flex justify-between text-white/50 mb-1">CHAOS</div>
                 <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${archetype.stats.chaos}%` }}
                      transition={{ delay: 0.9, duration: 1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: archetype.color }}
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-white/10 bg-white/5 p-4">
           <button 
             onClick={handleShare}
             className="flex flex-1 items-center justify-center gap-2 rounded bg-white/10 py-3 text-xs font-bold tracking-widest text-white hover:bg-white/20 transition-colors"
           >
             <Share2 size={14} /> SHARE
           </button>
           
           {!isReplay ? (
             <button 
               onClick={onContinue}
               className="flex flex-[2] items-center justify-center gap-2 rounded py-3 text-xs font-bold tracking-widest text-black shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-transform hover:scale-[1.02]"
               style={{ backgroundColor: archetype.color }}
             >
               ACCESS_DATABASE <ArrowRight size={14} />
             </button>
           ) : (
             <button 
               onClick={onClose}
               className="flex flex-[2] items-center justify-center gap-2 rounded py-3 text-xs font-bold tracking-widest text-black shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-transform hover:scale-[1.02]"
               style={{ backgroundColor: archetype.color }}
             >
               CLOSE
             </button>
           )}
        </div>
      </motion.div>
    </div>
  );
};
