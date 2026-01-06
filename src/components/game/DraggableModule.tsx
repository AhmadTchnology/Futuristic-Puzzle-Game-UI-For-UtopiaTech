import React, { useState } from 'react';
import { motion, PanInfo, useAnimation } from 'motion/react';
import { GameModule } from './types';
import { Database, Layout, Lock, GripVertical } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DraggableModuleProps {
  module: GameModule;
  onDragStart?: () => void;
  onDragEnd?: (info: PanInfo) => void;
  isPlaced?: boolean;
}

const IconMap: Record<string, any> = {
  'Database': Database,
  'Layout': Layout,
  'Lock': Lock
};

export const DraggableModule: React.FC<DraggableModuleProps> = ({ module, onDragStart, onDragEnd, isPlaced }) => {
  const Icon = IconMap[module.icon] || Database;
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);

  if (isPlaced) {
    return null; // Don't render in the sidebar if placed
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      whileHover={{ scale: 1.05, cursor: 'grab' }}
      whileDrag={{ scale: 1.1, cursor: 'grabbing', zIndex: 50 }}
      onDragStart={() => {
        setIsDragging(true);
        onDragStart?.();
      }}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        onDragEnd?.(info);
        controls.start({ x: 0, y: 0 }); // Snap back if not handled by parent
      }}
      animate={controls}
      className={cn(
        "relative flex w-full items-center gap-4 rounded-xl border border-white/10 bg-[#12121A] p-4 backdrop-blur-md transition-colors",
        isDragging ? "border-transparent" : "hover:border-white/20"
      )}
      style={{
        boxShadow: isDragging 
          ? `0 0 30px ${module.color}66, 0 0 10px ${module.color}, inset 0 0 20px ${module.color}33` 
          : `0 0 0px transparent`
      }}
    >
      {/* Motion Blur / Trail Effect (Simulated with pseudo-elements or opacity layers if needed, 
          but the box-shadow above handles the 'light' trail well) */}
      
      {/* Grip Handle */}
      <div className="flex h-8 w-6 items-center justify-center rounded bg-white/5 text-white/30">
        <GripVertical size={16} />
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold tracking-wider" style={{ color: module.color, textShadow: `0 0 10px ${module.color}` }}>
            {module.label}
          </h3>
        </div>
        <p className="text-xs text-white/50">{module.subLabel}</p>
      </div>

      {/* Icon */}
      <div 
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/40"
        style={{ color: module.color }}
      >
        <Icon size={20} />
      </div>

      {/* Connection Point Graphic */}
      <div className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white/20" />
    </motion.div>
  );
};
