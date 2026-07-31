export const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  student: [
    'read:courses',
    'enroll:courses',
    'read:jobs',
    'apply:jobs',
    'read:mentors',
    'book:mentor_sessions',
    'use:ai_features',
    'read:forum',
    'write:forum',
    'manage:own_profile',
    'download:certificates',
    'build:resume',
    'take:quizzes',
    'attend:live_classes',
    'submit:code',
    'view:submissions',
  ],
  admin: [
    'manage:users',
    'approve:courses',
    'manage:payments',
    'manage:certificates',
    'read:analytics',
    'manage:notifications',
    'manage:cms',
    'manage:support_tickets',
    'read:ai_usage',
    'manage:problems',
    'view:all_submissions',
    'manage:settings',
    '*', // Full access
  ],
};
