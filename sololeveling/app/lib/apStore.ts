// Action Points Store
// Manages AP for upgrading companion stats and performing battle attacks

const AP_COST_UPGRADE = 1; // Cost to upgrade a stat by 1 point
const AP_COST_ATTACK = 1;  // Cost per attack in battle

let actionPoints = 0;
const listeners: (() => void)[] = [];

// Notify all subscribers of state changes
const notifyListeners = () => {
  listeners.forEach((l) => l());
};

// Get current AP balance
export const getActionPoints = (): number => actionPoints;

// Add AP (e.g., from completing tasks)
export const addActionPoints = (amount: number): void => {
  actionPoints = Math.max(0, actionPoints + amount);
  notifyListeners();
};

// Spend AP - returns true if successful, false if insufficient AP
export const spendActionPoints = (amount: number): boolean => {
  if (actionPoints < amount) return false;
  actionPoints -= amount;
  notifyListeners();
  return true;
};

// Attempt to spend AP for a stat upgrade (1 AP per upgrade point)
export const spendAPForUpgrade = (): boolean => {
  return spendActionPoints(AP_COST_UPGRADE);
};

// Attempt to spend AP for an attack (1 AP per attack)
export const spendAPForAttack = (): boolean => {
  return spendActionPoints(AP_COST_ATTACK);
};

// Check if player can afford an upgrade
export const canAffordUpgrade = (): boolean => {
  return actionPoints >= AP_COST_UPGRADE;
};

// Check if player can afford an attack
export const canAffordAttack = (): boolean => {
  return actionPoints >= AP_COST_ATTACK;
};

// Subscribe to AP changes
export const subscribeToAP = (fn: () => void): (() => void) => {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i >= 0) listeners.splice(i, 1);
  };
};

// Get cost constants (for UI display)
export const getUpgradeCost = (): number => AP_COST_UPGRADE;
export const getAttackCost = (): number => AP_COST_ATTACK;
