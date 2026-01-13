import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ToggleLeft, ToggleRight, ArrowDown, Zap, Play } from 'lucide-react';
import { cn } from '../../lib/utils';

// Simple logic gates
type GateType = 'AND' | 'OR' | 'XOR';

interface LogicPuzzleProps {
   onComplete: () => void;
}

export const LogicPuzzle: React.FC<LogicPuzzleProps> = ({ onComplete }) => {
   // 4 Inputs
   const [inputs, setInputs] = useState([false, false, false, false]);
   const [gates, setGates] = useState<GateType[]>(['AND', 'OR', 'XOR']);
   const [isSimulating, setIsSimulating] = useState(false);
   const [result, setResult] = useState<boolean | null>(null);

   useEffect(() => {
      // Randomize gates
      const types: GateType[] = ['AND', 'OR', 'XOR'];
      const newGates = [
         types[Math.floor(Math.random() * 3)],
         types[Math.floor(Math.random() * 3)],
         types[Math.floor(Math.random() * 3)],
      ];
      setGates(newGates);
      // Ensure inputs start off
      setInputs([false, false, false, false]);
   }, []);

   const evaluateGate = (type: GateType, a: boolean, b: boolean): boolean => {
      switch (type) {
         case 'AND': return a && b;
         case 'OR': return a || b;
         case 'XOR': return a !== b;
         default: return false;
      }
   };

   // Calculate state for visualization (live update or only on run?)
   // Let's make it live update VISUALLY, but winning requires clicking "EXECUTE"
   const r1 = evaluateGate(gates[0], inputs[0], inputs[1]);
   const r2 = evaluateGate(gates[1], inputs[2], inputs[3]);
   const final = evaluateGate(gates[2], r1, r2);

   const handleExecute = () => {
      setIsSimulating(true);

      // Simulate a "processing" delay
      setTimeout(() => {
         setIsSimulating(false);
         setResult(final);

         if (final) {
            if ((window as any).triggerSystemTaunt) (window as any).triggerSystemTaunt('success');
            setTimeout(onComplete, 1000);
         } else {
            // Failure taunt
            if ((window as any).triggerSystemTaunt) (window as any).triggerSystemTaunt('fail');
         }
      }, 1000);
   };

   const toggleInput = (idx: number) => {
      if (isSimulating) return;
      setResult(null); // Reset result on change
      setInputs(prev => {
         const next = [...prev];
         next[idx] = !next[idx];
         return next;
      });
   };

   return (
      <div className="flex flex-col items-center gap-6 w-full max-w-md p-4">
         <div className="text-center mb-4">
            <div className={cn(
               "text-2xl font-black font-mono tracking-widest transition-colors duration-500",
               result === true ? "text-green-500" : result === false ? "text-red-500" : "text-white"
            )}>
               {result === true ? "POWER_ROUTED" : result === false ? "CIRCUIT_DEAD" : "AWAITING_SEQUENCE"}
            </div>
         </div>

         <div className="flex flex-col items-center gap-4 w-full">

            {/* Layer 1: Inputs */}
            <div className="flex justify-between w-full px-4 md:px-8">
               {inputs.map((val, i) => (
                  <button
                     key={i}
                     onClick={() => toggleInput(i)}
                     className={cn(
                        "flex flex-col items-center gap-2 transition-all hover:scale-110",
                        val ? "text-[#00E6FF]" : "text-white/30"
                     )}
                  >
                     <div className={cn("h-4 w-4 rounded-full shadow-[0_0_10px_currentColor]", val ? "bg-[#00E6FF]" : "bg-white/10")} />
                     {val ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                     <span className="font-mono text-xs">SW_{i + 1}</span>
                  </button>
               ))}
            </div>

            <div className="w-full flex justify-around text-white/20">
               <ArrowDown /> <ArrowDown /> <ArrowDown /> <ArrowDown />
            </div>

            {/* Layer 2: G1 & G2 */}
            <div className="flex justify-around w-full px-4 md:px-12">
               <div className={cn("flex flex-col items-center rounded border p-2 min-w-[80px] transition-colors duration-300", r1 ? "border-[#00E6FF] bg-[#00E6FF]/10 text-[#00E6FF]" : "border-white/10 bg-black/50 text-white/50")}>
                  <span className="text-lg font-bold">{gates[0]}</span>
               </div>

               <div className={cn("flex flex-col items-center rounded border p-2 min-w-[80px] transition-colors duration-300", r2 ? "border-[#00E6FF] bg-[#00E6FF]/10 text-[#00E6FF]" : "border-white/10 bg-black/50 text-white/50")}>
                  <span className="text-lg font-bold">{gates[1]}</span>
               </div>
            </div>

            <div className="w-full flex justify-center gap-24 text-white/20">
               <ArrowDown className="-rotate-45" /> <ArrowDown className="rotate-45" />
            </div>

            {/* Layer 3: G3 (Final) */}
            <div className="flex justify-center w-full">
               <div className={cn("flex flex-col items-center rounded-xl border-2 p-4 min-w-[100px] transition-all duration-300", final ? "border-[#00E6FF] text-[#00E6FF]" : "border-white/10 text-white/50")}>
                  <span className="text-2xl font-black">{gates[2]}</span>
               </div>
            </div>

            <div className="h-8 w-[2px] bg-white/10" />

            {/* Execute Button */}
            <button
               onClick={handleExecute}
               disabled={isSimulating}
               className={cn(
                  "group relative flex items-center gap-3 rounded-full px-8 py-4 font-bold tracking-[0.2em] transition-all active:scale-95",
                  isSimulating
                     ? "bg-yellow-500 text-black cursor-wait"
                     : result === true
                        ? "bg-green-500 text-black"
                        : "bg-[#00E6FF] text-black hover:bg-[#00E6FF]/80 shadow-[0_0_20px_#00E6FF]"
               )}
            >
               {isSimulating ? (
                  <Zap className="animate-spin" />
               ) : (
                  <Play className={cn("transition-transform group-hover:translate-x-1")} />
               )}
               {isSimulating ? "TESTING..." : "TEST_CIRCUIT"}
            </button>

         </div>

         <div className="text-xs text-white/30 font-mono text-center max-w-xs mt-4">
            CONFIGURE SWITCHES TO POWER THE MAIN BUS.
            <br />CURRENT STATE: {final ? "VALID" : "INVALID"}
         </div>
      </div>
   );
};
