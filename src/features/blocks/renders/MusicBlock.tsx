"use client";

import { useState, useRef, useEffect } from "react";
import { audioEngine } from "@/motion/audio/AudioEngine";

interface MusicBlockProps {
  trackId: string;
  loop: boolean;
  volume: number;
  style: {
    showControls: boolean;
    autoPlay: boolean;
  };
}

export function MusicBlock({ trackId, loop, volume, style }: MusicBlockProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(volume);

  useEffect(() => {
    if (style.autoPlay) {
      // Simuler l'URL pour la démo
      audioEngine.play("/music/" + trackId).catch(console.error);
      setIsPlaying(true);
    }
  }, [style.autoPlay, trackId]);

  const togglePlay = async () => {
    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      // Simuler l'URL pour la démo
      await audioEngine.play("/music/" + trackId);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setCurrentVolume(newVolume);
    audioEngine.setVolume(newVolume);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="w-12 h-12 flex items-center justify-center bg-purple-600 text-white rounded-full"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Piste : {trackId}</p>
          {style.showControls && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">Volume</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={currentVolume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">{Math.round(currentVolume * 100)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
