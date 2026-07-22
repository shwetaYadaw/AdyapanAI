export type CourseCategory = 'tech' | 'non-tech' | 'placement' | 'ai';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'all';
export type LectureType = 'video' | 'text' | 'quiz' | 'assignment' | 'live' | 'pdf';

export interface ICourse {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  previewVideo?: string;
  category: CourseCategory;
  subCategory: string;
  tags: string[];
  level: CourseLevel;
  language: string;
  instructor: ICourseInstructor;
  price: number;
  originalPrice: number;
  currency: string;
  isFree: boolean;
  isPublished: boolean;
  enrollmentCount: number;
  rating: number;
  ratingCount: number;
  totalDuration: number;
  totalLectures: number;
  requirements: string[];
  learningOutcomes: string[];
  targetAudience: string[];
  certificateEnabled: boolean;
  skillsTaught: string[];
  careerTrack: string[];
  companyRelevance: string[];
  jobRoles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ICourseInstructor {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  headline?: string;
}

export interface ICourseSection {
  _id: string;
  courseId: string;
  title: string;
  order: number;
  duration: number;
  lectureCount: number;
  isPreview: boolean;
  lectures?: ILecture[];
}

export interface ILecture {
  _id: string;
  sectionId: string;
  courseId: string;
  title: string;
  description?: string;
  type: LectureType;
  order: number;
  duration: number;
  videoUrl?: string;
  pdfUrl?: string;
  textContent?: string;
  isPreview: boolean;
  isPublished: boolean;
  resources: ILectureResource[];
}

export interface ILectureResource {
  title: string;
  url: string;
  type: string;
}

export interface IEnrollment {
  _id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  completedAt?: string;
  isCompleted: boolean;
  progress: number;
  lastAccessedAt: string;
  lastLectureId?: string;
  certificateId?: string;
  rating?: number;
  review?: string;
}

export interface ILectureProgress {
  lectureId: string;
  completed: boolean;
  watchedDuration: number;
  completedAt?: string;
}

export interface ICourseReview {
  _id: string;
  userId: string;
  courseId: string;
  rating: number;
  review: string;
  user: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  createdAt: string;
}

export interface ICoursePagination {
  courses: ICourse[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface ICourseFilters {
  category?: CourseCategory;
  level?: CourseLevel;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isFree?: boolean;
  tags?: string[];
  sort?: 'rating' | 'enrollments' | 'newest' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
}
