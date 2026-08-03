/**
 * User Type Definitions
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  totalXP: number;
  streak: number;
  lastActivityDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithProfile extends User {
  studentProfile?: StudentProfile;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}
