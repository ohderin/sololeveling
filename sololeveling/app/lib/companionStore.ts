// Store for managing user's owned companions
let AsyncStorage: any = null;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  console.log('AsyncStorage not available for companion store');
}

const OWNED_COMPANIONS_KEY = '@owned_companions';

// Default companions the user starts with
const DEFAULT_COMPANIONS = ['Tickhare', 'Slumberpaw', 'Flitterfinch'];

let ownedCompanionNames: string[] = [...DEFAULT_COMPANIONS];
const listeners: (() => void)[] = [];

// Load owned companions from storage
export const loadOwnedCompanions = async () => {
  if (!AsyncStorage) {
    ownedCompanionNames = [...DEFAULT_COMPANIONS];
    return;
  }
  
  try {
    const saved = await AsyncStorage.getItem(OWNED_COMPANIONS_KEY);
    if (saved !== null) {
      ownedCompanionNames = JSON.parse(saved);
    } else {
      ownedCompanionNames = [...DEFAULT_COMPANIONS];
    }
    // Defer listener notifications to avoid setState during render
    setTimeout(() => {
      listeners.forEach((l) => l());
    }, 0);
  } catch (error) {
    console.error('Error loading owned companions:', error);
    ownedCompanionNames = [...DEFAULT_COMPANIONS];
  }
};

// Initialize on import
loadOwnedCompanions();

export const getOwnedCompanionNames = (): string[] => {
  return [...ownedCompanionNames];
};

export const addOwnedCompanion = async (companionName: string) => {
  if (!ownedCompanionNames.includes(companionName)) {
    ownedCompanionNames.push(companionName);
    if (AsyncStorage) {
      try {
        await AsyncStorage.setItem(OWNED_COMPANIONS_KEY, JSON.stringify(ownedCompanionNames));
      } catch (error) {
        console.error('Error saving owned companions:', error);
      }
    }
    // Defer listener notifications to avoid setState during render
    setTimeout(() => {
      listeners.forEach((l) => l());
    }, 0);
  }
};

export const hasCompanion = (companionName: string): boolean => {
  return ownedCompanionNames.includes(companionName);
};

export const subscribe = (fn: () => void) => {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i >= 0) listeners.splice(i, 1);
  };
};

