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