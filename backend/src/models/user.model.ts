/**
 * User Domain Models
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'student' | 'admin';

export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  isVerified?: boolean;
}

export interface UserProfile extends User {
  studentProfile?: StudentProfile;
}

export interface StudentProfile {
  id: string;
  userId: string;
  totalXP: number;
  streak: number;
  lastActivityDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
