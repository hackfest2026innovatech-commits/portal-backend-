const ROLES = Object.freeze({
  SUPERADMIN: 'superadmin',
  STUDENT: 'student',
  JUDGE: 'judge',
});

const ROLES_ARRAY = Object.values(ROLES);

const HACKATHON_STATUSES = Object.freeze({
  DRAFT: 'draft',
  REGISTRATION: 'registration',
  ACTIVE: 'active',
  JUDGING: 'judging',
  COMPLETED: 'completed',
});

const HACKATHON_STATUSES_ARRAY = Object.values(HACKATHON_STATUSES);

const NOTIFICATION_TYPES = Object.freeze({
  ANNOUNCEMENT: 'announcement',
  REMINDER: 'reminder',
  ALERT: 'alert',
  RESULT: 'result',
});

const NOTIFICATION_TYPES_ARRAY = Object.values(NOTIFICATION_TYPES);

const FORM_FIELD_TYPES = Object.freeze({
  TEXT: 'text',
  TEXTAREA: 'textarea',
  FILE: 'file',
  LINK: 'link',
});

const FORM_FIELD_TYPES_ARRAY = Object.values(FORM_FIELD_TYPES);

const FORM_TYPES = Object.freeze({
  SUBMISSION: 'submission',
  FEEDBACK: 'feedback',
  CHECKPOINT: 'checkpoint',
});

const FORM_TYPES_ARRAY = Object.values(FORM_TYPES);

const TEAM_MEMBER_ROLES = Object.freeze({
  LEADER: 'leader',
  MEMBER: 'member',
});

const TARGET_ROLES = Object.freeze({
  ALL: 'all',
  STUDENT: 'student',
  JUDGE: 'judge',
});

const TARGET_ROLES_ARRAY = ['all', 'student', 'judge'];

module.exports = {
  ROLES,
  ROLES_ARRAY,
  HACKATHON_STATUSES,
  HACKATHON_STATUSES_ARRAY,
  NOTIFICATION_TYPES,
  NOTIFICATION_TYPES_ARRAY,
  FORM_FIELD_TYPES,
  FORM_FIELD_TYPES_ARRAY,
  FORM_TYPES,
  FORM_TYPES_ARRAY,
  TEAM_MEMBER_ROLES,
  TARGET_ROLES,
  TARGET_ROLES_ARRAY,
};
