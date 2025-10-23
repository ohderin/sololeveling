export type Task = { id: string; name: string; desc?: string; createdAt: string };

const tasks: Task[] = [];
const listeners: (() => void)[] = [];

export const getTasks = () => tasks.slice();
export const addTask = (task: Task) => {
  tasks.unshift(task);
  listeners.forEach((l) => l());
};
export const subscribe = (fn: () => void) => {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i >= 0) listeners.splice(i, 1);
  };
};