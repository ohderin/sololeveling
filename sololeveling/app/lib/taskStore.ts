import { addActionPoints as addAP, getActionPoints as getAP, spendActionPoints as spendAP } from "./apStore";

export type Task = { 
  id: string; 
  name: string; 
  desc?: string; 
  createdAt: string;
  duration?: "daily" | "weekly";
  priority?: "low" | "medium" | "high";
  completed?: boolean;
  completedAt?: string;
  deadline?: string;
};

const AP_PER_TASK = 1;
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
    if (task.completed) {
      task.completedAt = new Date().toISOString();
      addAP(AP_PER_TASK);
    } else {
      task.completedAt = undefined;
      spendAP(AP_PER_TASK);
    }
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

// re-export AP functions
export const getActionPoints = getAP;
export const addActionPoints = addAP;
export const spendActionPoints = spendAP;

// daily tracking (resets at 5 AM local time)
const getTodayStart = (): Date => {
  const now = new Date();
  const today5am = new Date(now);
  today5am.setHours(5, 0, 0, 0);
  
  if (now.getHours() < 5) {
    today5am.setDate(today5am.getDate() - 1);
  }
  
  return today5am;
};

let dailyBonus = 0;
export const getDailyCompletions = (): number => {
  const todayStart = getTodayStart();
  const actual = tasks.filter(task => {
    if (!task.completed || !task.completedAt) return false;
    const completedDate = new Date(task.completedAt);
    return completedDate >= todayStart;
  }).length;
  return actual + dailyBonus;
};
export const hax = () => {
  dailyBonus = 10;
  addAP(10);
  listeners.forEach((l) => l());
};