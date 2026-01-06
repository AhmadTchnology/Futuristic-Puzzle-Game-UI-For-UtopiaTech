import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { BackgroundEffects } from './Intro';

interface NameEntryProps {
    onComplete: (name: string) => void;
}

export const NameEntry: React.FC<NameEntryProps> = ({ onComplete }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim().length > 0) {
            onComplete(name.trim());
        } else {
            setError(true);
            setTimeout(() => setError(false), 1000);
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white overflow-hidden bg-[#0A0A0F]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <BackgroundEffects />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md px-6"
            >
                <div className="flex flex-col items-center gap-6">
                    {/* Icon */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#00E6FF] blur-[40px] opacity-20 animate-pulse" />
                        <User className={cn("relative z-10 h-16 w-16 mb-4 transition-colors", error ? "text-red-500" : "text-[#00E6FF]")} />
                    </div>

                    {/* Title */}
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold tracking-[0.2em] text-white">IDENTITY PROTOCOL</h2>
                        <p className="text-white/50 text-xs md:text-sm font-mono">ENTER AGENT DESIGNATION</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="relative w-full max-w-xs flex flex-col items-center gap-20">
                        <input
                            autoFocus
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="NAME..."
                            className={cn(
                                "w-full bg-transparent border-b-2 py-2 text-center text-xl md:text-2xl font-bold outline-none transition-all font-mono tracking-wider",
                                error
                                    ? "border-red-500 text-red-500 placeholder:text-red-500/50"
                                    : "border-white/20 text-white focus:border-[#00E6FF] focus:shadow-[0_10px_20px_-10px_#00E6FF]"
                            )}
                        />

                        <div className="h-12" />

                        <button
                            type="submit"
                            className="group relative px-12 py-3 bg-[#00E6FF]/10 border border-[#00E6FF]/50 text-[#00E6FF] font-mono text-sm tracking-widest hover:bg-[#00E6FF] hover:text-black transition-all duration-300 flex items-center gap-2 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-[#00E6FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative z-10">CONFIRM</span>
                            <ChevronRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
};
