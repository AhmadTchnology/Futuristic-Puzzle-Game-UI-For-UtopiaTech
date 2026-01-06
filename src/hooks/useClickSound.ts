import { useEffect, useRef } from 'react';
import clickSoundFile from '../assets/mouse-click-cut.mp3';

export const useClickSound = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize audio
        audioRef.current = new Audio(clickSoundFile);
        audioRef.current.volume = 0.5; // Adjust volume as needed

        const handleClick = () => {
            if (audioRef.current) {
                // Reset time to 0 to allow rapid clicking
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(error => {
                    // Ignore autoplay errors (usually happens if user hasn't interacted with page yet, 
                    // but this is a click handler so it should be fine)
                    console.error("Click sound playback failed:", error);
                });
            }
        };

        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, []);
};
