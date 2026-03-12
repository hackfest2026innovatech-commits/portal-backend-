export const ROLES = {
  SUPERADMIN: 'superadmin',
  STUDENT: 'student',
  JUDGE: 'judge',
};

export const ROLE_LABELS = {
  [ROLES.SUPERADMIN]: 'Super Admin',
  [ROLES.STUDENT]: 'Student',
  [ROLES.JUDGE]: 'Judge',
};

export const ROLE_COLORS = {
  [ROLES.SUPERADMIN]: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
  [ROLES.STUDENT]: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
  [ROLES.JUDGE]: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30',
};

export const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '';

export const EVALUATION_CRITERIA = [
  {
    id: 'innovation',
    label: 'Innovation & Creativity',
    description: 'Originality of the idea and creative problem-solving approach',
    maxScore: 10,
  },
  {
    id: 'technical',
    label: 'Technical Complexity',
    description: 'Depth of technical implementation and architecture quality',
    maxScore: 10,
  },
  {
    id: 'design',
    label: 'Design & User Experience',
    description: 'Visual design, usability, and overall user experience',
    maxScore: 10,
  },
  {
    id: 'presentation',
    label: 'Presentation & Demo',
    description: 'Clarity of presentation and effectiveness of the demo',
    maxScore: 10,
  },
  {
    id: 'impact',
    label: 'Impact & Practicality',
    description: 'Potential real-world impact and feasibility of the solution',
    maxScore: 10,
  },
];

export const MAX_TEAM_SIZE = 5;

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  SUCCESS: 'success',
  ERROR: 'error',
  ANNOUNCEMENT: 'announcement',
};

export const TIMER_STATES = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  FINISHED: 'finished',
};

export const FORM_FIELD_TYPES = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  NUMBER: 'number',
  SELECT: 'select',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  URL: 'url',
  EMAIL: 'email',
};
