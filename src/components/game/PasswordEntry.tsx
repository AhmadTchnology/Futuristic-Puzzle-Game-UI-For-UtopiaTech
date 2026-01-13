import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { BackgroundEffects } from './Intro';

interface PasswordEntryProps {
    onComplete: () => void;
    userName: string;
}

export const PasswordEntry: React.FC<PasswordEntryProps> = ({ onComplete, userName }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'Utech2026') {
            onComplete();
        } else {
            setError(true);
            setPassword('');
            setTimeout(() => setError(false), 1000);
            setShowHint(true);
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-6 relative z-10 w-full max-w-md px-6"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-[#B066FF] blur-[40px] opacity-30 animate-pulse" />
                    <Lock className={cn("relative z-10 h-16 w-16 mb-4 transition-colors", error ? "text-red-500" : "text-[#B066FF]")} />
                </div>

                <div className="text-center space-y-2">
                    <div className="text-[#B066FF] font-mono text-sm tracking-widest mb-2 animate-pulse">
                        WELCOME, {userName.toUpperCase()}
                    </div>
                    <h2 className="text-2xl font-bold tracking-[0.2em] text-white">SYSTEM LOCKED</h2>
                    <p className="text-white/50 text-xs md:text-sm font-mono">ENTER UTECH PASSPHRASE</p>
                </div>

                <form onSubmit={handleSubmit} className="relative w-full max-w-xs flex flex-col items-center">
                    <input
                        autoFocus
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="PASSWORD..."
                        className={cn(
                            "w-full bg-transparent border-b-2 py-2 text-center text-xl md:text-2xl font-bold outline-none transition-all font-mono tracking-wider",
                            error ? "border-red-500 text-red-500 placeholder:text-red-500/50" : "border-white/20 text-white focus:border-[#B066FF] focus:shadow-[0_10px_20px_-10px_#B066FF]"
                        )}
                    />

                    <div className="h-12" />

                    <button
                        type="submit"
                        className="group relative px-12 py-3 bg-[#B066FF]/10 border border-[#B066FF]/50 text-[#B066FF] font-mono text-sm tracking-widest hover:bg-[#B066FF] hover:text-black transition-all duration-300 flex items-center gap-2 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[#B066FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10">UNLOCK</span>
                        <ChevronRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <AnimatePresence>
                    {showHint && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-center space-y-1 mt-4"
                        >
                            <div className="text-red-400 text-xs font-bold tracking-widest">ACCESS DENIED</div>
                            <div className="text-white/40 text-xs font-mono">
                                HINT: The Team Name + Current Year<br />
                                <span className="text-[#B066FF]">(e.g. U...20..)</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};
