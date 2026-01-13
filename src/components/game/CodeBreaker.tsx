import React, { useState, useEffect } from 'react';
import { Unlock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CodeBreakerProps {
  onComplete: () => void;
}

const MEMORY_DUMPS = [
  {
    // Logic: ASCII/Hex offsets or simple arithmetic logic
    // Text: "SYSTEM_CLOCK: 12:00 // OFFSET: +1h // TARGET: [1][3]:00" -> Code 1300
    // Let's go with "Missing Number" or "Sequence" logic
    text: "SEQ_A: 2, 4, 6, [8] // SEQ_B: 10, 20, 30, [4]0 // SEQ_C: 1, 1, 2, [3] // SEQ_D: 5, 10, 15, [2]0",
    code: [8, 4, 3, 2],
    hint: "COMPLETE THE SEQUENCES"
  },
  {
    // Logic: Count specific characters
    text: "ACCESS_CODE_GENERATOR // INPUT: 'A-A-A' // INPUT: 'B' // INPUT: 'C-C-C-C' // INPUT: 'D-D'",
    code: [3, 1, 4, 2],
    hint: "COUNT THE REPETITIONS"
  },
  {
    // Logic: Math operations
    text: "OP_1: 5+2=[7] // OP_2: 9-3=[6] // OP_3: 2x2=[4] // OP_4: 8/8=[1]",
    code: [7, 6, 4, 1],
    hint: "SOLVE THE EQUATIONS"
  },
  {
    // Logic: Positional extraction
    text: "ALPHA: [9]281 // BETA: 7[1]52 // GAMMA: 63[4]9 // DELTA: 108[5]",
    code: [9, 1, 4, 5],
    hint: "DIAGONAL EXTRACTION (1st, 2nd, 3rd, 4th)"
  },
  {
    // Logic: Hex/Color codes? Maybe too hard.
    // Logic: "Hidden in plain sight" - Capital letters spell numbers? No.
    // Simple Substitution
    text: "KEY_1: A=1, B=2, C=3... CODE: C-[3] // A-[1] // D-[4] // B-[2]",
    code: [3, 1, 4, 2],
    hint: "ALPHABETIC INDEX"
  }
];

export const CodeBreaker: React.FC<CodeBreakerProps> = ({ onComplete }) => {
  const [puzzle, setPuzzle] = useState(MEMORY_DUMPS[0]);
  const [input, setInput] = useState<string>('');
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');

  useEffect(() => {
    // Pick random puzzle
    const randomPuzzle = MEMORY_DUMPS[Math.floor(Math.random() * MEMORY_DUMPS.length)];
    setPuzzle(randomPuzzle);
  }, []);

  const handleInput = (digit: string) => {
    if (input.length < 4) {
      setInput(prev => prev + digit);
      setStatus('IDLE');
    }
  };

  const handleBackspace = () => {
    setInput(prev => prev.slice(0, -1));
    setStatus('IDLE');
  };

  const handleSubmit = () => {
    if (input.length !== 4) return;

    if (input === puzzle.code.join('')) {
      setStatus('SUCCESS');
      if ((window as any).triggerSystemTaunt) (window as any).triggerSystemTaunt('success');
      setTimeout(onComplete, 1000);
    } else {
      setStatus('ERROR');
      setInput('');
      if ((window as any).triggerSystemTaunt) (window as any).triggerSystemTaunt('fail');
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg p-4">
      {/* Log Display (The Clue) */}
      <div className="w-full flex flex-col gap-2">
        <div className="w-full rounded bg-black/50 p-6 font-mono text-sm text-green-500/80 border border-green-500/20 relative overflow-hidden shadow-[0_0_20px_rgba(34,197,94,0.1)]">
          <div className="absolute top-0 left-0 w-full bg-green-500/10 h-[2px] animate-[scan_2s_linear_infinite]" />
          <div className="mb-4 text-xs font-bold text-white/50 border-b border-white/10 pb-2 flex justify-between">
            <span>INTERCEPTED_DATA_FRAGMENT</span>
            <span className="text-yellow-500 animate-pulse">ENCRYPTED</span>
          </div>
          <div className="leading-loose tracking-wider break-words text-center text-lg font-bold">
            {puzzle.text.split('//').map((part, i) => (
              <div key={i} className="py-1">{part.trim()}</div>
            ))}
          </div>
        </div>

        {/* Hint Box - Cryptic but helpful */}
        <div className="text-center">
          <span className="text-[10px] font-bold text-[#00E6FF] border border-[#00E6FF]/30 px-2 py-1 rounded bg-[#00E6FF]/10 animate-pulse">
            SYSTEM_HINT: {puzzle.hint}
          </span>
        </div>
      </div>

      {/* Code Display */}
      <div className="flex gap-2 sm:gap-4 mt-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "flex h-12 w-10 sm:h-16 sm:w-12 items-center justify-center rounded border-2 bg-black text-xl sm:text-2xl font-bold transition-all",
              status === 'SUCCESS' ? "border-green-500 text-green-500 shadow-[0_0_15px_#22c55e]" :
                status === 'ERROR' ? "border-red-500 text-red-500" :
                  input[i] ? "border-[#00E6FF] text-[#00E6FF]" : "border-white/20 text-white/20"
            )}
          >
            {input[i] || '_'}
          </div>
        ))}
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleInput(num.toString())}
            className="flex h-12 items-center justify-center rounded bg-white/5 text-lg font-bold text-white hover:bg-[#00E6FF]/20 hover:text-[#00E6FF] active:scale-95 transition-all"
          >
            {num}
          </button>
        ))}
        <button
          onClick={handleBackspace}
          className="flex h-12 items-center justify-center rounded bg-white/5 text-sm font-bold text-red-400 hover:bg-red-500/20 hover:text-red-500 transition-all"
        >
          CLR
        </button>
        <button
          onClick={() => handleInput('0')}
          className="flex h-12 items-center justify-center rounded bg-white/5 text-lg font-bold text-white hover:bg-[#00E6FF]/20 hover:text-[#00E6FF] transition-all"
        >
          0
        </button>
        <button
          onClick={handleSubmit}
          className="flex h-12 items-center justify-center rounded bg-[#00E6FF]/20 text-sm font-bold text-[#00E6FF] hover:bg-[#00E6FF] hover:text-black shadow-[0_0_10px_rgba(0,230,255,0.2)] transition-all"
        >
          <Unlock size={18} />
        </button>
      </div>

      <div className="text-center text-xs text-white/30 font-mono">
        ANALYZE FRAGMENT PATTERNS.<br />
        INPUT 4-DIGIT PIN TO DECRYPT.
      </div>
    </div>
  );
};
