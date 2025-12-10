import { useEffect } from "react";
import { useAudioPlayer } from "expo-audio";
import { getBGMVolume, subscribe } from "../lib/soundSettingsStore";

// Global state to track if battle music is playing
let battleMusicPlaying = false;
let backgroundMusicInstance: ReturnType<typeof useAudioPlayer> | null = null;
let listeners: Set<() => void> = new Set();

const updateBGMVolume = () => {
  if (backgroundMusicInstance) {
    const newVolume = getBGMVolume();
    // If battle music is playing, keep BGM muted
    // Otherwise, apply the user's volume setting (including 0)
    if (battleMusicPlaying) {
      backgroundMusicInstance.volume = 0;
    } else {
      // Force volume update by setting it directly
      backgroundMusicInstance.volume = newVolume;
      // If volume is 0, pause the music to ensure it stops
      if (newVolume === 0) {
        backgroundMusicInstance.pause();
      } else if (!backgroundMusicInstance.playing) {
        backgroundMusicInstance.play();
      }
    }
  }
};

export const setBattleMusicPlaying = (playing: boolean) => {
  battleMusicPlaying = playing;
  if (backgroundMusicInstance) {
    if (playing) {
      // Mute and pause background music when battle music starts (same as slider at 0)
      backgroundMusicInstance.volume = 0;
      backgroundMusicInstance.pause();
    } else {
      // Unmute background music when battle music stops
      updateBGMVolume();
    }
  }
  listeners.forEach(listener => listener());
};

export const getBattleMusicState = () => battleMusicPlaying;

export const subscribeToBattleMusic = (callback: () => void) => {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
};

export default function BackgroundMusic() {
  const backgroundMusic = useAudioPlayer(require('../barena_assets/bgmusic.mp3'));
  
  useEffect(() => {
    // Store the instance globally
    backgroundMusicInstance = backgroundMusic;
    
    // Set up background music
    backgroundMusic.loop = true;
    const initialVolume = getBGMVolume();
    backgroundMusic.volume = initialVolume;
    backgroundMusic.play();
    
    // Subscribe to volume changes
    const unsubscribe = subscribe(() => {
      updateBGMVolume();
    });
    
    return () => {
      unsubscribe();
      backgroundMusic.pause();
      backgroundMusicInstance = null;
    };
  }, []);

  return null; // This component doesn't render anything
}

