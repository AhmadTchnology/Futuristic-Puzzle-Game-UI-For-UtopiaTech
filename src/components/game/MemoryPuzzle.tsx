import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { Grid } from 'lucide-react';

interface MemoryPuzzleProps {
  onComplete: () => void;
}

export const MemoryPuzzle: React.FC<MemoryPuzzleProps> = ({ onComplete }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [playing, setPlaying] = useState(false); // Playing back sequence
  const [round, setRound] = useState(1);
  const [failed, setFailed] = useState(false);

  // 3x3 Grid
  const grid = Array.from({ length: 9 }, (_, i) => i);

  useEffect(() => {
    startRound(1);
  }, []);

  const startRound = (r: number) => {
    setPlaying(true);
    setUserSequence([]);
    const newSeq = Array.from({ length: r + 2 }, () => Math.floor(Math.random() * 9));
    setSequence(newSeq);

    // Playback
    let i = 0;
    const interval = setInterval(() => {
      if (i >= newSeq.length) {
        clearInterval(interval);
        setPlaying(false);
        return;
      }
      // Flash tile logic is handled by ActiveTile state or we can just flash DOM
      const tileId = newSeq[i];
      highlightTile(tileId);
      i++;
    }, 800);
  };

  const [activeTile, setActiveTile] = useState<number | null>(null);

  const highlightTile = (id: number) => {
    setActiveTile(id);
    setTimeout(() => setActiveTile(null), 500);
  };

  const [snarkyMsg, setSnarkyMsg] = useState("");

  const FAILURE_MESSAGES = [
    "MEMORY_LEAK_DETECTED",
    "SEGMENTATION_FAULT_(BRAIN)",
    "PACKET_LOSS_100%",
    "BUFFER_OVERFLOW",
    "REBOOT_YOUR_NEURONS",
    "404_PATTERN_NOT_FOUND"
  ];

  const handleTileClick = (id: number) => {
    if (playing || failed) return;

    highlightTile(id);
    const nextIndex = userSequence.length;

    if (sequence[nextIndex] === id) {
      const newUserSeq = [...userSequence, id];
      setUserSequence(newUserSeq);

      if (newUserSeq.length === sequence.length) {
        if (round >= 3) {
          setTimeout(onComplete, 1000);
        } else {
          setRound(r => r + 1);
          setTimeout(() => startRound(round + 1), 1000);
        }
      }
    } else {
      setFailed(true);
      setSnarkyMsg(FAILURE_MESSAGES[Math.floor(Math.random() * FAILURE_MESSAGES.length)]);
      setTimeout(() => {
        setFailed(false);
        startRound(round); // Retry same round
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8 bg-[#050508]/90 w-full h-full max-w-md mx-auto">
      <div className="mb-4 sm:mb-8 text-center">
        <h2 className="text-lg sm:text-xl font-bold tracking-widest text-[#00E6FF] flex items-center justify-center gap-2">
          <Grid size={20} />
          PATTERN_AUTH
        </h2>
        <p className="text-[10px] sm:text-xs text-white/50">MEMORIZE AND REPLICATE THE SIGNAL PATTERN</p>
        <div className="mt-2 text-xs font-mono text-[#00E6FF]">ROUND {round}/3</div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {grid.map(id => (
          <motion.button
            key={id}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTileClick(id)}
            className={cn(
              "h-16 w-16 sm:h-20 sm:w-20 rounded border-2 transition-all duration-200",
              activeTile === id ? "bg-[#00E6FF] border-white shadow-[0_0_30px_#00E6FF]" :
                failed ? "border-red-500/50 bg-red-500/10" : "border-white/10 bg-white/5 hover:border-white/30"
            )}
          />
        ))}
      </div>

      {failed && (
        <div className="mt-4 text-center">
          <div className="text-red-500 font-bold tracking-widest animate-pulse">AUTH FAILED</div>
          <div className="text-xs font-mono text-red-400 mt-1">ERROR: {snarkyMsg}</div>
        </div>
      )}
    </div>
  );
};
