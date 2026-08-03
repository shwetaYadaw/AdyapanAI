/**
 * Application Constants
 */

export const PROGRAMMING_LANGUAGES = [
  { value: 'cpp', label: 'C++', id: 54 },
  { value: 'java', label: 'Java', id: 62 },
  { value: 'python', label: 'Python', id: 71 },
  { value: 'javascript', label: 'JavaScript', id: 63 },
] as const;

export const DIFFICULTY_COLORS = {
  easy: 'text-green-600',
  medium: 'text-yellow-600',
  hard: 'text-red-600',
} as const;

export const DIFFICULTY_BG_COLORS = {
  easy: 'bg-green-100',
  medium: 'bg-yellow-100',
  hard: 'bg-red-100',
} as const;

export const SUBMISSION_STATUS_COLORS = {
  pending: 'text-gray-600',
  accepted: 'text-green-600',
  wrong_answer: 'text-red-600',
  compile_error: 'text-orange-600',
  runtime_error: 'text-red-600',
  time_limit_exceeded: 'text-yellow-600',
  memory_limit_exceeded: 'text-yellow-600',
} as const;

export const XP_PER_DIFFICULTY = {
  easy: 10,
  medium: 20,
  hard: 30,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    VERIFY: '/auth/verify',
  },
  PROBLEMS: {
    LIST: '/problems',
    GET: (id: string) => `/problems/${id}`,
    SUBMIT: (id: string) => `/problem-submissions/${id}/submit`,
    RUN: (id: string) => `/problem-submissions/${id}/run`,
  },
  SUBMISSIONS: {
    GET: (id: string) => `/problem-submissions/submissions/${id}`,
    HISTORY: '/problem-submissions/submissions/history',
    MY_SUBMISSIONS: (problemId: string) => `/problem-submissions/${problemId}/my-submissions`,
  },
  STUDENT: {
    PROFILE: '/students/profile',
    STATS: '/students/stats',
    BADGES: '/students/badges',
    LEADERBOARD: '/students/leaderboard',
  },
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CODING_ARENA: '/coding-arena',
  PROBLEM: (slug: string) => `/coding-arena/${slug}`,
  TCS_NQT: '/tcs-nqt',
  APTITUDE: '/aptitude',
  BADGES: '/badges',
  PROFILE: '/profile',
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    PROBLEMS: '/admin/problems',
    USERS: '/admin/users',
    SETTINGS: '/admin/settings',
  },
} as const;
