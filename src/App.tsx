import React, { useState, useCallback } from 'react';
import { CyberpunkLayout } from './components/game/CyberpunkLayout';
import { Header } from './components/game/Header';
import { Intro } from './components/game/Intro';
import { GlitchTransition } from './components/game/GlitchTransition';
import { HexPuzzle } from './components/game/HexPuzzle';
import { NetworkHub, NodeType } from './components/game/NetworkHub';
import { FileViewer } from './components/game/FileViewer';
import { FrequencyTuner } from './components/game/FrequencyTuner';
import { MemoryPuzzle } from './components/game/MemoryPuzzle';
import { CodeBreaker } from './components/game/CodeBreaker';
import { PersonalityAnalysis } from './components/game/PersonalityAnalysis';
import { ReflexPuzzle } from './components/game/ReflexPuzzle';
import { LogicPuzzle } from './components/game/LogicPuzzle';
import { SystemOverlay } from './components/game/SystemOverlay';
import { TutorialCard } from './components/game/TutorialCard';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useClickSound } from './hooks/useClickSound';

import { NameEntry } from './components/game/NameEntry';
import { PasswordEntry } from './components/game/PasswordEntry';
import { Leaderboard } from './components/game/Leaderboard';

type GameState = 'INTRO' | 'NAME_INPUT' | 'PASSWORD_INPUT' | 'HUB' | 'PUZZLE' | 'VIEWER' | 'LEADERBOARD';

// Puzzle Metadata for Tutorials
const PUZZLE_INFO: Record<NodeType, { title: string; description: string; difficulty: 'EASY' | 'MEDIUM' | 'HARD' }> = {
  TEAM: {
    title: "DATA ROUTING",
    description: "Rotate the hexagonal nodes to create a complete path from start to finish. All connections must align.",
    difficulty: 'EASY'
  },
  PROJECTS: {
    title: "SIGNAL TUNING",
    description: "Adjust the frequency slider to match the target waveform. Wait for the signal to lock in.",
    difficulty: 'EASY'
  },
  SOCIALS: {
    title: "CODE BREAKER",
    description: "Analyze the corrupted data log. Look for numeric patterns or bracketed numbers to find the 4-digit PIN.",
    difficulty: 'MEDIUM'
  },
  VISION: {
    title: "MEMORY PATTERN",
    description: "Memorize the sequence of flashing nodes and repeat it back exactly. The sequence gets longer each round.",
    difficulty: 'MEDIUM'
  },
  SECURITY: {
    title: "PACKET INTERCEPTOR",
    description: "Click the lanes to catch incoming DATA packets. Avoid the RED virus packets. Don't let your integrity reach zero.",
    difficulty: 'HARD'
  },
  POWER: {
    title: "CIRCUIT LOGIC",
    description: "Toggle the switches to route power through the logic gates (AND, OR, XOR) until the final output is active. Then press TEST CIRCUIT.",
    difficulty: 'HARD'
  },
  // Non-puzzle nodes
  DATABASE: { title: "", description: "", difficulty: 'EASY' },
  IDENTITY: { title: "", description: "", difficulty: 'EASY' }
};

export default function App() {
  useClickSound();
  const [gameState, setGameState] = useState<GameState>('INTRO');
  const [showTransition, setShowTransition] = useState(false);
  const [transitionType, setTransitionType] = useState<NodeType | 'DEFAULT' | 'HUB'>('DEFAULT');
  const [completedNodes, setCompletedNodes] = useState<NodeType[]>([]);
  const [activeNode, setActiveNode] = useState<NodeType | null>(null);

  // Tutorial State
  const [showTutorial, setShowTutorial] = useState(false);

  // Time Tracking for Personality Analysis
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const [userName, setUserName] = useState('');

  const triggerTransition = useCallback((nextState: GameState, type: NodeType | 'DEFAULT' | 'HUB' = 'DEFAULT') => {
    setTransitionType(type);
    setShowTransition(true);
    setTimeout(() => {
      setGameState(nextState);
      setShowTransition(false);
    }, 600); // Wait for transition animation
  }, []);

  const handleIntroComplete = useCallback(() => {
    triggerTransition('NAME_INPUT');
  }, [triggerTransition]);

  const handleNameSubmit = useCallback((name: string) => {
    setUserName(name);
    setStartTime(Date.now()); // Start timer here
    triggerTransition('PASSWORD_INPUT');
  }, [triggerTransition]);

  const handlePasswordSuccess = useCallback(() => {
    // Timer already started at name submit
    triggerTransition('HUB', 'HUB');
  }, [triggerTransition]);

  const handleNodeClick = (nodeId: NodeType) => {
    if (nodeId === 'IDENTITY') {
      setShowAnalysis(true);
    } else {
      setActiveNode(nodeId);
      // Show tutorial first
      setShowTutorial(true);
      triggerTransition('PUZZLE', nodeId);
    }
  };

  const handleTutorialStart = () => {
    setShowTutorial(false);
  };

  const handleDatabaseClick = () => {
    // If first time entering, set end time and show analysis
    if (endTime === 0) {
      // Logic moved to handlePuzzleComplete
      setShowAnalysis(true);
    } else {
      // If re-entering, just show viewer (analysis can be accessed via hub node)
      setActiveNode('DATABASE');
      triggerTransition('VIEWER', 'DATABASE');
    }
  };

  const handleShowAnalysis = () => {
    setShowAnalysis(true);
  };

  const handleAnalysisContinue = () => {
    setShowAnalysis(false);
    setActiveNode('DATABASE');
    triggerTransition('VIEWER', 'DATABASE');
  };

  const handleLeaderboardClick = () => {
    triggerTransition('LEADERBOARD', 'DEFAULT');
  };

  const handleLeaderboardBack = () => {
    triggerTransition('HUB', 'HUB');
  };

  const handlePuzzleComplete = () => {
    if (activeNode) {
      let newCompletedNodes = completedNodes;
      if (!completedNodes.includes(activeNode)) {
        newCompletedNodes = [...completedNodes, activeNode];
        setCompletedNodes(newCompletedNodes);
        // Taunt success
        if ((window as any).triggerSystemTaunt) (window as any).triggerSystemTaunt('success');
      }

      // Check if all puzzles are complete (excluding non-puzzle nodes if any, but currently all 6 are puzzles)
      // The initialNodes in NetworkHub are: TEAM, PROJECTS, SOCIALS, VISION, SECURITY, POWER
      const allPuzzles = ['TEAM', 'PROJECTS', 'SOCIALS', 'VISION', 'SECURITY', 'POWER'];
      const allComplete = allPuzzles.every(node => newCompletedNodes.includes(node as NodeType));

      if (allComplete && endTime === 0) {
        const now = Date.now();
        setEndTime(now);

        // Calculate score and submit to leaderboard
        const durationMs = now - startTime;
        const durationSeconds = Math.floor(durationMs / 1000);
        // Score logic removed, sending 0 as default

        const minutes = Math.floor(durationSeconds / 60);
        const seconds = durationSeconds % 60;
        const timeString = `${minutes}m ${seconds}s`;

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/leaderboard';

        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            operatorName: userName,
            score: 0, // Default value as score is removed from logic
            timeCompleted: timeString,
            durationSeconds: durationSeconds,
          }),
        }).catch(err => console.error('Failed to submit score:', err));
      }

      // Return to HUB immediately instead of showing viewer
      triggerTransition('HUB', 'HUB');
    }
  };

  const handleViewerClose = () => {
    setActiveNode(null);
    triggerTransition('HUB', 'HUB');
  };

  // Render the appropriate puzzle based on active node
  const renderPuzzle = () => {
    if (showTutorial && activeNode) {
      const info = PUZZLE_INFO[activeNode];
      return (
        <div className="flex h-full w-full items-center justify-center p-4">
          <TutorialCard
            title={info.title}
            description={info.description}
            difficulty={info.difficulty}
            onStart={handleTutorialStart}
          />
        </div>
      );
    }

    switch (activeNode) {
      case 'TEAM':
        return <HexPuzzle onComplete={handlePuzzleComplete} />;
      case 'PROJECTS':
        return (
          <div className="relative h-full w-full flex items-center justify-center">
            <FrequencyTuner
              targetFreq={Math.random() * 60 + 20}
              onSuccess={handlePuzzleComplete}
              onCancel={() => triggerTransition('HUB', 'HUB')}
            />
          </div>
        );
      case 'SOCIALS':
        return <CodeBreaker onComplete={handlePuzzleComplete} />;
      case 'VISION':
        return <MemoryPuzzle onComplete={handlePuzzleComplete} />;
      case 'SECURITY':
        return <ReflexPuzzle onComplete={handlePuzzleComplete} />;
      case 'POWER':
        return <LogicPuzzle onComplete={handlePuzzleComplete} />;
      default:
        return null;
    }
  };

  return (
    <CyberpunkLayout>
      <SystemOverlay gameState={gameState} />

      <AnimatePresence>
        {gameState === 'INTRO' && <Intro onComplete={handleIntroComplete} />}
        {gameState === 'NAME_INPUT' && <NameEntry onComplete={handleNameSubmit} />}
        {gameState === 'PASSWORD_INPUT' && <PasswordEntry onComplete={handlePasswordSuccess} userName={userName} />}
      </AnimatePresence>

      <AnimatePresence>
        {showTransition && (
          <motion.div className="fixed inset-0 z-[100]">
            <GlitchTransition type={transitionType} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Personality Analysis Modal */}
      <AnimatePresence>
        {showAnalysis && (
          <PersonalityAnalysis
            startTime={startTime}
            endTime={endTime}
            onContinue={handleAnalysisContinue}
            onClose={() => setShowAnalysis(false)}
            isReplay={gameState !== 'HUB'} // Only show "Continue" if it's the first run flow
          />
        )}
      </AnimatePresence>

      <Header userName={userName} />

      <main className="flex h-screen w-full flex-col pt-20">
        <AnimatePresence mode="wait">

          {/* STATE: NETWORK HUB */}
          {gameState === 'HUB' && (
            <motion.div
              key="hub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              <NetworkHub
                completedNodes={completedNodes}
                onNodeClick={handleNodeClick}
                onDatabaseClick={handleDatabaseClick}
                onShowAnalysis={endTime > 0 ? handleShowAnalysis : undefined}
                onLeaderboardClick={handleLeaderboardClick}
              />
            </motion.div>
          )}

          {/* STATE: PUZZLE */}
          {gameState === 'PUZZLE' && activeNode && (
            <motion.div
              key="puzzle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative flex h-full w-full flex-col items-center justify-center p-4 md:p-8 overflow-hidden"
            >
              {/* Back Button */}
              <button
                onClick={() => triggerTransition('HUB', 'HUB')}
                style={{ position: 'fixed', left: '16px', top: '96px', zIndex: 50 }}
                className="text-white/50 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
              </button>

              {!showTutorial && (
                <div className="mb-4 text-center">
                  <h2 className="text-xl font-bold tracking-[0.2em] text-[#00E6FF]">
                    BREACHING FIREWALL: {activeNode}
                  </h2>
                  <p className="text-xs text-white/50">BYPASS SECURITY PROTOCOL TO UNLOCK NODE</p>
                </div>
              )}

              <div className="relative flex-1 w-full flex items-center justify-center rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl overflow-hidden">
                {renderPuzzle()}
              </div>
            </motion.div>
          )}

          {/* STATE: VIEWER (Result) */}
          {gameState === 'VIEWER' && activeNode && (
            <FileViewer type={activeNode} onClose={handleViewerClose} />
          )}

          {/* STATE: LEADERBOARD */}
          {gameState === 'LEADERBOARD' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              <Leaderboard onBack={handleLeaderboardBack} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </CyberpunkLayout>
  );
}
