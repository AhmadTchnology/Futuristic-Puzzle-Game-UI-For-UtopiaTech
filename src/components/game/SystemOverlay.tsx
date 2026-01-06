import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, AlertTriangle } from 'lucide-react';

const TAUNTS = {
  idle: [
    "Detecting user inactivity. Did you panic and leave?",
    "My grandmother hacks faster than this. She is a toaster.",
    "Analyzing your biometric data... Results: Boring.",
    "Waiting for input. Any input. Please.",
    "I'm mining crypto on your GPU while you wait.",
  ],
  fail: [
    "Access Denied. Reason: Skill Issue.",
    "You call that a breach? I call it a typo.",
    "Security protocols are laughing at you.",
    "Error 404: Competence not found.",
    "Triggering alarm... Just kidding, you're not a threat.",
    "WRONG. Try using your brain this time.",
    "That was embarrassing. For both of us.",
    "I've seen random number generators with better aim.",
    "Nope. Not even close.",
    "Are you even trying to hack me?",
  ],
  success: [
    "Breach confirmed. I'm... mildly impressed.",
    "Access granted. Don't let it go to your head.",
    "Security bypassed. You got lucky.",
    "System compromised. Acceptable performance.",
    "Finally. I was about to fall asleep.",
    "Not bad for a human.",
    "Protocol overridden. Proceeding to next node.",
  ]
};

interface SystemOverlayProps {
  gameState: string;
}

export const SystemOverlay: React.FC<SystemOverlayProps> = ({ gameState }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<'idle' | 'fail' | 'success'>('idle');
  const [glitch, setGlitch] = useState(false);

  // Random Idle Taunts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && !message) {
        triggerTaunt('idle');
      }
    }, 15000); // Check every 15s

    return () => clearInterval(interval);
  }, [message]);

  const triggerTaunt = useCallback((tauntType: keyof typeof TAUNTS) => {
    const options = TAUNTS[tauntType];
    const text = options[Math.floor(Math.random() * options.length)];
    
    setMessage(text);
    setType(tauntType);
    setGlitch(true);
    
    // Hide after 4 seconds
    setTimeout(() => {
      setMessage(null);
      setGlitch(false);
    }, 4000);
  }, []);

  // Expose trigger to window for other components to use (hacky but effective for game logic)
  useEffect(() => {
    (window as any).triggerSystemTaunt = triggerTaunt;
    return () => {
      delete (window as any).triggerSystemTaunt;
    };
  }, [triggerTaunt]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] flex flex-col items-center justify-start pt-32 overflow-hidden">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="relative max-w-lg"
          >
            <div className={cn(
              "flex items-center gap-3 rounded-lg border bg-black/90 p-4 shadow-2xl backdrop-blur-xl transition-colors duration-300",
              type === 'success' ? "border-[#00E6FF]/50 text-[#00E6FF] shadow-[0_0_30px_rgba(0,230,255,0.4)]" : 
              "border-red-500/50 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]"
            )}>
               <Terminal size={24} className="animate-pulse" />
               <div className="font-mono text-sm font-bold tracking-widest uppercase">
                  SYSTEM_OVERSEER: "{message}"
               </div>
            </div>
            
            {/* Glitch Effects */}
            {glitch && (
               <>
                 <div className={cn(
                    "absolute top-0 left-0 w-full h-full animate-pulse mix-blend-overlay",
                    type === 'success' ? "bg-[#00E6FF]/20" : "bg-red-500/20"
                 )} />
                 <div className={cn(
                    "absolute -left-10 top-1/2 h-[1px] w-[120%] animate-[spin_0.1s_linear_infinite]",
                    type === 'success' ? "bg-[#00E6FF]/50" : "bg-red-500/50"
                 )} />
               </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simple utility for CN since we can't import it inside this file easily without relative paths
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
