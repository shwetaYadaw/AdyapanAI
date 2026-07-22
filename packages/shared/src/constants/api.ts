export const API_VERSION = 'v1';
export const API_BASE = `/api/${API_VERSION}`;

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: `${API_BASE}/auth/register`,
    LOGIN: `${API_BASE}/auth/login`,
    GOOGLE: `${API_BASE}/auth/google`,
    SEND_OTP: `${API_BASE}/auth/send-otp`,
    VERIFY_OTP: `${API_BASE}/auth/verify-otp`,
    VERIFY_EMAIL: `${API_BASE}/auth/verify-email`,
    REFRESH_TOKEN: `${API_BASE}/auth/refresh-token`,
    FORGOT_PASSWORD: `${API_BASE}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE}/auth/reset-password`,
    LOGOUT: `${API_BASE}/auth/logout`,
  },
  // Users
  USERS: {
    ME: `${API_BASE}/users/me`,
    PUBLIC: (id: string) => `${API_BASE}/users/${id}/public`,
  },
  // Students
  STUDENTS: {
    PROFILE: `${API_BASE}/students/profile`,
    BY_ID: (id: string) => `${API_BASE}/students/${id}/profile`,
    SEARCH: `${API_BASE}/students/search`,
    PLACEMENT_STATUS: `${API_BASE}/students/placement-status`,
  },
  // Courses
  COURSES: {
    LIST: `${API_BASE}/courses`,
    DETAIL: (slug: string) => `${API_BASE}/courses/${slug}`,
    SECTIONS: (id: string) => `${API_BASE}/courses/${id}/sections`,
    REVIEWS: (id: string) => `${API_BASE}/courses/${id}/reviews`,
    CREATE: `${API_BASE}/courses`,
    UPDATE: (id: string) => `${API_BASE}/courses/${id}`,
    DELETE: (id: string) => `${API_BASE}/courses/${id}`,
  },
  // Enrollments
  ENROLLMENTS: {
    ENROLL: `${API_BASE}/enrollments`,
    MY_COURSES: `${API_BASE}/enrollments/my-courses`,
    PROGRESS: (courseId: string) => `${API_BASE}/enrollments/${courseId}/progress`,
    UPDATE_PROGRESS: (courseId: string) => `${API_BASE}/enrollments/${courseId}/progress`,
  },
  // Payments
  PAYMENTS: {
    CREATE_ORDER: `${API_BASE}/payments/create-order`,
    VERIFY: `${API_BASE}/payments/verify`,
    HISTORY: `${API_BASE}/payments/history`,
    WEBHOOK_RAZORPAY: `${API_BASE}/payments/webhook/razorpay`,
    WEBHOOK_STRIPE: `${API_BASE}/payments/webhook/stripe`,
  },
  // Certificates
  CERTIFICATES: {
    MY_CERTIFICATES: `${API_BASE}/certificates/my-certificates`,
    VERIFY: (certId: string) => `${API_BASE}/certificates/verify/${certId}`,
    DOWNLOAD: (id: string) => `${API_BASE}/certificates/${id}/download`,
    GENERATE: `${API_BASE}/certificates/generate`,
  },
  // Jobs
  JOBS: {
    LIST: `${API_BASE}/jobs`,
    DETAIL: (slug: string) => `${API_BASE}/jobs/${slug}`,
    APPLY: (id: string) => `${API_BASE}/jobs/${id}/apply`,
    APPLICATIONS: (id: string) => `${API_BASE}/jobs/${id}/applications`,
    UPDATE_APPLICATION: (jobId: string, appId: string) =>
      `${API_BASE}/jobs/${jobId}/applications/${appId}`,
    CREATE: `${API_BASE}/jobs`,
    UPDATE: (id: string) => `${API_BASE}/jobs/${id}`,
    DELETE: (id: string) => `${API_BASE}/jobs/${id}`,
  },
  // Mentors
  MENTORS: {
    LIST: `${API_BASE}/mentors`,
    DETAIL: (id: string) => `${API_BASE}/mentors/${id}`,
    BOOK_SESSION: `${API_BASE}/mentors/sessions/book`,
    MY_SESSIONS: `${API_BASE}/mentors/sessions/my-sessions`,
    REVIEW_SESSION: (id: string) => `${API_BASE}/mentors/sessions/${id}/review`,
  },
  // Forum
  FORUM: {
    POSTS: `${API_BASE}/forum/posts`,
    POST_DETAIL: (id: string) => `${API_BASE}/forum/posts/${id}`,
    REPLY: (id: string) => `${API_BASE}/forum/posts/${id}/replies`,
    UPVOTE: (id: string) => `${API_BASE}/forum/posts/${id}/upvote`,
  },
  // Resume
  RESUME: {
    PROFILE: `${API_BASE}/resume/profile`,
    ANALYZE: `${API_BASE}/resume/analyze`,
    GENERATE_PDF: `${API_BASE}/resume/generate-pdf`,
    COVER_LETTER: `${API_BASE}/resume/cover-letter`,
    LINKEDIN_SUGGESTIONS: `${API_BASE}/resume/linkedin-suggestions`,
  },
  // AI
  AI: {
    CHAT: `${API_BASE}/ai/chat`,
    TUTOR: `${API_BASE}/ai/tutor`,
    PDF_CHAT: `${API_BASE}/ai/pdf-chat`,
    GENERATE_NOTES: `${API_BASE}/ai/generate-notes`,
    GENERATE_QUIZ: `${API_BASE}/ai/generate-quiz`,
    GENERATE_FLASHCARDS: `${API_BASE}/ai/generate-flashcards`,
    GENERATE_MINDMAP: `${API_BASE}/ai/generate-mindmap`,
    CAREER_RECOMMENDATION: `${API_BASE}/ai/career-recommendation`,
    SKILL_GAP: `${API_BASE}/ai/skill-gap`,
    STUDY_PLAN: `${API_BASE}/ai/study-plan`,
    LECTURE_SUMMARIZE: `${API_BASE}/ai/lecture-summarize`,
    OCR: `${API_BASE}/ai/ocr`,
    TRANSLATE: `${API_BASE}/ai/translate`,
    SPEECH_TO_TEXT: `${API_BASE}/ai/speech-to-text`,
    TEXT_TO_SPEECH: `${API_BASE}/ai/text-to-speech`,
    EVALUATE_ASSIGNMENT: `${API_BASE}/ai/evaluate-assignment`,
    MOCK_INTERVIEW_START: `${API_BASE}/placement/mock-interview/start`,
    MOCK_INTERVIEW_ANSWER: (sessionId: string) =>
      `${API_BASE}/placement/mock-interview/${sessionId}/answer`,
  },
  // Notifications
  NOTIFICATIONS: {
    LIST: `${API_BASE}/notifications`,
    READ: (id: string) => `${API_BASE}/notifications/${id}/read`,
    READ_ALL: `${API_BASE}/notifications/read-all`,
    DELETE: (id: string) => `${API_BASE}/notifications/${id}`,
  },
  // Upload
  UPLOAD: {
    CLOUDINARY_SIGNATURE: `${API_BASE}/upload/signature`,
    S3_PRESIGNED: `${API_BASE}/upload/s3-presigned`,
  },
  // Admin
  ADMIN: {
    USERS: `${API_BASE}/admin/users`,
    USER_STATUS: (id: string) => `${API_BASE}/admin/users/${id}/status`,
    PENDING_COURSES: `${API_BASE}/admin/courses/pending`,
    APPROVE_COURSE: (id: string) => `${API_BASE}/admin/courses/${id}/approve`,
    ANALYTICS_OVERVIEW: `${API_BASE}/admin/analytics/overview`,
    ANALYTICS_REVENUE: `${API_BASE}/admin/analytics/revenue`,
    SUPPORT_TICKETS: `${API_BASE}/admin/support-tickets`,
  },
  // Health
  HEALTH: `${API_BASE}/health`,
} as const;
