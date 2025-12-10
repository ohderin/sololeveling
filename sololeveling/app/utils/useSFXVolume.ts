import { useEffect } from "react";
import { getSFXVolume, subscribe } from "../lib/soundSettingsStore";

export const useSFXVolume = (audioPlayer: ReturnType<typeof import("expo-audio").useAudioPlayer> | null) => {
  useEffect(() => {
    if (!audioPlayer) return;
    
    const updateVolume = () => {
      if (audioPlayer) {
        audioPlayer.volume = getSFXVolume();
      }
    };
    
    // Set initial volume
    updateVolume();
    
    // Subscribe to volume changes
    const unsubscribe = subscribe(() => {
      updateVolume();
    });
    
    return unsubscribe;
  }, [audioPlayer]);
};

