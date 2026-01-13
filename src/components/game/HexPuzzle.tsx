import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { Zap, RotateCw, Lock, Unlock } from 'lucide-react';

// --- Types ---
interface HexTile {
  id: number;
  q: number;
  r: number;
  type: 'STRAIGHT' | 'CORNER' | 'TRI' | 'EMPTY' | 'SOURCE' | 'TARGET';
  rotation: number; // 0 to 5
  fixed: boolean;
  active: boolean;
}

interface PuzzleProps {
  onComplete: (stats: { moves: number; time: number }) => void;
}

// --- Hex Utils ---
const DIRECTIONS = [
  { q: 1, r: -1 }, // 0: NE
  { q: 1, r: 0 },  // 1: E
  { q: 0, r: 1 },  // 2: SE
  { q: -1, r: 1 }, // 3: SW
  { q: -1, r: 0 }, // 4: W
  { q: 0, r: -1 }, // 5: NW
];

const TILE_DEFINITIONS = {
  'STRAIGHT': [0, 3],
  'CORNER': [1, 3],
  'TRI': [0, 2, 4],
  'SOURCE': [0, 1, 2, 3, 4, 5],
  'TARGET': [0, 1, 2, 3, 4, 5],
  'EMPTY': []
};

// Larger, more complex grid
const COMPLEX_GRID: HexTile[] = [
  // Center (Target)
  { id: 0, q: 0, r: 0, type: 'TARGET', rotation: 0, fixed: true, active: false },

  // Ring 1
  { id: 1, q: 0, r: -1, type: 'STRAIGHT', rotation: 0, fixed: false, active: false },
  { id: 2, q: 1, r: -1, type: 'CORNER', rotation: 0, fixed: false, active: false },
  { id: 3, q: 1, r: 0, type: 'TRI', rotation: 0, fixed: false, active: false },
  { id: 4, q: 0, r: 1, type: 'STRAIGHT', rotation: 0, fixed: false, active: false },
  { id: 5, q: -1, r: 1, type: 'CORNER', rotation: 0, fixed: false, active: false },
  { id: 6, q: -1, r: 0, type: 'TRI', rotation: 0, fixed: false, active: false },

  // Ring 2 (Partial)
  { id: 7, q: 0, r: -2, type: 'CORNER', rotation: 0, fixed: false, active: false },
  { id: 8, q: 1, r: -2, type: 'STRAIGHT', rotation: 0, fixed: false, active: false },
  { id: 9, q: 2, r: -2, type: 'TRI', rotation: 0, fixed: false, active: false },
  { id: 10, q: 2, r: -1, type: 'CORNER', rotation: 0, fixed: false, active: false },
  { id: 11, q: 2, r: 0, type: 'STRAIGHT', rotation: 0, fixed: false, active: false },
  { id: 12, q: 1, r: 1, type: 'TRI', rotation: 0, fixed: false, active: false },
  { id: 13, q: 0, r: 2, type: 'CORNER', rotation: 0, fixed: false, active: false },
  { id: 14, q: -1, r: 2, type: 'STRAIGHT', rotation: 0, fixed: false, active: false },
  { id: 15, q: -2, r: 2, type: 'TRI', rotation: 0, fixed: false, active: false },
  { id: 16, q: -2, r: 1, type: 'CORNER', rotation: 0, fixed: false, active: false },
  { id: 17, q: -2, r: 0, type: 'STRAIGHT', rotation: 0, fixed: false, active: false },
  { id: 18, q: -1, r: -1, type: 'TRI', rotation: 0, fixed: false, active: false },

  // Sources (Far out)
  { id: 99, q: 0, r: -3, type: 'SOURCE', rotation: 0, fixed: true, active: true },
  { id: 98, q: -3, r: 3, type: 'SOURCE', rotation: 0, fixed: true, active: true },
];

export const HexPuzzle: React.FC<PuzzleProps> = ({ onComplete }) => {
  const [grid, setGrid] = useState<HexTile[]>(COMPLEX_GRID);
  const [moves, setMoves] = useState(0);
  const [startTime] = useState(Date.now());
  const [isReadyToUnlock, setIsReadyToUnlock] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize with randomization
  useEffect(() => {
    const randomized = COMPLEX_GRID.map(t => {
      if (t.fixed) return t;
      return { ...t, rotation: Math.floor(Math.random() * 6) };
    });
    setGrid(updateSignalFlow(randomized));
  }, []);

  const getPorts = useCallback((tile: HexTile) => {
    let base = TILE_DEFINITIONS[tile.type] || [];
    if (tile.type === 'CORNER') base = [1, 3];
    if (tile.type === 'STRAIGHT') base = [0, 3];
    if (tile.type === 'TRI') base = [0, 2, 4];
    return base.map(p => (p + tile.rotation) % 6);
  }, []);

  const updateSignalFlow = useCallback((currentGrid: HexTile[]) => {
    const nextGrid = currentGrid.map(t => ({
      ...t,
      active: t.type === 'SOURCE'
    }));

    const queue = nextGrid.filter(t => t.type === 'SOURCE');
    const visited = new Set<number>();
    queue.forEach(t => visited.add(t.id));

    while (queue.length > 0) {
      const current = queue.shift()!;
      const currentPorts = getPorts(current);

      currentPorts.forEach(portDir => {
        const dirOffset = DIRECTIONS[portDir];
        const neighborQ = current.q + dirOffset.q;
        const neighborR = current.r + dirOffset.r;

        const neighbor = nextGrid.find(t => t.q === neighborQ && t.r === neighborR);

        if (neighbor && !visited.has(neighbor.id)) {
          const neighborPorts = getPorts(neighbor);
          const requiredBackPort = (portDir + 3) % 6;

          if (neighborPorts.includes(requiredBackPort)) {
            neighbor.active = true;
            visited.add(neighbor.id);
            queue.push(neighbor);
          }
        }
      });
    }
    return nextGrid;
  }, [getPorts]);

  const handleRotate = (id: number) => {
    if (isCompleted) return;

    setGrid(prev => {
      const newGrid = prev.map(tile => {
        if (tile.id === id && !tile.fixed) {
          return { ...tile, rotation: (tile.rotation + 1) % 6 };
        }
        return tile;
      });
      return updateSignalFlow(newGrid);
    });

    setMoves(m => m + 1);
  };

  const handleUnlock = () => {
    if (isReadyToUnlock) {
      setIsCompleted(true);
      const timeTaken = (Date.now() - startTime) / 1000;
      setTimeout(() => {
        onComplete({ moves, time: timeTaken });
      }, 1500);
    }
  };

  useEffect(() => {
    const target = grid.find(t => t.type === 'TARGET');
    setIsReadyToUnlock(!!target?.active);
  }, [grid]);

  // Viewport calculation
  const hexSize = 55; // Optimized for 800x600 container
  const getHexCoords = (q: number, r: number) => {
    const x = hexSize * (Math.sqrt(3) * (q + r / 2));
    const y = hexSize * (3 / 2 * r);
    return { x, y };
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-[#050508]/80">

      {/* HUD Info */}
      <div className="absolute top-4 right-4 text-right font-mono text-xs text-[#00E6FF]/70 z-50 pointer-events-none">
        <div className="text-xl font-bold">{isReadyToUnlock ? "LINK ESTABLISHED" : "NO CARRIER"}</div>
        <div>NODES: {grid.length}</div>
        <div>HOP_COUNT: {moves}</div>
      </div>

      <div className="relative h-[600px] w-full max-w-[800px] scale-[0.55] sm:scale-75 md:scale-100 touch-none transition-transform duration-300">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {grid.map((tile) => {
            const { x, y } = getHexCoords(tile.q, tile.r);
            return (
              <Tile
                key={tile.id}
                tile={tile}
                x={x}
                y={y}
                onClick={() => tile.type === 'TARGET' ? handleUnlock() : handleRotate(tile.id)}
                isReadyToUnlock={isReadyToUnlock && tile.type === 'TARGET'}
                isCompleted={isCompleted && tile.type === 'TARGET'}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Tile = React.memo(({ tile, x, y, onClick, isReadyToUnlock, isCompleted }: {
  tile: HexTile, x: number, y: number, onClick: () => void, isReadyToUnlock?: boolean, isCompleted?: boolean
}) => {
  const isTarget = tile.type === 'TARGET';

  return (
    <motion.div
      className={cn(
        "absolute flex h-[70px] w-[60px] items-center justify-center", // Adjusted size
        !tile.fixed || isTarget ? "cursor-pointer" : "pointer-events-none",
        tile.fixed && !isTarget ? "opacity-50" : "opacity-100",
        isTarget && "z-10"
      )}
      style={{
        left: x,
        top: y,
        marginLeft: -30,
        marginTop: -35,
      }}
      initial={false}
      onClick={onClick}
    >
      <motion.div
        animate={{ rotate: tile.rotation * 60 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative h-full w-full"
      >
        <svg viewBox="0 0 100 115" className="drop-shadow-lg overflow-visible">
          <path
            d="M50 0 L93.3 25 V75 L50 100 L6.7 75 V25 Z"
            className={cn(
              "fill-[#12121A] stroke-2 transition-colors duration-200",
              tile.active ? "stroke-[#00E6FF] fill-[#12121A]/80" : "stroke-white/10",
              isTarget && tile.active && "fill-[#B066FF]/20 stroke-[#B066FF]",
              isCompleted && "fill-[#00E6FF] stroke-white shadow-[0_0_50px_white]"
            )}
          />

          <g className={cn(
            "stroke-[8] stroke-linecap-round transition-colors duration-100",
            tile.active ? "stroke-[#00E6FF]" : "stroke-[#333]"
          )}>
            {tile.type === 'STRAIGHT' && <path d="M 75 12 L 25 88" />}
            {tile.type === 'CORNER' && <path d="M 93 50 L 50 50 L 25 88" />}
            {tile.type === 'TRI' && <path d="M 75 12 L 50 50 M 75 88 L 50 50 M 6 50 L 50 50" />}
            {tile.type === 'SOURCE' && <circle cx="50" cy="50" r="12" className="fill-[#00E6FF]" />}
          </g>
        </svg>

        {isTarget && (
          <div className="absolute inset-0 flex items-center justify-center rotate-[-0deg]">
            <motion.div
              animate={{ scale: isReadyToUnlock ? 1.2 : 1 }}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 bg-black/80 backdrop-blur-md transition-all",
                isCompleted ? "border-white bg-[#00E6FF] text-black" :
                  isReadyToUnlock ? "border-[#00E6FF] text-[#00E6FF] shadow-[0_0_20px_#00E6FF] animate-pulse cursor-pointer" : "border-white/10 text-white/20"
              )}
            >
              {isCompleted ? <Zap size={16} /> : isReadyToUnlock ? <Unlock size={16} /> : <Lock size={12} />}
            </motion.div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
});
