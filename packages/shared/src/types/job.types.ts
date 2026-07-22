export type JobType = 'full-time' | 'part-time' | 'internship' | 'contract' | 'remote';
export type ApplicationStatus =
  | 'applied'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'rejected'
  | 'offered'
  | 'accepted';

export interface IJob {
  _id: string;
  companyId: string;
  company: IJobCompany;
  postedBy: string;
  title: string;
  slug: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  type: JobType;
  location: string;
  isRemote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  skills: string[];
  experience: { min: number; max: number };
  education?: string;
  openings: number;
  applicationDeadline?: string;
  isActive: boolean;
  applicationCount: number;
  views: number;
  careerTrack?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IJobCompany {
  _id: string;
  name: string;
  logo?: string;
  website?: string;
  industry?: string;
}

export interface IJobApplication {
  _id: string;
  jobId: string;
  studentId: string;
  resumeUrl: string;
  coverLetter?: string;
  status: ApplicationStatus;
  appliedAt: string;
  statusHistory: IApplicationStatusHistory[];
  interviewDate?: string;
  interviewLink?: string;
  offerLetterUrl?: string;
  aiScore?: number;
  recruiterNotes?: string;
}

export interface IApplicationStatusHistory {
  status: ApplicationStatus;
  changedAt: string;
  note?: string;
}

export interface ICompany {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  website?: string;
  description?: string;
  industry?: string;
  size?: string;
  headquarters?: string;
  verified: boolean;
  createdAt: string;
}

export interface JobFilters {
  type?: JobType;
  skills?: string[];
  remote?: boolean;
  location?: string;
  search?: string;
  careerTrack?: string;
  page?: number;
  limit?: number;
}
