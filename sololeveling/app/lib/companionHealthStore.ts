// Shared store for companion health across the app
type CompanionHealth = {
  [companionId: number]: number;
};

let companionHealth: CompanionHealth = {};
const listeners: Array<() => void> = [];

// Initialize health from companion base stats if not set
export const initializeHealth = (companionId: number, maxHealth: number) => {
  if (companionHealth[companionId] === undefined) {
    companionHealth[companionId] = maxHealth;
    notifyListeners();
  }
};

export const getCompanionHealth = (companionId: number): number => {
  return companionHealth[companionId] ?? 100; // Default to 100 if not set
};

export const setCompanionHealth = (companionId: number, health: number) => {
  companionHealth[companionId] = Math.max(0, Math.min(health, 1000)); // Clamp between 0 and 1000
  notifyListeners();
};

export const takeCompanionDamage = (companionId: number, damage: number) => {
  const currentHealth = getCompanionHealth(companionId);
  setCompanionHealth(companionId, currentHealth - damage);
};

export const healCompanion = (companionId: number, amount: number) => {
  const currentHealth = getCompanionHealth(companionId);
  setCompanionHealth(companionId, currentHealth + amount);
};

export const resetCompanionHealth = (companionId: number, maxHealth: number) => {
  setCompanionHealth(companionId, maxHealth);
};

export const subscribe = (callback: () => void) => {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

const notifyListeners = () => {
  listeners.forEach(callback => callback());
};

