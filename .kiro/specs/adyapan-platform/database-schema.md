# ADYAPAN — MongoDB Schema Design
**Version:** 1.0.0

---

## ER Diagram (Textual Representation)

```
User (1) ──────────── (N) Enrollment
User (1) ──────────── (N) Certificate
User (1) ──────────── (1) StudentProfile
User (1) ──────────── (N) Payment
User (1) ──────────── (N) Notification
Course (1) ─────────── (N) Enrollment
Course (1) ─────────── (N) Section
Section (1) ────────── (N) Lecture
Lecture (1) ────────── (N) Quiz
Quiz (1) ───────────── (N) QuizAttempt
User (1) ──────────── (N) ForumPost
ForumPost (1) ──────── (N) ForumReply
Job (1) ─────────────── (N) Application
Mentor (1) ─────────── (N) MentorSession
Company (1) ────────── (N) Job
```

---

## Collections

### 1. users
```typescript
{
  _id: ObjectId,
  email: string (unique, indexed),
  password: string (bcrypt hashed),
  firstName: string,
  lastName: string,
  avatar: string (URL),
  role: enum['student','teacher','mentor','recruiter','admin','superadmin'],
  isEmailVerified: boolean,
  isActive: boolean,
  googleId: string (optional),
  phone: string (optional),
  phoneVerified: boolean,
  lastLogin: Date,
  loginCount: number,
  deviceTokens: string[],     // for push notifications
  preferences: {
    language: string,
    darkMode: boolean,
    emailNotifications: boolean,
    pushNotifications: boolean
  },
  createdAt: Date,
  updatedAt: Date
}
// Indexes: email (unique), googleId, role, isActive
```

### 2. studentProfiles
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: users, unique),
  headline: string,
  bio: string,
  education: [{
    institution: string,
    degree: string,
    fieldOfStudy: string,
    grade: string,
    startYear: number,
    endYear: number,
    isCurrent: boolean
  }],
  skills: [{
    name: string,
    level: enum['beginner','intermediate','advanced','expert'],
    verified: boolean
  }],
  experience: [{
    company: string,
    role: string,
    type: enum['full-time','internship','freelance'],
    description: string,
    startDate: Date,
    endDate: Date,
    isCurrent: boolean
  }],
  projects: [{
    title: string,
    description: string,
    techStack: string[],
    githubUrl: string,
    liveUrl: string,
    thumbnail: string,
    featured: boolean
  }],
  socialLinks: {
    github: string,
    linkedin: string,
    portfolio: string,
    twitter: string,
    leetcode: string,
    hackerrank: string,
    codechef: string,
    codeforces: string
  },
  placementStatus: enum['not_started','in_progress','placed','not_placed'],
  placedAt: string (company name),
  placedPackage: number,
  badges: ObjectId[] (ref: badges),
  totalXP: number,
  level: number,
  streak: number,
  lastActiveDate: Date,
  resumeUrl: string,
  atsScore: number,
  careerTrack: string[],
  targetCompanies: string[],
  location: {
    city: string,
    state: string,
    country: string,
    remote: boolean
  },
  availability: enum['immediate','1_month','2_months','not_looking'],
  createdAt: Date,
  updatedAt: Date
}
```

### 3. courses
```typescript
{
  _id: ObjectId,
  title: string (indexed),
  slug: string (unique, indexed),
  description: string,
  shortDescription: string,
  thumbnail: string (URL),
  previewVideo: string (URL),
  category: enum['tech','non-tech','placement','ai'],
  subCategory: string,
  tags: string[],
  level: enum['beginner','intermediate','advanced','all'],
  language: string,
  instructor: ObjectId (ref: users),
  coInstructors: ObjectId[],
  price: number,
  originalPrice: number,
  currency: string,
  isFree: boolean,
  isPublished: boolean,
  isApproved: boolean,
  approvedBy: ObjectId,
  enrollmentCount: number,
  rating: number,
  ratingCount: number,
  totalDuration: number (minutes),
  totalLectures: number,
  requirements: string[],
  learningOutcomes: string[],
  targetAudience: string[],
  certificateEnabled: boolean,
  completionThreshold: number (percentage, default 80),
  sections: ObjectId[] (ref: sections),
  careerTrack: string[],
  companyRelevance: string[],
  jobRoles: string[],
  skillsTaught: string[],
  seoTitle: string,
  seoDescription: string,
  createdAt: Date,
  updatedAt: Date,
  publishedAt: Date
}
// Indexes: slug (unique), category, tags, instructor, isPublished+isApproved
```

### 4. sections
```typescript
{
  _id: ObjectId,
  courseId: ObjectId (ref: courses),
  title: string,
  order: number,
  duration: number (minutes),
  lectureCount: number,
  isPreview: boolean,
  createdAt: Date
}
```

### 5. lectures
```typescript
{
  _id: ObjectId,
  sectionId: ObjectId (ref: sections),
  courseId: ObjectId (ref: courses),
  title: string,
  description: string,
  type: enum['video','text','quiz','assignment','live','pdf'],
  order: number,
  duration: number (seconds),
  videoUrl: string,
  videoPublicId: string (Cloudinary),
  videoResolutions: [{
    quality: string,
    url: string
  }],
  pdfUrl: string,
  textContent: string,
  isPreview: boolean,
  isPublished: boolean,
  resources: [{
    title: string,
    url: string,
    type: string
  }],
  subtitles: [{
    language: string,
    url: string
  }],
  aiSummary: string,
  aiTranscript: string,
  createdAt: Date,
  updatedAt: Date
}
```

### 6. enrollments
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  courseId: ObjectId (ref: courses),
  enrolledAt: Date,
  completedAt: Date,
  isCompleted: boolean,
  progress: number (0-100),
  lastAccessedAt: Date,
  lastLectureId: ObjectId,
  lectureProgress: [{
    lectureId: ObjectId,
    completed: boolean,
    watchedDuration: number,
    completedAt: Date
  }],
  certificateId: ObjectId,
  paymentId: ObjectId,
  rating: number,
  review: string,
  reviewedAt: Date
}
// Indexes: userId+courseId (unique compound), userId, courseId
```

### 7. quizzes
```typescript
{
  _id: ObjectId,
  lectureId: ObjectId (optional),
  courseId: ObjectId,
  title: string,
  description: string,
  type: enum['mcq','coding','subjective','aptitude'],
  difficulty: enum['easy','medium','hard'],
  duration: number (minutes),
  passingScore: number,
  questions: [{
    _id: ObjectId,
    text: string,
    type: enum['single','multiple','true_false','fill'],
    options: [{
      text: string,
      isCorrect: boolean
    }],
    explanation: string,
    marks: number,
    tags: string[]
  }],
  isAIGenerated: boolean,
  createdBy: ObjectId,
  isPublished: boolean,
  createdAt: Date
}
```

### 8. quizAttempts
```typescript
{
  _id: ObjectId,
  quizId: ObjectId (ref: quizzes),
  userId: ObjectId (ref: users),
  answers: [{
    questionId: ObjectId,
    selectedOptions: string[],
    isCorrect: boolean,
    marksObtained: number
  }],
  score: number,
  percentage: number,
  passed: boolean,
  timeTaken: number (seconds),
  attemptNumber: number,
  feedback: string (AI generated),
  startedAt: Date,
  submittedAt: Date
}
```

### 9. certificates
```typescript
{
  _id: ObjectId,
  certificateId: string (unique, UUID format: ADY-XXXX-XXXX),
  userId: ObjectId (ref: users),
  courseId: ObjectId (ref: courses),
  issuedAt: Date,
  expiresAt: Date (optional),
  studentName: string,
  courseName: string,
  instructorName: string,
  grade: string,
  score: number,
  pdfUrl: string,
  thumbnailUrl: string,
  qrData: string (verification URL),
  isRevoked: boolean,
  revokedAt: Date,
  revokedReason: string,
  issuedBy: ObjectId (ref: users),
  skills: string[],
  metadata: object
}
// Indexes: certificateId (unique), userId, courseId
```

### 10. payments
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  courseId: ObjectId (ref: courses, optional),
  mentorSessionId: ObjectId (optional),
  gateway: enum['razorpay','stripe'],
  gatewayOrderId: string,
  gatewayPaymentId: string,
  gatewaySignature: string,
  amount: number,
  currency: string,
  status: enum['pending','completed','failed','refunded'],
  type: enum['course','subscription','mentor_session'],
  invoice: string (URL),
  refundId: string,
  refundAmount: number,
  createdAt: Date,
  updatedAt: Date
}
// Indexes: userId, gatewayOrderId, status
```

### 11. jobs
```typescript
{
  _id: ObjectId,
  companyId: ObjectId (ref: companies),
  postedBy: ObjectId (ref: users),
  title: string,
  slug: string (unique),
  description: string,
  requirements: string[],
  responsibilities: string[],
  type: enum['full-time','part-time','internship','contract','remote'],
  location: string,
  isRemote: boolean,
  salaryMin: number,
  salaryMax: number,
  currency: string,
  skills: string[],
  experience: { min: number, max: number },
  education: string,
  openings: number,
  applicationDeadline: Date,
  isActive: boolean,
  applicationCount: number,
  views: number,
  careerTrack: string,
  createdAt: Date,
  updatedAt: Date
}
```

### 12. jobApplications
```typescript
{
  _id: ObjectId,
  jobId: ObjectId (ref: jobs),
  studentId: ObjectId (ref: users),
  resumeUrl: string,
  coverLetter: string,
  status: enum['applied','shortlisted','interview_scheduled','rejected','offered','accepted'],
  appliedAt: Date,
  statusHistory: [{
    status: string,
    changedAt: Date,
    note: string
  }],
  interviewDate: Date,
  interviewLink: string,
  offerLetterUrl: string,
  aiScore: number,
  recruiterNotes: string
}
```

### 13. companies
```typescript
{
  _id: ObjectId,
  name: string,
  slug: string (unique),
  logo: string (URL),
  website: string,
  description: string,
  industry: string,
  size: enum['1-10','11-50','51-200','201-500','501-1000','1000+'],
  headquarters: string,
  verified: boolean,
  verifiedAt: Date,
  recruiters: ObjectId[] (ref: users),
  createdAt: Date
}
```

### 14. mentors
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: users, unique),
  headline: string,
  bio: string,
  expertise: string[],
  industries: string[],
  experience: number (years),
  currentCompany: string,
  currentRole: string,
  sessionRate: number,
  currency: string,
  sessionDuration: number (minutes),
  availability: [{
    dayOfWeek: number,
    slots: [{ start: string, end: string }]
  }],
  rating: number,
  totalSessions: number,
  linkedinUrl: string,
  isApproved: boolean,
  isActive: boolean,
  createdAt: Date
}
```

### 15. mentorSessions
```typescript
{
  _id: ObjectId,
  mentorId: ObjectId (ref: mentors),
  studentId: ObjectId (ref: users),
  scheduledAt: Date,
  duration: number (minutes),
  status: enum['scheduled','completed','cancelled','no_show'],
  meetingLink: string,
  topic: string,
  notes: string,
  studentRating: number,
  studentReview: string,
  mentorNotes: string,
  paymentId: ObjectId,
  createdAt: Date
}
```

### 16. forumPosts
```typescript
{
  _id: ObjectId,
  courseId: ObjectId (optional),
  authorId: ObjectId (ref: users),
  title: string,
  content: string,
  tags: string[],
  category: string,
  upvotes: number,
  views: number,
  replyCount: number,
  isPinned: boolean,
  isClosed: boolean,
  isResolved: boolean,
  bestAnswerId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### 17. notifications
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  type: string,
  title: string,
  message: string,
  data: object,
  isRead: boolean,
  readAt: Date,
  channel: enum['in-app','email','push'],
  createdAt: Date
}
// Index: userId + isRead, TTL index on createdAt (90 days)
```

### 18. resumeProfiles
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: users, unique),
  versions: [{
    name: string,
    data: object (full resume JSON),
    atsScore: number,
    suggestions: string[],
    pdfUrl: string,
    createdAt: Date
  }],
  activeVersion: number,
  createdAt: Date,
  updatedAt: Date
}
```

### 19. badges
```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  icon: string (URL),
  category: enum['learning','placement','community','achievement'],
  criteria: object,
  xpReward: number,
  isActive: boolean
}
```

### 20. aiUsageLogs
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  feature: string,
  model: string,
  tokensUsed: number,
  cost: number,
  latency: number,
  success: boolean,
  errorMessage: string,
  createdAt: Date
}
// TTL: 30 days, Index: userId, feature, createdAt
```

### 21. auditLogs
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  action: string,
  resource: string,
  resourceId: string,
  changes: object,
  ipAddress: string,
  userAgent: string,
  createdAt: Date
}
// TTL: 365 days
```

### 22. studyGroups
```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  createdBy: ObjectId (ref: users),
  members: ObjectId[],
  maxMembers: number,
  courseId: ObjectId (optional),
  isPrivate: boolean,
  inviteCode: string,
  tags: string[],
  createdAt: Date
}
```

### 23. liveClasses
```typescript
{
  _id: ObjectId,
  title: string,
  description: string,
  hostId: ObjectId (ref: users),
  courseId: ObjectId (optional),
  scheduledAt: Date,
  duration: number (minutes),
  meetingLink: string,
  platform: enum['zoom','jitsi','google_meet','custom'],
  maxAttendees: number,
  registeredCount: number,
  status: enum['scheduled','live','completed','cancelled'],
  recordingUrl: string,
  isPublic: boolean,
  tags: string[],
  createdAt: Date
}
```

### 24. placementTracking
```typescript
{
  _id: ObjectId,
  studentId: ObjectId (ref: users, unique),
  applications: ObjectId[] (ref: jobApplications),
  interviews: [{
    company: string,
    date: Date,
    round: string,
    result: enum['passed','failed','pending'],
    feedback: string
  }],
  offers: [{
    company: string,
    role: string,
    package: number,
    currency: string,
    offerDate: Date,
    status: enum['pending','accepted','rejected']
  }],
  overallStatus: enum['not_started','active','placed'],
  targetDate: Date,
  notes: string,
  updatedAt: Date
}
```
