import React from 'react';
import { motion } from 'motion/react';
import { NodeType } from './NetworkHub';

interface GlitchTransitionProps {
  type?: NodeType | 'DEFAULT' | 'HUB';
}

const HexTransition = () => (
  <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ scale: 0, opacity: 0, rotate: 0 }}
        animate={{ scale: [0, 20], opacity: [1, 0], rotate: [0, 60] }}
        transition={{ duration: 1, delay: i * 0.1, ease: "easeInOut" }}
        className="absolute border-[50px] border-[#00E6FF] opacity-50"
        style={{ 
           width: '100px', 
           height: '100px',
           clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' 
        }}
      />
    ))}
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="absolute inset-0 bg-[#00E6FF]/20"
    />
  </div>
);

const MatrixTransition = () => (
  <div className="absolute inset-0 z-[100] bg-black overflow-hidden flex">
    {[...Array(20)].map((_, i) => (
       <motion.div
          key={i}
          initial={{ y: '-100%' }}
          animate={{ y: '100%' }}
          transition={{ 
             duration: Math.random() * 0.5 + 0.5, 
             ease: "linear",
             delay: Math.random() * 0.2 
          }}
          className="flex-1 text-[#00E6FF] font-mono text-center opacity-50 writing-vertical-lr text-xs break-all"
          style={{ writingMode: 'vertical-rl' }}
       >
          {Array.from({length: 50}, () => Math.random() > 0.5 ? '1' : '0').join('')}
       </motion.div>
    ))}
  </div>
);

const ScanLineTransition = () => (
  <div className="absolute inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center">
    <motion.div 
      initial={{ height: '0%' }}
      animate={{ height: '100%' }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="w-full bg-[#00E6FF] relative"
    >
       <motion.div 
         initial={{ opacity: 0 }} 
         animate={{ opacity: 1 }}
         className="absolute inset-0 bg-white mix-blend-overlay"
       />
    </motion.div>
    <motion.div 
       initial={{ scaleY: 0 }}
       animate={{ scaleY: 1 }}
       transition={{ duration: 0.2 }}
       className="absolute inset-0 bg-black"
    />
  </div>
);

const CircuitTransition = () => (
   <div className="absolute inset-0 z-[100] bg-black overflow-hidden">
      <svg className="w-full h-full absolute inset-0">
         <motion.path 
            d="M0,50 Q400,50 800,50 T1600,50" 
            stroke="#00E6FF" 
            strokeWidth="10" 
            fill="none"
            initial={{ pathLength: 0, opacity: 1 }}
            animate={{ pathLength: 1, opacity: 0 }}
            transition={{ duration: 0.8, ease: "linear" }}
         />
         <motion.path 
            d="M50,0 Q50,400 50,800 T50,1600" 
            stroke="#00E6FF" 
            strokeWidth="10" 
            fill="none"
            initial={{ pathLength: 0, opacity: 1 }}
            animate={{ pathLength: 1, opacity: 0 }}
            transition={{ duration: 0.8, ease: "linear", delay: 0.1 }}
         />
      </svg>
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: [0, 1, 0] }}
         transition={{ duration: 0.3, delay: 0.4 }}
         className="absolute inset-0 bg-white"
      />
   </div>
);

const SliceTransition = () => {
   const slices = Array.from({ length: 12 }, (_, i) => i);
   return (
     <div className="fixed inset-0 z-[9999] pointer-events-none flex flex-col h-full w-full">
       {slices.map((i) => (
         <motion.div
           key={i}
           initial={{ x: '-100%' }}
           animate={{ x: ['-100%', '0%', '100%'] }}
           transition={{ 
             duration: 0.6, 
             ease: "easeInOut",
             delay: i * 0.05,
             times: [0, 0.4, 1]
           }}
           className="flex-1 w-full relative overflow-hidden"
           style={{
              backgroundColor: i % 2 === 0 ? '#000000' : '#00E6FF',
              zIndex: 20 - i
           }}
         />
       ))}
     </div>
   );
};

export const GlitchTransition: React.FC<GlitchTransitionProps> = ({ type = 'DEFAULT' }) => {
  
  switch (type) {
    case 'TEAM':
    case 'HUB':
       return <HexTransition />;
    case 'SOCIALS':
    case 'DATABASE':
       return <MatrixTransition />;
    case 'PROJECTS':
    case 'VISION':
       return <ScanLineTransition />;
    case 'POWER':
    case 'SECURITY':
       return <CircuitTransition />;
    default:
       return <SliceTransition />;
  }
};
