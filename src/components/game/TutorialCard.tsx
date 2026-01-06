import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Play, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TutorialCardProps {
  title: string;
  description: string;
  onStart: () => void;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
}

export const TutorialCard: React.FC<TutorialCardProps> = ({ title, description, onStart, difficulty = 'MEDIUM' }) => {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="max-w-md w-full rounded-xl border border-white/10 bg-black/90 p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00E6FF] to-transparent" />
      
      <div className="flex flex-col items-center text-center gap-6">
        <div className="rounded-full bg-[#00E6FF]/10 p-4 shadow-[0_0_30px_rgba(0,230,255,0.2)]">
           <Info size={48} className="text-[#00E6FF]" />
        </div>

        <div>
           <h2 className="text-2xl font-bold tracking-[0.2em] text-white mb-2">{title}</h2>
           <div className={cn(
              "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold tracking-widest border",
              difficulty === 'EASY' ? "border-green-500 text-green-500" :
              difficulty === 'MEDIUM' ? "border-yellow-500 text-yellow-500" :
              "border-red-500 text-red-500"
           )}>
              DIFFICULTY: {difficulty}
           </div>
        </div>

        <p className="text-white/70 leading-relaxed font-mono text-sm border-t border-b border-white/10 py-4 w-full">
           {description}
        </p>

        <button 
           onClick={onStart}
           className="group relative flex w-full items-center justify-center gap-2 rounded bg-[#00E6FF] py-3 text-black font-bold tracking-widest hover:bg-[#00E6FF]/80 transition-all active:scale-95"
        >
           <span>INITIATE PROTOCOL</span>
           <Play size={16} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
};
