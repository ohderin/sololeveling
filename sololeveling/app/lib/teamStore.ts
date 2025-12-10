const teamMembers: number[] = [];
const listeners: (() => void)[] = [];

export const getTeamMembers = () => teamMembers.slice();

export const addTeamMember = (companionId: number) => {
  if (!teamMembers.includes(companionId) && teamMembers.length < 3) {
    teamMembers.push(companionId);
    listeners.forEach((l) => l());
  }
};

export const removeTeamMember = (companionId: number) => {
  const index = teamMembers.indexOf(companionId);
  if (index > -1) {
    teamMembers.splice(index, 1);
    listeners.forEach((l) => l());
  }
};

export const toggleTeamMember = (companionId: number) => {
  if (teamMembers.includes(companionId)) {
    removeTeamMember(companionId);
  } else {
    addTeamMember(companionId);
  }
};

export const subscribe = (fn: () => void) => {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i >= 0) listeners.splice(i, 1);
  };
};

