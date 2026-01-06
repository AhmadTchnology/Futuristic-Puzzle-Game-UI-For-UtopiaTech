import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Globe, Cpu, Clock, ChevronRight, ChevronLeft, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

interface IntroProps {
  onComplete: () => void;
}

const BackgroundEffects = () => (
  <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
    {/* Deep Background */}
    <div className="absolute inset-0 bg-[#0A0A0F]" />
    
    {/* Floating Gradient Orbs - Smoother and Calmer */}
    <motion.div 
      className="absolute w-[600px] h-[600px] bg-[#00E6FF] rounded-full mix-blend-screen filter blur-[150px] opacity-10"
      animate={{
        x: [0, 100, 0],
        y: [0, -50, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{ top: '-10%', left: '-10%' }}
    />
    <motion.div 
      className="absolute w-[600px] h-[600px] bg-[#B066FF] rounded-full mix-blend-screen filter blur-[150px] opacity-10"
      animate={{
        x: [0, -100, 0],
        y: [0, 50, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{ bottom: '-10%', right: '-10%' }}
    />
    
    {/* Moving Grid Floor */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] animate-[grid-move_20s_linear_infinite]" />
    
    {/* Floating Particles */}
    {[...Array(15)].map((_, i) => {
       const isCyan = i % 2 === 0;
       return (
         <motion.div
            key={i}
            className="absolute rounded-full"
            initial={{ 
               x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
               y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
               scale: Math.random() * 0.5 + 0.5,
               opacity: 0
            }}
            animate={{ 
               y: [null, Math.random() * -100],
               opacity: [0, 0.4, 0]
            }}
            transition={{ 
               duration: Math.random() * 10 + 10, // Slower duration
               repeat: Infinity,
               ease: "linear",
               delay: Math.random() * 5
            }}
            style={{
               width: Math.random() * 3 + 2 + 'px',
               height: Math.random() * 3 + 2 + 'px',
               background: isCyan ? '#00E6FF' : '#B066FF',
               boxShadow: `0 0 10px ${isCyan ? '#00E6FF' : '#B066FF'}`
            }}
         />
       );
    })}
  </div>
);

const INTRO_SLIDES = [
  {
    title: "UTECH PROTOCOL",
    subtitle: "SYSTEM INITIALIZATION",
    icon: Globe,
    content: (
      <>
        <p className="text-base md:text-lg text-white/80 font-mono leading-relaxed">
          <span className="text-[#00E6FF] font-bold">&gt; SYSTEM ALERT:</span> Welcome to the UTech Mainframe.
        </p>
        <p className="text-sm md:text-base text-white/60 font-mono mt-4">
          This is the digital proving ground for the <span className="text-white font-bold">UTech Team</span>. 
          We are searching for elite technical minds capable of navigating our secure networks.
        </p>
        <p className="text-sm md:text-base text-white/60 font-mono mt-4">
          You are about to enter a high-fidelity simulation designed to test your cognitive processing and problem-solving capabilities.
        </p>
      </>
    )
  },
  {
    title: "THE OBJECTIVE",
    subtitle: "UNLOCK YOUR ARCHETYPE",
    icon: Cpu,
    content: (
      <>
        <p className="text-sm md:text-base text-white/60 font-mono leading-relaxed">
          Your goal is to breach <span className="text-[#B066FF] font-bold">6 SECURITY NODES</span>. 
          Each node represents a core aspect of technical proficiency:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 text-sm font-mono text-white/50">
          <div className="bg-white/5 p-2 rounded border border-white/10 flex items-center gap-2 group hover:border-[#B066FF]/50 transition-colors">
             <div className="w-1 h-full bg-[#B066FF] shadow-[0_0_10px_#B066FF]" /> Logic
          </div>
          <div className="bg-white/5 p-2 rounded border border-white/10 flex items-center gap-2 group hover:border-[#00E6FF]/50 transition-colors">
             <div className="w-1 h-full bg-[#00E6FF] shadow-[0_0_10px_#00E6FF]" /> Precision
          </div>
          <div className="bg-white/5 p-2 rounded border border-white/10 flex items-center gap-2 group hover:border-[#B066FF]/50 transition-colors">
             <div className="w-1 h-full bg-[#B066FF] shadow-[0_0_10px_#B066FF]" /> Analysis
          </div>
          <div className="bg-white/5 p-2 rounded border border-white/10 flex items-center gap-2 group hover:border-[#00E6FF]/50 transition-colors">
             <div className="w-1 h-full bg-[#00E6FF] shadow-[0_0_10px_#00E6FF]" /> Recall
          </div>
        </div>
        <p className="text-sm md:text-base text-white/60 font-mono mt-4">
          Complete the sequence to reveal your true <span className="text-white font-bold">Identity Archetype</span>.
        </p>
      </>
    )
  },
  {
    title: "OPERATIONAL RULES",
    subtitle: "TIME & SECURITY",
    icon: Clock,
    content: (
      <>
        <div className="space-y-4 font-mono text-white/70">
          <div className="flex gap-4 items-start group">
            <div className="p-2 bg-[#B066FF]/20 rounded text-[#B066FF] mt-1 shadow-[0_0_15px_rgba(176,102,255,0.3)] group-hover:bg-[#B066FF]/30 transition-colors">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="text-white font-bold group-hover:text-[#B066FF] transition-colors">TIME IS CRITICAL</h4>
              <p className="text-xs md:text-sm mt-1 text-white/50">
                Security protocols are active. You have limited time to solve each puzzle before the system traces your connection.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start group">
            <div className="p-2 bg-[#00E6FF]/20 rounded text-[#00E6FF] mt-1 shadow-[0_0_15px_rgba(0,230,255,0.3)] group-hover:bg-[#00E6FF]/30 transition-colors">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h4 className="text-white font-bold group-hover:text-[#00E6FF] transition-colors">COLLECT THE CARDS</h4>
              <p className="text-xs md:text-sm mt-1 text-white/50">
                Each successful breach awards a Security Card. You must collect all cards to fully infiltrate the system.
              </p>
            </div>
          </div>
        </div>
      </>
    )
  }
];

export const Intro: React.FC<IntroProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'INTRO_SEQUENCE' | 'LOADING' | 'PASSWORD'>('INTRO_SEQUENCE');
  const [slideIndex, setSlideIndex] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Navigation
  const nextSlide = () => {
    if (slideIndex < INTRO_SLIDES.length - 1) {
      setSlideIndex(prev => prev + 1);
    } else {
      setStep('LOADING');
    }
  };

  const prevSlide = () => {
    if (slideIndex > 0) {
      setSlideIndex(prev => prev - 1);
    }
  };

  // Loading Simulation
  useEffect(() => {
    if (step === 'LOADING') {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('PASSWORD'), 500);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Utech2025') {
      onComplete();
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 1000);
      setShowHint(true);
    }
  };

  const currentSlide = INTRO_SLIDES[slideIndex];

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white overflow-hidden bg-[#0A0A0F]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <BackgroundEffects />
      
      {/* STEP 1: INTRO SLIDES SEQUENCE */}
      {step === 'INTRO_SEQUENCE' && (
         <motion.div 
            className="flex flex-col items-center text-center w-full max-w-4xl px-4 md:px-6 relative z-10"
         >
            <AnimatePresence mode="wait">
              <motion.div
                key={slideIndex}
                initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className="w-full max-w-2xl"
              >
                {/* Header Icon */}
                <div className="mb-4 md:mb-6 flex justify-center relative">
                   <div 
                      className="absolute inset-0 blur-[60px] opacity-40 animate-pulse bg-gradient-to-r from-[#00E6FF] to-[#B066FF]" 
                   />
                   {React.createElement(currentSlide.icon, { 
                     size: 64, 
                     className: "text-[#00E6FF] drop-shadow-[0_0_15px_rgba(0,230,255,0.5)] animate-[pulse_3s_ease-in-out_infinite]" 
                   })}
                </div>

                {/* Titles - Solid White/Cyan, removed gradients */}
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter mb-2 text-white drop-shadow-[0_0_20px_rgba(0,230,255,0.3)]">
                   {currentSlide.title}
                </h1>
                <h2 className="text-sm md:text-xl font-mono tracking-[0.3em] md:tracking-[0.5em] mb-6 md:mb-8 uppercase opacity-80 text-[#00E6FF]">
                  {currentSlide.subtitle}
                </h2>

                {/* Content Box */}
                <div 
                  className="bg-[#0A0A0F]/60 backdrop-blur-xl border border-white/10 p-5 md:p-8 rounded-xl min-h-[250px] md:min-h-[300px] flex flex-col justify-center text-left shadow-2xl relative overflow-hidden transition-all duration-500"
                >
                   {/* Decorative corner markers */}
                   <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-[#00E6FF]" />
                   <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-[#B066FF]" />
                   <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-[#B066FF]" />
                   <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-[#00E6FF]" />
                   
                   {currentSlide.content}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="mt-6 md:mt-8 w-full flex items-center justify-between md:justify-center gap-4 md:gap-6">
              <button 
                onClick={prevSlide}
                disabled={slideIndex === 0}
                className={cn(
                  "p-3 md:p-4 rounded-full border border-white/10 transition-all bg-black/20 backdrop-blur-sm text-white",
                  slideIndex === 0 ? "opacity-20 cursor-not-allowed" : "hover:bg-white/10 hover:border-[#00E6FF] active:scale-95"
                )}
              >
                <ChevronLeft size={20} className="md:w-6 md:h-6" />
              </button>

              <div className="flex gap-2">
                {INTRO_SLIDES.map((_, idx) => (
                  <div 
                    key={idx}
                    className={cn(
                      "w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300",
                      idx === slideIndex ? "scale-125 bg-[#00E6FF]" : "bg-white/20"
                    )}
                    style={{ 
                      boxShadow: idx === slideIndex ? `0 0 10px #00E6FF` : undefined
                    }}
                  />
                ))}
              </div>

              <button 
                onClick={nextSlide}
                className="group relative px-6 py-3 md:px-8 md:py-4 bg-white text-black font-black text-sm md:text-lg tracking-widest transition-all duration-300 overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2 rounded-sm"
              >
                <div className="absolute inset-0 bg-[#00E6FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 group-hover:text-black transition-colors">
                  {slideIndex === INTRO_SLIDES.length - 1 ? "INITIALIZE" : "NEXT"}
                </span>
                <ChevronRight size={16} className="md:w-5 md:h-5 relative z-10 group-hover:text-black transition-colors" />
              </button>
            </div>
         </motion.div>
      )}

      {/* STEP 2: LOADING SCREEN */}
      {step === 'LOADING' && (
         <div className="w-full max-w-md px-8 relative z-10">
            <div className="font-mono mb-2 flex justify-between text-xs md:text-sm text-[#00E6FF]">
               <span>CONNECTING...</span>
               <span>{Math.min(100, Math.floor(loadingProgress))}%</span>
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
               <motion.div 
                  className="h-full bg-[#00E6FF] shadow-[0_0_20px_#00E6FF]"
                  style={{ width: `${loadingProgress}%` }}
               />
            </div>
            <div className="mt-4 text-[10px] md:text-xs text-white/30 font-mono space-y-1">
               <div>&gt; AUTHENTICATING_MEMBER... [OK]</div>
               {loadingProgress > 30 && <div>&gt; LOADING_PROJECT_FILES... [OK]</div>}
               {loadingProgress > 60 && <div>&gt; DECRYPTING_CHALLENGES... [OK]</div>}
               {loadingProgress > 90 && <div>&gt; ACCESS_GRANTED</div>}
            </div>
         </div>
      )}

      {/* STEP 3: PASSWORD SCREEN */}
      {step === 'PASSWORD' && (
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6 relative z-10 w-full px-4"
         >
            <div className="relative">
               <div className="absolute inset-0 bg-[#00E6FF] blur-[40px] opacity-30 animate-pulse" />
               <Lock className={cn("relative z-10 h-16 w-16 mb-4 transition-colors", error ? "text-red-500" : "text-[#00E6FF]")} />
            </div>
            
            <div className="text-center space-y-2">
               <h2 className="text-2xl font-bold tracking-[0.2em] text-white">SYSTEM LOCKED</h2>
               <p className="text-white/50 text-xs md:text-sm font-mono">ENTER UTECH PASSPHRASE</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="relative w-full max-w-xs">
               <input
                  autoFocus
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password..."
                  className={cn(
                     "w-full bg-transparent border-b-2 py-2 text-center text-xl md:text-2xl font-bold outline-none transition-all font-mono tracking-wider",
                     error ? "border-red-500 text-red-500 placeholder:text-red-500/50" : "border-white/20 text-white focus:border-[#00E6FF] focus:shadow-[0_10px_20px_-10px_#00E6FF]"
                  )}
               />
            </form>

            <AnimatePresence>
               {showHint && (
                  <motion.div 
                     initial={{ opacity: 0, height: 0 }} 
                     animate={{ opacity: 1, height: 'auto' }}
                     className="text-center space-y-1 mt-4"
                  >
                     <div className="text-red-400 text-xs font-bold tracking-widest">ACCESS DENIED</div>
                     <div className="text-white/40 text-xs font-mono">
                        HINT: The Team Name + Current Year<br/>
                        <span className="text-[#00E6FF]">(e.g. U...20..)</span>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </motion.div>
      )}

    </motion.div>
  );
};
