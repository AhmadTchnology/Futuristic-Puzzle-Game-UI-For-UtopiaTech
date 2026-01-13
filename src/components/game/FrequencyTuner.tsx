import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

interface FrequencyTunerProps {
  targetFreq: number; // 0-100
  onSuccess: () => void;
  onCancel: () => void;
}

export const FrequencyTuner: React.FC<FrequencyTunerProps> = ({ targetFreq, onSuccess, onCancel }) => {
  const [currentFreq, setCurrentFreq] = useState(50);
  const [isLocked, setIsLocked] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simulation loop
  useEffect(() => {
    let animationFrame: number;

    const loop = () => {
      // Check if close enough (within 5%)
      const diff = Math.abs(currentFreq - targetFreq);

      if (diff < 5) {
        setProgress(p => Math.min(p + 2, 100));
      } else {
        setProgress(p => Math.max(p - 5, 0));
      }

      if (progress >= 100 && !isLocked) {
        setIsLocked(true);
        setTimeout(onSuccess, 500);
      }

      animationFrame = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animationFrame);
  }, [currentFreq, targetFreq, progress, isLocked, onSuccess]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-sm rounded-xl border border-[#00E6FF] bg-[#0A0A0F] p-4 sm:p-6 shadow-[0_0_50px_rgba(0,230,255,0.2)]">
        <h3 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest text-[#00E6FF]">
          <Activity size={16} />
          SIGNAL_CALIBRATION
        </h3>

        {/* Waveform Visualizer */}
        <div className="relative mb-6 h-32 w-full overflow-hidden rounded-lg bg-black/50 border border-white/10">
          {/* Target Wave (Ghost) */}
          <Waveform frequency={targetFreq} color="rgba(255, 255, 255, 0.2)" speed={1} />

          {/* User Wave */}
          <Waveform frequency={currentFreq} color={progress > 50 ? "#00E6FF" : "#EF4444"} speed={1} />
        </div>

        {/* Slider Control */}
        <div className="mb-2">
          <input
            type="range"
            min="0"
            max="100"
            value={currentFreq}
            onChange={(e) => setCurrentFreq(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-[#00E6FF]"
          />
        </div>
        <div className="mb-4 flex justify-between text-[10px] font-mono text-white/40">
          <span>LOW_FREQ</span>
          <span>HIGH_FREQ</span>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-[#00E6FF]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-center text-[10px] font-mono text-[#00E6FF]">
          MATCH: {progress.toFixed(0)}%
        </div>

        <button
          onClick={onCancel}
          className="mt-6 w-full rounded border border-white/10 bg-white/5 py-2 text-xs text-white/60 hover:bg-white/10"
        >
          ABORT SEQUENCE
        </button>
      </div>
    </div>
  );
};

const Waveform = ({ frequency, color, speed }: { frequency: number, color: string, speed: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Handle resizing
    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const freqMultiplier = 0.05 + (frequency / 100) * 0.2; // Map 0-100 to sensible wave range

    let animationFrame: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      for (let x = 0; x < canvas.width; x++) {
        // Sine wave formula
        const y = canvas.height / 2 + Math.sin(x * freqMultiplier + time) * (canvas.height / 3);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      time += 0.1 * speed;
      animationFrame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, [frequency, color, speed]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};
