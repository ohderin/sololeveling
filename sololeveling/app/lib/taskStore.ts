export type Task = { 
  id: string; 
  name: string; 
  desc?: string; 
  createdAt: string;
  duration?: "daily" | "weekly";
  priority?: "low" | "medium" | "high";
  completed?: boolean;
  deadline?: string;
};

const tasks: Task[] = [];
const listeners: (() => void)[] = [];

export const getTasks = () => tasks.slice();
export const addTask = (task: Task) => {
  tasks.unshift(task);
  listeners.forEach((l) => l());
};
export const toggleTask = (id: string) => {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    if (task.completed) actionPoints += AP_PER_TASK;
    else actionPoints = Math.max(0, actionPoints - AP_PER_TASK);
    listeners.forEach((l) => l());
  }
};
export const subscribe = (fn: () => void) => { // listener for shared component changes *Do not break*
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i >= 0) listeners.splice(i, 1);
  };
};

let equippedCompanionId: number | null = 1; // default to first companion

export const getEquippedCompanionId = () => equippedCompanionId;
export const setEquippedCompanionId = (id: number) => {
  equippedCompanionId = id;
  listeners.forEach((l) => l());
};

// action points 
const AP_PER_TASK = 1;
let actionPoints = 0;

export const getActionPoints = () => actionPoints;
export const addActionPoints = (amount: number) => {
  actionPoints = Math.max(0, actionPoints + amount);
  listeners.forEach((l) => l());
};
export const spendActionPoints = (amount: number) => {
  if (actionPoints < amount) return false;
  actionPoints -= amount;
  listeners.forEach((l) => l());
  return true;
};