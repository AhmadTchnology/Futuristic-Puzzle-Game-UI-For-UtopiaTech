import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Trophy, Zap, Crown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LeaderboardEntry {
    rank: number;
    operatorName: string;
    score: number;
    timeCompleted: string;
}

interface LeaderboardProps {
    onBack: () => void;
}

// Mock data - will be replaced with database connection later
const MOCK_LEADERBOARD_DATA: LeaderboardEntry[] = [
    { rank: 1, operatorName: 'PHANTOM_ZERO', score: 9850, timeCompleted: '45s' },
    { rank: 2, operatorName: 'CYBER_GHOST', score: 9720, timeCompleted: '52s' },
    { rank: 3, operatorName: 'NET_SHADOW', score: 9580, timeCompleted: '58s' },
    { rank: 4, operatorName: 'VOID_WALKER', score: 9340, timeCompleted: '1m 12s' },
    { rank: 5, operatorName: 'DARK_CIPHER', score: 9100, timeCompleted: '1m 28s' },
    { rank: 6, operatorName: 'NEON_BLADE', score: 8890, timeCompleted: '1m 45s' },
    { rank: 7, operatorName: 'GHOST_PROTOCOL', score: 8650, timeCompleted: '2m 03s' },
    { rank: 8, operatorName: 'QUANTUM_HACK', score: 8420, timeCompleted: '2m 18s' },
    { rank: 9, operatorName: 'STATIC_VOID', score: 8150, timeCompleted: '2m 34s' },
    { rank: 10, operatorName: 'DATA_WRAITH', score: 7890, timeCompleted: '2m 51s' },
];

export const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Crown size={20} className="text-yellow-500" />;
            case 2:
                return <Trophy size={18} className="text-gray-400" />;
            case 3:
                return <Trophy size={18} className="text-amber-700" />;
            default:
                return null;
        }
    };

    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1:
                return 'text-yellow-500';
            case 2:
                return 'text-gray-400';
            case 3:
                return 'text-amber-700';
            default:
                return 'text-white/70';
        }
    };

    return (
        <div className="relative h-full w-full overflow-hidden bg-[#050508]">
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

            {/* Decorative Overlay */}
            <div className="pointer-events-none absolute inset-0 z-50 bg-[radial-gradient(circle_at_center,transparent_50%,#000000_100%)] opacity-80" />

            {/* Back Button */}
            <button
                onClick={onBack}
                style={{ position: 'fixed', left: '16px', top: '96px', zIndex: 60 }}
                className="text-white/50 hover:text-white transition-colors"
            >
                <ArrowLeft size={20} />
            </button>

            {/* Main Content */}
            <div className="relative z-10 flex h-full w-full items-center justify-center p-4 md:p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-4xl"
                >
                    {/* Header */}
                    <div className="mb-6 md:mb-8 text-center">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <Zap size={24} className="text-[#00E6FF]" />
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black italic tracking-tighter text-white" style={{ textShadow: '0 0 20px #00E6FF' }}>
                                GLOBAL LEADERBOARD
                            </h1>
                            <Zap size={24} className="text-[#00E6FF]" />
                        </div>
                        <p className="font-mono text-[10px] sm:text-xs tracking-widest text-white/50">
                            TOP_OPERATIVES // BREACH_RECORDS // GLOBAL_RANKINGS
                        </p>
                    </div>

                    {/* Leaderboard Container */}
                    <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-[0_0_50px_rgba(0,230,255,0.15)]">


                        {/* Leaderboard Entries */}
                        <div className="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
                            {MOCK_LEADERBOARD_DATA.map((entry, index) => (
                                <motion.div
                                    key={entry.rank}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={cn(
                                        "grid grid-cols-[60px_1fr_100px_100px] sm:grid-cols-[80px_1fr_120px_120px] gap-2 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4 border-b border-white/5 transition-all duration-300",
                                        entry.rank <= 3 ? "bg-white/5 hover:bg-white/10" : "hover:bg-white/5",
                                        entry.rank === 1 && "shadow-[0_0_30px_rgba(234,179,8,0.1)]"
                                    )}
                                >
                                    {/* Rank */}
                                    <div className={cn("flex items-center gap-1 sm:gap-2 font-mono text-sm sm:text-lg font-bold", getRankColor(entry.rank))}>
                                        {getRankIcon(entry.rank)}
                                        <span>#{entry.rank}</span>
                                    </div>

                                    {/* Operator Name */}
                                    <div className="flex items-center font-mono text-xs sm:text-sm font-medium text-white/90 truncate">
                                        {entry.operatorName}
                                    </div>

                                    {/* Score */}
                                    <div className="flex items-center justify-end font-mono text-xs sm:text-sm font-bold text-[#00E6FF]">
                                        {entry.score.toLocaleString()}
                                    </div>

                                    {/* Time */}
                                    <div className="flex items-center justify-end font-mono text-[10px] sm:text-xs text-white/60">
                                        {entry.timeCompleted}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Footer Note */}
                        <div className="border-t border-white/10 bg-white/5 px-3 sm:px-6 py-3 sm:py-4">
                            <p className="font-mono text-[9px] sm:text-[10px] tracking-wider text-white/40 text-center">
                                RANKINGS_UPDATE: REAL-TIME // DATABASE_SYNC: PENDING
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
                        <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl p-3 sm:p-4">
                            <div className="font-mono text-[10px] tracking-widest text-white/50 mb-1">TOTAL OPERATIVES</div>
                            <div className="text-xl sm:text-2xl font-bold text-[#00E6FF]">10</div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl p-3 sm:p-4">
                            <div className="font-mono text-[10px] tracking-widest text-white/50 mb-1">FASTEST BREACH</div>
                            <div className="text-xl sm:text-2xl font-bold text-yellow-500">45s</div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl p-3 sm:p-4">
                            <div className="font-mono text-[10px] tracking-widest text-white/50 mb-1">HIGHEST SCORE</div>
                            <div className="text-xl sm:text-2xl font-bold text-[#00E6FF]">9,850</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
