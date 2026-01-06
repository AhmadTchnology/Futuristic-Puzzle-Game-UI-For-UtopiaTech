import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { toPng } from 'html-to-image';
import { Share2, Download, Copy, RefreshCw, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import exampleImage from 'figma:asset/0298e19d3ed89925d39517ac594ea1b7d707bbbf.png';

interface ResultCardProps {
  stats: { moves: number; time: number };
  onReset: () => void;
}

const ARCHETYPES = [
  { name: 'VOID ARCHITECT', desc: 'Precision over speed. You build systems that last.', color: '#B066FF', threshold: 'slow_efficient' },
  { name: 'NEON GHOST', desc: 'Fast, chaotic, but effective. You haunt the network.', color: '#00E6FF', threshold: 'fast_inefficient' },
  { name: 'DATA WARDEN', desc: 'Perfectly balanced. The system obeys your command.', color: '#FFFFFF', threshold: 'balanced' },
];

export const ResultCard: React.FC<ResultCardProps> = ({ stats, onReset }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Determine Archetype
  const getArchetype = () => {
    if (stats.time < 10 && stats.moves > 10) return ARCHETYPES[1]; // Fast but spammy
    if (stats.time > 20 && stats.moves < 8) return ARCHETYPES[0]; // Slow but calculated
    return ARCHETYPES[2]; // Balanced
  };

  const archetype = getArchetype();

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `utopia-archetype-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to download', err);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="relative perspective-1000"
      >
        {/* The Card Element to Capture */}
        <div 
          ref={cardRef}
          className="relative h-[500px] w-[320px] overflow-hidden rounded-2xl border border-white/10 bg-[#050508]"
          style={{
            boxShadow: `0 0 50px ${archetype.color}22`
          }}
        >
          {/* Background FX */}
          <div className="absolute inset-0 opacity-20" 
               style={{ 
                 backgroundImage: `linear-gradient(${archetype.color} 1px, transparent 1px), linear-gradient(90deg, ${archetype.color} 1px, transparent 1px)`,
                 backgroundSize: '30px 30px'
               }} 
          />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full blur-[80px] opacity-20" style={{ backgroundColor: archetype.color }} />

          {/* Header */}
          <div className="relative p-6 border-b border-white/10 flex justify-between items-start">
             <img src={exampleImage} alt="Logo" className="h-8 w-auto opacity-80" />
             <div className="text-[10px] font-mono text-white/40 text-right">
               ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}<br/>
               VERIFIED
             </div>
          </div>

          {/* Main Content */}
          <div className="relative flex flex-col items-center p-8 pt-12 text-center">
            <div 
              className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 bg-black/50 backdrop-blur-md"
              style={{ borderColor: archetype.color, boxShadow: `0 0 30px ${archetype.color}44` }}
            >
              <Zap size={40} style={{ color: archetype.color }} />
            </div>

            <h2 className="mb-2 text-2xl font-bold tracking-widest text-white">
              {archetype.name}
            </h2>
            <p className="mb-8 text-sm text-white/60 font-mono">
              {archetype.desc}
            </p>

            {/* Stats Grid */}
            <div className="grid w-full grid-cols-2 gap-2 rounded-lg bg-white/5 p-4 text-xs font-mono">
               <div className="text-white/40">SYNC_TIME</div>
               <div className="text-right text-[#00E6FF]">{stats.time.toFixed(1)}s</div>
               <div className="text-white/40">EFFICIENCY</div>
               <div className="text-right text-[#B066FF]">{Math.max(0, 100 - (stats.moves * 2))}%</div>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 w-full bg-white/5 p-4 text-center">
             <p className="text-[10px] tracking-[0.2em] text-white/30">UTOPIA CONSTRUCT // ACCESS GRANTED</p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
        >
          <Download size={16} />
          Save Card
        </button>
        <button className="flex items-center gap-2 rounded-full bg-[#00E6FF] px-6 py-2 text-sm font-bold text-black hover:bg-[#00E6FF]/90 transition-colors shadow-[0_0_20px_#00E6FF44]">
          <Share2 size={16} />
          Share Result
        </button>
      </div>

      <button onClick={onReset} className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors">
        <RefreshCw size={12} />
        REBOOT SYSTEM
      </button>
    </div>
  );
};
