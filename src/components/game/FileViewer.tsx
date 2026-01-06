import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Github, Linkedin, Twitter, FolderOpen, FileText, Image as ImageIcon, Share2 } from 'lucide-react';
import { NodeType } from './NetworkHub';
import { cn } from '../../lib/utils';

interface FileViewerProps {
  type: NodeType;
  onClose: () => void;
}

// Mock Data Structure simulating a file system
const FILE_SYSTEM = {
  'TEAM': {
    name: 'PERSONNEL',
    files: [
      { id: 't1', name: 'Alex_V_Profile.enc', type: 'img', content: 'Lead Architect: Alex V. // Clearance: L5' },
      { id: 't2', name: 'Sarah_K_Profile.enc', type: 'img', content: 'Neural Eng: Sarah K. // Clearance: L4' },
      { id: 't3', name: 'Payroll_Data.csv', type: 'doc', content: 'Encrypted financial records...' },
    ]
  },
  'PROJECTS': {
    name: 'BLUEPRINTS',
    files: [
      { id: 'p1', name: 'Chimera_Schematic.pdf', type: 'img', content: 'Project Chimera: Neural Link Interface V1' },
      { id: 'p2', name: 'Titan_Protocol.log', type: 'doc', content: 'Titan Protocol Status: ON HOLD. Reason: Safety violation.' },
      { id: 'p3', name: 'Icarus_Failure_Report.txt', type: 'doc', content: 'Test #492: Signal propagation failed at 40,000ft.' },
    ]
  },
  'SOCIALS': {
    name: 'COMMS_LOGS',
    files: [
      { id: 's1', name: 'Twitter_Dump.json', type: 'doc', content: '@utech_official: "The future is now." [10k RTs]' },
      { id: 's2', name: 'LinkedIn_Connections.csv', type: 'doc', content: '500+ Connections. Network strength: High.' },
    ]
  },
  'VISION': {
    name: 'MANIFESTO',
    files: [
      { id: 'v1', name: 'Keynote_Speech_2024.txt', type: 'doc', content: '"We do not grow the future; we construct it."' },
      { id: 'v2', name: 'Mission_Statement.doc', type: 'doc', content: 'To blur the line between biological and digital existence.' },
    ]
  }
};

export const FileViewer: React.FC<FileViewerProps> = ({ type, onClose }) => {
  // If type is DATABASE, we show the "Root" view with folders for all other types
  // If type is a specific node (which shouldn't happen in new flow unless debugging), we show just that.
  
  const isRoot = type === 'DATABASE';
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<any | null>(null);

  const folders = Object.keys(FILE_SYSTEM);

  const handleShare = () => {
    const text = "I just breached the Utech Corp Mainframe! Can you crack the security? #UtechBreach";
    const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative flex h-[80vh] w-full max-w-5xl overflow-hidden rounded-xl border border-[#00E6FF] bg-[#0A0A0F] shadow-[0_0_100px_rgba(0,230,255,0.1)] flex-col md:flex-row"
      >
        {/* Sidebar / Folder Tree */}
        <div className="w-full md:w-64 border-b md:border-r border-[#00E6FF]/30 bg-[#00E6FF]/5 p-4 flex flex-col gap-2">
           <div className="mb-4 flex items-center gap-2 font-mono text-xs font-bold text-[#00E6FF]">
              <FolderOpen size={16} /> ROOT_DIRECTORY
           </div>
           
           {folders.map(folderKey => (
             <button
               key={folderKey}
               onClick={() => { setCurrentFolder(folderKey); setSelectedFile(null); }}
               className={cn(
                 "flex items-center gap-2 rounded px-3 py-2 text-xs font-mono transition-colors text-left",
                 currentFolder === folderKey 
                   ? "bg-[#00E6FF]/20 text-[#00E6FF] border border-[#00E6FF]/30" 
                   : "text-white/60 hover:bg-white/5 hover:text-white"
               )}
             >
               <FolderOpen size={14} />
               {FILE_SYSTEM[folderKey as keyof typeof FILE_SYSTEM].name}
             </button>
           ))}
        </div>

        {/* File Browser Area */}
        <div className="flex-1 flex flex-col bg-black/40">
           {/* Header */}
           <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div className="font-mono text-xs text-white/50">
                 PATH: /ROOT/{currentFolder ? FILE_SYSTEM[currentFolder as keyof typeof FILE_SYSTEM].name : ""}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 rounded-full bg-[#00E6FF]/10 px-3 py-1 text-[10px] font-bold text-[#00E6FF] hover:bg-[#00E6FF]/20 transition-colors"
                >
                  <Share2 size={12} /> SHARE_BREACH
                </button>
                <button onClick={onClose} className="rounded-full p-1 hover:bg-white/10 transition-colors">
                  <X size={20} className="text-white/70" />
                </button>
              </div>
           </div>

           {/* Content */}
           <div className="flex-1 p-8 overflow-y-auto">
              {!currentFolder ? (
                 <div className="flex h-full flex-col items-center justify-center text-white/30">
                    <FolderOpen size={48} className="mb-4 opacity-50" />
                    <p className="font-mono text-sm">SELECT A DIRECTORY TO BROWSE</p>
                 </div>
              ) : (
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {FILE_SYSTEM[currentFolder as keyof typeof FILE_SYSTEM].files.map((file) => (
                       <button
                         key={file.id}
                         onClick={() => setSelectedFile(file)}
                         className={cn(
                           "flex flex-col items-center gap-3 rounded-xl border p-4 transition-all hover:bg-white/5",
                           selectedFile?.id === file.id ? "border-[#00E6FF] bg-[#00E6FF]/10" : "border-white/5 bg-transparent"
                         )}
                       >
                          <div className="h-12 w-12 flex items-center justify-center rounded bg-white/5 text-[#00E6FF]">
                             {file.type === 'img' ? <ImageIcon /> : <FileText />}
                          </div>
                          <span className="w-full truncate text-center font-mono text-[10px] text-white/70">
                             {file.name}
                          </span>
                       </button>
                    ))}
                 </div>
              )}
           </div>

           {/* Preview Pane (Bottom) */}
           {selectedFile && (
              <div className="border-t border-white/10 bg-[#0A0A0F] p-6 h-48 overflow-y-auto">
                 <h3 className="mb-2 font-bold text-[#00E6FF] text-sm flex items-center gap-2">
                    {selectedFile.type === 'img' ? <ImageIcon size={14} /> : <FileText size={14} />}
                    {selectedFile.name}
                 </h3>
                 <div className="font-mono text-xs text-white/60">
                    {selectedFile.content}
                 </div>
              </div>
           )}
        </div>
      </motion.div>
    </div>
  );
};
