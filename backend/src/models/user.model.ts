/**
 * User Domain Models — aligned with Prisma schema
 */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isVerified: boolean;
  isEmailVerified: boolean;
  isActive: boolean;
  avatar?: string | null;
  googleId?: string | null;
  phone?: string | null;
  phoneVerified: boolean;
  lastLogin?: Date | null;
  loginCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'student' | 'admin';

export interface CreateUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  isVerified?: boolean;
  isEmailVerified?: boolean;
}

export interface UserProfile extends User {
  studentProfile?: StudentProfile;
}

export interface StudentProfile {
  id: string;
  userId: string;
  xp: number;
  totalXP: number;
  level: number;
  streak: number;
  lastActiveDate: Date | null;
  skills?: any;
  resumeUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
