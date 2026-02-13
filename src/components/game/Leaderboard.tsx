import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Trophy, Zap, Crown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LeaderboardEntry {
    rank: number;
    operatorName: string;
    // Score removed
    timeCompleted: string;
}

interface LeaderboardProps {
    onBack: () => void;
}

import { API_URL } from '../../config';

// Mock data removed in favor of API fetch


export const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
    const [leaderboardData, setLeaderboardData] = React.useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const [stats, setStats] = React.useState({ totalOperatives: 0, fastestBreach: 'N/A' });

    const fetchLeaderboard = async () => {
        if (!API_URL) {
            setError('Configuration Error: API URL not set');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Fetch leaderboard and stats in parallel
            const [leaderboardRes, statsRes] = await Promise.all([
                fetch(API_URL),
                fetch(`${API_URL}/stats`)
            ]);

            if (leaderboardRes.ok && statsRes.ok) {
                const data = await leaderboardRes.json();
                const statsData = await statsRes.json();
                setLeaderboardData(data);
                setStats(statsData);
            } else {
                console.error('Failed to fetch leaderboard data');
                setError('Failed to fetch leaderboard data');
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            setError('Connection Error: Failed to reach server');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchLeaderboard();
    }, []);

    const handleRetry = () => {
        fetchLeaderboard();
    };

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


                        {/* Leaderboard Entries - Scrollable */}
                        <div className="h-[400px] overflow-y-auto custom-scrollbar">
                            {loading ? (
                                <div className="flex h-full items-center justify-center text-[#00E6FF] font-mono animate-pulse">
                                    LOADING_DATABASE...
                                </div>
                            ) : error ? (
                                <div className="flex h-full flex-col items-center justify-center text-red-500 font-mono gap-4">
                                    <div className="text-center">
                                        <p className="font-bold mb-2">CONNECTION_FAILURE</p>
                                        <p className="text-xs opacity-70">{error}</p>
                                    </div>
                                    <button
                                        onClick={handleRetry}
                                        className="px-4 py-2 bg-red-500/10 border border-red-500/50 rounded hover:bg-red-500/20 transition-colors text-xs tracking-widest"
                                    >
                                        RETRY_CONNECTION
                                    </button>
                                </div>
                            ) : (
                                leaderboardData.map((entry, index) => (
                                    <motion.div
                                        key={entry.rank}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={cn(
                                            "grid grid-cols-[60px_1fr_100px] sm:grid-cols-[80px_1fr_120px] gap-2 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4 border-b border-white/5 transition-all duration-300",
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

                                        {/* Time */}
                                        <div className="flex items-center justify-end font-mono text-xs sm:text-sm font-bold text-[#00E6FF]">
                                            {entry.timeCompleted}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer Note */}

                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
                        <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl p-3 sm:p-4">
                            <div className="font-mono text-[10px] tracking-widest text-white/50 mb-1">TOTAL OPERATIVES</div>
                            <div className="text-xl sm:text-2xl font-bold text-[#00E6FF]">{loading ? "-" : stats.totalOperatives}</div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl p-3 sm:p-4">
                            <div className="font-mono text-[10px] tracking-widest text-white/50 mb-1">FASTEST BREACH</div>
                            <div className="text-xl sm:text-2xl font-bold text-yellow-500">{loading ? "-" : stats.fastestBreach}</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

