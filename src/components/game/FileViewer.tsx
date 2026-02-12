import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, FolderOpen, FileText, Image as ImageIcon, Share2 } from 'lucide-react';
import { NodeType } from './NetworkHub';
import { cn } from '../../lib/utils';

interface FileViewerProps {
  type: NodeType;
  onClose: () => void;
}

// Mock Data Structure simulating a file system
const FILE_SYSTEM = {
  'TEAM': {
    name: 'team',
    files: [
      { id: 't1', name: 'team.txt', type: 'txt', content: 'uTech Team: /Ahmed Hussein -Ui/Ux Design /Ahmed Shukur -Backend Developer /Mustafa Samir -Frontend Developer /Ahmed Ramzy -Video Editor' },
    ]
  },
  'SOCIALS': {
    name: 'social media',
    files: [
      { id: 's1', name: 'instagram.txt', type: 'txt', content: 'Instagram: @u.topiatech' },
    ]
  },
  'VISION': {
    name: 'who are we',
    files: [
      { id: 'v1', name: 'about_us.txt', type: 'txt', content: 'UTech (Utopia Tech) Baghdad’s Next-Gen Dev Collective. We turn messy sketches into deployed systems. Specializing in Web, Apps, and Logic-based Games. We don’t wait for the future. We build it.' },
    ]
  }
};

export const FileViewer: React.FC<FileViewerProps> = ({ type, onClose }) => {
  // If type is DATABASE, we show the "Root" view with folders for all other types
  // If type is a specific node (which shouldn't happen in new flow unless debugging), we show just that.

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
        className="relative flex h-[90vh] md:h-[80vh] w-full max-w-5xl overflow-hidden rounded-xl border border-[#00E6FF] bg-[#0A0A0F] shadow-[0_0_100px_rgba(0,230,255,0.1)] flex-col md:flex-row"
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 p-3 sm:p-4 gap-2 sm:gap-0">
            <div className="font-mono text-[10px] sm:text-xs text-white/50 truncate w-full sm:w-auto">
              PATH: /ROOT/{currentFolder ? FILE_SYSTEM[currentFolder as keyof typeof FILE_SYSTEM].name : ""}
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 rounded-full bg-[#00E6FF]/10 px-3 py-1 text-[10px] font-bold text-[#00E6FF] hover:bg-[#00E6FF]/20 transition-colors"
              >
                <Share2 size={12} /> <span className="hidden sm:inline">SHARE_BREACH</span><span className="sm:hidden">SHARE</span>
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

          {selectedFile && (
            <div className="border-t border-white/10 bg-[#0A0A0F] p-4 sm:p-6 h-32 sm:h-48 overflow-y-auto">
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
