import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import musicFile from '../../assets/minimal-tech-background-music.mp3';

export const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio(musicFile);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5; // Start at 50% volume

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Audio playback failed:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <button
      onClick={togglePlay}
      className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-black/40 text-[#00E6FF] hover:bg-[#00E6FF]/10 hover:border-[#00E6FF]/50 transition-all duration-300 group"
      aria-label={isPlaying ? "Mute Music" : "Play Music"}
    >
      {isPlaying ? (
        <Volume2 size={18} className="drop-shadow-[0_0_5px_rgba(0,230,255,0.5)]" />
      ) : (
        <VolumeX size={18} className="opacity-70 group-hover:opacity-100" />
      )}
    </button>
  );
};
