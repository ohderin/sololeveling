const AP_COST_UPGRADE = 1;
const AP_COST_ATTACK = 1;

let actionPoints = 0;
const listeners: (() => void)[] = [];

// notify listeners
const notifyListeners = () => {
  listeners.forEach((l) => l());
};

export const getActionPoints = (): number => actionPoints;

export const addActionPoints = (amount: number): void => {
  actionPoints = Math.max(0, actionPoints + amount);
  notifyListeners();
};

export const spendActionPoints = (amount: number): boolean => {
  if (actionPoints < amount) return false;
  actionPoints -= amount;
  notifyListeners();
  return true;
};

export const spendAPForUpgrade = (): boolean => {
  return spendActionPoints(AP_COST_UPGRADE);
};

export const spendAPForAttack = (): boolean => {
  return spendActionPoints(AP_COST_ATTACK);
};

export const canAffordUpgrade = (): boolean => {
  return actionPoints >= AP_COST_UPGRADE;
};

export const canAffordAttack = (): boolean => {
  return actionPoints >= AP_COST_ATTACK;
};

// ap listener
export const subscribeToAP = (fn: () => void): (() => void) => {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i >= 0) listeners.splice(i, 1);
  };
};

export const getUpgradeCost = (): number => AP_COST_UPGRADE;
export const getAttackCost = (): number => AP_COST_ATTACK;
