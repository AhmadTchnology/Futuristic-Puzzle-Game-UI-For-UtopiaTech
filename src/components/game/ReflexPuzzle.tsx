import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Target } from 'lucide-react';

interface ReflexPuzzleProps {
   onComplete: () => void;
}

interface Packet {
   id: number;
   lane: 0 | 1 | 2;
   type: 'DATA' | 'VIRUS';
   y: number;
   caught: boolean;
}

export const ReflexPuzzle: React.FC<ReflexPuzzleProps> = ({ onComplete }) => {
   const [packets, setPackets] = useState<Packet[]>([]);
   const [score, setScore] = useState(0);
   const [lives, setLives] = useState(3);
   const [gameOver, setGameOver] = useState(false);
   const gameLoopRef = useRef<number | null>(null);
   const lastSpawnRef = useRef<number>(0);

   const TARGET_SCORE = 10;
   const SPEED = 3; // Pixels per frame

   // Game Loop
   useEffect(() => {
      if (score >= TARGET_SCORE) {
         onComplete();
         return;
      }

      if (lives <= 0) {
         setGameOver(true);
         // Trigger taunt
         if ((window as any).triggerSystemTaunt) (window as any).triggerSystemTaunt('fail');
         return;
      }

      const loop = (time: number) => {
         if (gameOver) return;

         // Spawn Logic
         if (time - lastSpawnRef.current > 800) { // Spawn every 800ms
            const isVirus = Math.random() > 0.7; // 30% virus chance
            const newPacket: Packet = {
               id: time,
               lane: Math.floor(Math.random() * 3) as 0 | 1 | 2,
               type: isVirus ? 'VIRUS' : 'DATA',
               y: -50,
               caught: false
            };
            setPackets(prev => [...prev, newPacket]);
            lastSpawnRef.current = time;
         }

         // Update Packets
         setPackets(prev => {
            const nextPackets = prev.map(p => ({ ...p, y: p.y + SPEED }));

            // Check Missed Data Packets (passed bottom)
            const missedData = nextPackets.some(p => p.y > 400 && p.type === 'DATA' && !p.caught);
            if (missedData) {
               // We can penalize for missing data if we want, but let's keep it simple: only viruses hurt or clicking wrong.
               // Actually, let's remove missed packets from array
            }

            return nextPackets.filter(p => p.y < 600 && !p.caught);
         });

         gameLoopRef.current = requestAnimationFrame(loop);
      };

      gameLoopRef.current = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(gameLoopRef.current!);
   }, [score, lives, gameOver, onComplete]);

   const handleLaneClick = (laneIndex: number) => {
      if (gameOver) return;

      // Check if there is a clickable packet in this lane near the "Catch Zone" (e.g., y > 300)
      setPackets(prev => {
         const targetIndex = prev.findIndex(p => p.lane === laneIndex && p.y > 250 && p.y < 450 && !p.caught);

         if (targetIndex !== -1) {
            const target = prev[targetIndex];

            if (target.type === 'VIRUS') {
               setLives(l => l - 1);
               // Trigger mini taunt
               return prev.map((p, i) => i === targetIndex ? { ...p, caught: true } : p);
            } else {
               setScore(s => s + 1);
               return prev.map((p, i) => i === targetIndex ? { ...p, caught: true } : p);
            }
         }
         return prev;
      });
   };

   const resetGame = () => {
      setScore(0);
      setLives(3);
      setPackets([]);
      setGameOver(false);
      setGameOver(false);
   };

   return (
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
         <div className="flex justify-between w-full font-mono text-xs sm:text-sm text-[#00E6FF] px-2">
            <div>DATA_CAPTURED: {score}/{TARGET_SCORE}</div>
            <div className="text-red-500">INTEGRITY: {'♥'.repeat(lives)}</div>
         </div>

         <div className="relative h-[60vh] max-h-[400px] min-h-[300px] w-full overflow-hidden rounded-xl border border-white/10 bg-black/50">
            {/* Lanes */}
            <div className="absolute inset-0 flex">
               {[0, 1, 2].map(i => (
                  <div
                     key={i}
                     onClick={() => handleLaneClick(i)}
                     className="group relative flex-1 cursor-pointer border-r border-white/5 transition-colors hover:bg-white/5 active:bg-white/10"
                  >
                     {/* Hit Zone Indicator */}
                     <div className="absolute bottom-10 left-2 right-2 h-20 rounded border-2 border-dashed border-white/20 group-hover:border-[#00E6FF]/50 transition-colors" />
                  </div>
               ))}
            </div>

            {/* Packets */}
            {packets.map(p => (
               <div
                  key={p.id}
                  className="absolute w-1/3 px-4 flex justify-center pointer-events-none"
                  style={{
                     left: `${p.lane * 33.33}%`,
                     top: p.y
                  }}
               >
                  <div
                     className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 shadow-[0_0_15px_currentColor] transition-transform ${p.type === 'VIRUS'
                        ? 'border-red-500 bg-red-900/50 text-red-500'
                        : 'border-green-500 bg-green-900/50 text-green-500'
                        }`}
                  >
                     {p.type === 'VIRUS' ? <ShieldAlert size={20} /> : <Target size={20} />}
                  </div>
               </div>
            ))}

            {/* Game Over Screen */}
            {gameOver && (
               <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-6 text-center">
                  <h3 className="text-2xl font-bold text-red-500 mb-2">FIREWALL BREACH FAILED</h3>
                  <p className="text-white/70 mb-6 text-sm">System integrity compromised by virus injection.</p>
                  <button
                     onClick={resetGame}
                     className="rounded bg-red-500 px-6 py-2 font-bold text-black hover:bg-red-400"
                  >
                     RETRY INJECTION
                  </button>
               </div>
            )}
         </div>

         <div className="text-xs text-white/30 font-mono text-center">
            CLICK LANES TO CAPTURE DATA PACKETS [TARGET]<br />
            AVOID SECURITY TRACES [SHIELD]
         </div>
      </div>
   );
};
