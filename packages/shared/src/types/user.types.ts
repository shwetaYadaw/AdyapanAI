export type UserRole =
  | 'student'
  | 'teacher'
  | 'mentor'
  | 'recruiter'
  | 'admin'
  | 'superadmin';

export interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  googleId?: string;
  phone?: string;
  phoneVerified?: boolean;
  lastLogin?: string;
  preferences?: {
    language: string;
    darkMode: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IStudentProfile {
  _id: string;
  userId: string;
  headline?: string;
  bio?: string;
  education: IEducation[];
  skills: ISkill[];
  experience: IExperience[];
  projects: IProject[];
  socialLinks: ISocialLinks;
  placementStatus: PlacementStatus;
  placedAt?: string;
  placedPackage?: number;
  totalXP: number;
  level: number;
  streak: number;
  resumeUrl?: string;
  atsScore?: number;
  careerTrack: string[];
  targetCompanies: string[];
  location?: ILocation;
  availability: AvailabilityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IEducation {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  grade?: string;
  startYear: number;
  endYear?: number;
  isCurrent: boolean;
}

export interface ISkill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  verified: boolean;
}

export interface IExperience {
  company: string;
  role: string;
  type: 'full-time' | 'internship' | 'freelance';
  description?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface IProject {
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  thumbnail?: string;
  featured: boolean;
}

export interface ISocialLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
  twitter?: string;
  leetcode?: string;
  hackerrank?: string;
  codechef?: string;
  codeforces?: string;
}

export interface ILocation {
  city?: string;
  state?: string;
  country?: string;
  remote?: boolean;
}

export type PlacementStatus =
  | 'not_started'
  | 'in_progress'
  | 'placed'
  | 'not_placed';

export type AvailabilityStatus =
  | 'immediate'
  | '1_month'
  | '2_months'
  | 'not_looking';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: IUser;
}
