// Note: Install @react-native-async-storage/async-storage for persistence
// For now using in-memory storage
let AsyncStorage: any = null;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  // Fallback to in-memory storage if AsyncStorage not available
  console.log('AsyncStorage not available, using in-memory storage');
}

const BGM_VOLUME_KEY = '@sound_settings_bgm_volume';
const SFX_VOLUME_KEY = '@sound_settings_sfx_volume';

let bgmVolume = 0.1; // Default BGM volume
let sfxVolume = 1.0; // Default SFX volume
const listeners: (() => void)[] = [];

// Load settings from storage
export const loadSoundSettings = async () => {
  if (!AsyncStorage) return;
  
  try {
    const savedBgm = await AsyncStorage.getItem(BGM_VOLUME_KEY);
    const savedSfx = await AsyncStorage.getItem(SFX_VOLUME_KEY);
    
    if (savedBgm !== null) {
      bgmVolume = parseFloat(savedBgm);
    }
    if (savedSfx !== null) {
      sfxVolume = parseFloat(savedSfx);
    }
    
    listeners.forEach((l) => l());
  } catch (error) {
    console.error('Error loading sound settings:', error);
  }
};

// Initialize on import
loadSoundSettings();

export const getBGMVolume = () => bgmVolume;
export const getSFXVolume = () => sfxVolume;

export const setBGMVolume = async (volume: number) => {
  bgmVolume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
  if (AsyncStorage) {
    try {
      await AsyncStorage.setItem(BGM_VOLUME_KEY, bgmVolume.toString());
    } catch (error) {
      console.error('Error saving BGM volume:', error);
    }
  }
  listeners.forEach((l) => l());
};

export const setSFXVolume = async (volume: number) => {
  sfxVolume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
  if (AsyncStorage) {
    try {
      await AsyncStorage.setItem(SFX_VOLUME_KEY, sfxVolume.toString());
    } catch (error) {
      console.error('Error saving SFX volume:', error);
    }
  }
  listeners.forEach((l) => l());
};

export const subscribe = (fn: () => void) => {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i >= 0) listeners.splice(i, 1);
  };
};

