import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Lock, Unlock, Database, Users, Briefcase, Eye, Share2, Shield, User, ShieldAlert, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

export type NodeType = 'TEAM' | 'PROJECTS' | 'SOCIALS' | 'VISION' | 'DATABASE' | 'IDENTITY' | 'SECURITY' | 'POWER';

interface NetworkNode {
  id: NodeType;
  label: string;
  subLabel: string;
  icon: React.ReactNode;
  locked: boolean;
  completed: boolean;
}

interface NetworkHubProps {
  completedNodes: NodeType[];
  onNodeClick: (node: NodeType) => void;
  onDatabaseClick: () => void;
  onShowAnalysis?: () => void;
}

export const NetworkHub: React.FC<NetworkHubProps> = ({ completedNodes, onNodeClick, onDatabaseClick, onShowAnalysis }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const initialNodes: NetworkNode[] = [
    { id: 'TEAM', label: 'PERSONNEL', subLabel: 'HR_RECORDS', icon: <Users />, locked: false, completed: completedNodes.includes('TEAM') },
    { id: 'PROJECTS', label: 'PROJECTS', subLabel: 'R&D_LABS', icon: <Briefcase />, locked: false, completed: completedNodes.includes('PROJECTS') },
    { id: 'SOCIALS', label: 'SOCIAL', subLabel: 'COMMS_LOGS', icon: <Share2 />, locked: false, completed: completedNodes.includes('SOCIALS') },
    { id: 'VISION', label: 'VISION', subLabel: 'CORP_DATA', icon: <Eye />, locked: false, completed: completedNodes.includes('VISION') },
    { id: 'SECURITY', label: 'FIREWALL', subLabel: 'IDS_LAYER', icon: <ShieldAlert />, locked: false, completed: completedNodes.includes('SECURITY') },
    { id: 'POWER', label: 'POWER', subLabel: 'GRID_CONTROL', icon: <Zap />, locked: false, completed: completedNodes.includes('POWER') },
  ];

  const allSubNodesCompleted = initialNodes.every(n => n.completed);

  // If all basic nodes are completed, add the IDENTITY node
  const nodes = [...initialNodes];
  if (allSubNodesCompleted) {
    nodes.push({
      id: 'IDENTITY',
      label: 'IDENTITY',
      subLabel: 'ANALYSIS',
      icon: <User />,
      locked: false,
      completed: true, // It's considered "unlocked/available"
    });
  }

  return (
    <div 
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-[#050508] perspective-[1000px]"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div 
          className="h-full w-full"
          style={{
            backgroundImage: 'linear-gradient(#00E6FF 1px, transparent 1px), linear-gradient(90deg, #00E6FF 1px, transparent 1px)',
            backgroundSize: '100px 100px',
            transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)',
          }}
        />
      </div>

      <div className="relative flex h-full w-full items-center justify-center transform-style-3d">
        
        {/* Rotating Network Container */}
        <motion.div 
           className="relative flex h-[600px] w-[600px] items-center justify-center"
           animate={{ rotate: 360 }}
           transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
           {/* Complex Connections Lines (Zigzag/Interfaced) */}
           <svg className="absolute inset-0 h-full w-full pointer-events-none animate-[pulse_4s_ease-in-out_infinite]" style={{ transform: 'scale(1.2)' }}>
              <defs>
                 <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="50%" stopColor="#00E6FF" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="transparent" />
                 </linearGradient>
              </defs>
              
              {/* Central Web */}
              <circle cx="50%" cy="50%" r="100" fill="none" stroke="#00E6FF" strokeWidth="1" strokeDasharray="10,5" opacity="0.3" />
              <circle cx="50%" cy="50%" r="200" fill="none" stroke="#00E6FF" strokeWidth="1" strokeDasharray="2,10" opacity="0.2" />
              <circle cx="50%" cy="50%" r="280" fill="none" stroke="#00E6FF" strokeWidth="2" strokeDasharray="20,20" opacity="0.1" />

              {/* Hexagon Connections */}
              {Array.from({ length: 6 }).map((_, i) => {
                 const angle = (i * 60) * (Math.PI / 180);
                 const x1 = 300 + Math.cos(angle) * 100;
                 const y1 = 300 + Math.sin(angle) * 100;
                 const x2 = 300 + Math.cos(angle) * 250;
                 const y2 = 300 + Math.sin(angle) * 250;
                 return (
                    <path key={i} d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke="url(#lineGrad)" strokeWidth="1" />
                 );
              })}
           </svg>

           {/* Central Core (Counter-Rotating to stay upright relative to user? No, let it spin but icons stay upright) */}
           <motion.div 
             className="absolute z-20"
             animate={{ rotate: -360 }}
             transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
           >
              <button
                onClick={onDatabaseClick}
                disabled={!allSubNodesCompleted}
                className={cn(
                  "group relative flex h-32 w-32 items-center justify-center rounded-full bg-black/90 backdrop-blur-xl transition-all duration-500",
                  allSubNodesCompleted 
                    ? "cursor-pointer shadow-[0_0_80px_#00E6FF] border border-[#00E6FF]" 
                    : "cursor-not-allowed opacity-80 grayscale border border-white/10"
                )}
              >
                <Database size={40} className={cn("transition-colors", allSubNodesCompleted ? "text-[#00E6FF]" : "text-white/20")} />
                {/* Status Indicator */}
                <div className="absolute -bottom-8 whitespace-nowrap text-[10px] font-mono tracking-widest text-[#00E6FF]">
                   {allSubNodesCompleted ? "ROOT ACCESS" : "LOCKED"}
                </div>
              </button>
           </motion.div>

           {/* Satellites */}
           {nodes.map((node, i) => {
             // Dynamic layout calculation based on number of nodes
             const totalNodes = nodes.length;
             
             // Distribute evenly in a circle starting from top ( -90 degrees)
             const angle = (i * (360 / totalNodes)) - 90;

             const radius = 240; // Distance from center
             const rad = angle * (Math.PI / 180);
             const x = Math.cos(rad) * radius;
             const y = Math.sin(rad) * radius;

             return (
               <motion.div
                 key={node.id}
                 layout // Animate position changes when array changes
                 className="absolute"
                 style={{ x, y }}
                 transition={{ type: "spring", stiffness: 50, damping: 20 }}
               >
                 <motion.button
                   onClick={() => {
                     if (node.id === 'IDENTITY' && onShowAnalysis) {
                       onShowAnalysis();
                     } else if (!node.completed) {
                       onNodeClick(node.id);
                     }
                   }}
                   animate={{ rotate: -360 }} // Counter rotation
                   transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                   className={cn(
                     "relative flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border bg-black/90 p-2 backdrop-blur-md transition-all duration-300 shadow-xl",
                     node.id === 'IDENTITY'
                        ? "border-[#F0E68C] text-[#F0E68C] shadow-[0_0_30px_rgba(240,230,140,0.3)] z-30"
                        : node.completed 
                           ? "border-[#00E6FF] text-[#00E6FF] shadow-[0_0_30px_rgba(0,230,255,0.3)]" 
                           : "border-white/20 text-white hover:border-[#00E6FF]/50"
                   )}
                 >
                    {node.id === 'IDENTITY' ? (
                       <User size={24} />
                    ) : (
                       node.completed ? <Unlock size={20} /> : <Shield size={20} />
                    )}
                    
                    <div className="text-[10px] font-bold tracking-widest">{node.label}</div>
                    
                    {/* Status Dot */}
                    <div className={cn(
                       "absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-black",
                       node.id === 'IDENTITY' 
                          ? "bg-[#F0E68C] animate-pulse" 
                          : node.completed ? "bg-[#00E6FF]" : "bg-red-500 animate-pulse"
                    )} />
                 </motion.button>
               </motion.div>
             );
           })}

        </motion.div>

      </div>
      
      {/* Decorative Overlay */}
      <div className="pointer-events-none absolute inset-0 z-50 bg-[radial-gradient(circle_at_center,transparent_50%,#000000_100%)] opacity-80" />
      <div className="pointer-events-none absolute bottom-8 right-8 text-right font-mono text-xs text-white/30">
         NETWORK_TOPOLOGY: RING_MESH_V4<br/>
         STATUS: ACTIVE_SCANNING
      </div>
      
    </div>
  );
};
