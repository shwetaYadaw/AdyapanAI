# ADYAPAN — Complete Folder Structure
**Architecture:** Monorepo with separate packages

---

```
adyapan/
├── .github/
│   ├── workflows/
│   │   ├── ci-web.yml
│   │   ├── ci-backend.yml
│   │   ├── ci-ai.yml
│   │   └── deploy.yml
│   └── PULL_REQUEST_TEMPLATE.md
│
├── packages/
│   ├── shared/                          # Shared types and utilities
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── user.types.ts
│   │   │   │   ├── course.types.ts
│   │   │   │   ├── auth.types.ts
│   │   │   │   ├── payment.types.ts
│   │   │   │   ├── job.types.ts
│   │   │   │   ├── ai.types.ts
│   │   │   │   └── index.ts
│   │   │   ├── constants/
│   │   │   │   ├── roles.ts
│   │   │   │   ├── routes.ts
│   │   │   │   ├── api.ts
│   │   │   │   └── index.ts
│   │   │   ├── utils/
│   │   │   │   ├── validation.ts
│   │   │   │   ├── formatters.ts
│   │   │   │   ├── date.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│
├── apps/
│   ├── web/                             # React.js Web Application
│   │   ├── public/
│   │   │   ├── favicon.ico
│   │   │   ├── logo.png
│   │   │   └── assets/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── store.ts             # Redux store
│   │   │   │   ├── rootReducer.ts
│   │   │   │   └── hooks.ts
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── common/
│   │   │   │   │   ├── Button/
│   │   │   │   │   │   ├── Button.tsx
│   │   │   │   │   │   ├── Button.types.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── Input/
│   │   │   │   │   ├── Modal/
│   │   │   │   │   ├── Card/
│   │   │   │   │   ├── Badge/
│   │   │   │   │   ├── Avatar/
│   │   │   │   │   ├── Loader/
│   │   │   │   │   ├── Toast/
│   │   │   │   │   ├── Dropdown/
│   │   │   │   │   ├── Table/
│   │   │   │   │   ├── Pagination/
│   │   │   │   │   ├── SearchBar/
│   │   │   │   │   ├── FileUpload/
│   │   │   │   │   ├── VideoPlayer/
│   │   │   │   │   ├── Chart/
│   │   │   │   │   ├── ProgressBar/
│   │   │   │   │   ├── Rating/
│   │   │   │   │   ├── Tooltip/
│   │   │   │   │   └── EmptyState/
│   │   │   │   ├── layout/
│   │   │   │   │   ├── Navbar/
│   │   │   │   │   │   ├── Navbar.tsx
│   │   │   │   │   │   ├── NavLinks.tsx
│   │   │   │   │   │   └── MobileMenu.tsx
│   │   │   │   │   ├── Footer/
│   │   │   │   │   ├── Sidebar/
│   │   │   │   │   ├── DashboardLayout/
│   │   │   │   │   └── AuthLayout/
│   │   │   │   └── feature/
│   │   │   │       ├── course/
│   │   │   │       │   ├── CourseCard/
│   │   │   │       │   ├── CourseGrid/
│   │   │   │       │   ├── CourseHero/
│   │   │   │       │   ├── CourseSyllabus/
│   │   │   │       │   ├── LecturePlayer/
│   │   │   │       │   ├── CourseProgress/
│   │   │   │       │   └── CourseReview/
│   │   │   │       ├── auth/
│   │   │   │       │   ├── LoginForm/
│   │   │   │       │   ├── RegisterForm/
│   │   │   │       │   ├── OTPInput/
│   │   │   │       │   └── GoogleAuthButton/
│   │   │   │       ├── ai/
│   │   │   │       │   ├── AIChat/
│   │   │   │       │   ├── AITutor/
│   │   │   │       │   ├── PDFChat/
│   │   │   │       │   ├── QuizGenerator/
│   │   │   │       │   ├── FlashcardViewer/
│   │   │   │       │   ├── MindMapViewer/
│   │   │   │       │   ├── VoiceAssistant/
│   │   │   │       │   └── InterviewCoach/
│   │   │   │       ├── resume/
│   │   │   │       │   ├── ResumeBuilder/
│   │   │   │       │   ├── ATSScore/
│   │   │   │       │   ├── ResumePreview/
│   │   │   │       │   └── CoverLetterGenerator/
│   │   │   │       ├── placement/
│   │   │   │       │   ├── AptitudeTest/
│   │   │   │       │   ├── MockInterview/
│   │   │   │       │   ├── CompanyRoadmap/
│   │   │   │       │   ├── InterviewExperience/
│   │   │   │       │   └── CodingChallenge/
│   │   │   │       ├── recruiter/
│   │   │   │       │   ├── JobPostForm/
│   │   │   │       │   ├── CandidateCard/
│   │   │   │       │   ├── ApplicationPipeline/
│   │   │   │       │   └── InterviewScheduler/
│   │   │   │       ├── community/
│   │   │   │       │   ├── ForumPost/
│   │   │   │       │   ├── StudyGroup/
│   │   │   │       │   └── LiveClassCard/
│   │   │   │       └── certificate/
│   │   │   │           ├── CertificateCard/
│   │   │   │           ├── CertificateViewer/
│   │   │   │           └── QRVerification/
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── Landing/
│   │   │   │   │   └── LandingPage.tsx
│   │   │   │   ├── auth/
│   │   │   │   │   ├── LoginPage.tsx
│   │   │   │   │   ├── RegisterPage.tsx
│   │   │   │   │   ├── ForgotPasswordPage.tsx
│   │   │   │   │   └── ResetPasswordPage.tsx
│   │   │   │   ├── student/
│   │   │   │   │   ├── DashboardPage.tsx
│   │   │   │   │   ├── ProfilePage.tsx
│   │   │   │   │   ├── CoursesPage.tsx
│   │   │   │   │   ├── CourseDetailPage.tsx
│   │   │   │   │   ├── LearningPage.tsx
│   │   │   │   │   ├── PlacementPage.tsx
│   │   │   │   │   ├── ResumeBuilderPage.tsx
│   │   │   │   │   ├── JobsPage.tsx
│   │   │   │   │   ├── CertificatesPage.tsx
│   │   │   │   │   ├── MentorsPage.tsx
│   │   │   │   │   ├── CommunityPage.tsx
│   │   │   │   │   └── AIFeaturesPage.tsx
│   │   │   │   ├── teacher/
│   │   │   │   │   ├── DashboardPage.tsx
│   │   │   │   │   ├── CourseManagerPage.tsx
│   │   │   │   │   ├── CourseEditorPage.tsx
│   │   │   │   │   ├── StudentsPage.tsx
│   │   │   │   │   └── EarningsPage.tsx
│   │   │   │   ├── recruiter/
│   │   │   │   │   ├── DashboardPage.tsx
│   │   │   │   │   ├── JobsPage.tsx
│   │   │   │   │   ├── CandidatesPage.tsx
│   │   │   │   │   ├── ApplicationsPage.tsx
│   │   │   │   │   └── CompanyProfilePage.tsx
│   │   │   │   ├── mentor/
│   │   │   │   │   ├── DashboardPage.tsx
│   │   │   │   │   ├── SessionsPage.tsx
│   │   │   │   │   └── MenteesPage.tsx
│   │   │   │   ├── admin/
│   │   │   │   │   ├── DashboardPage.tsx
│   │   │   │   │   ├── UsersPage.tsx
│   │   │   │   │   ├── CoursesPage.tsx
│   │   │   │   │   ├── PaymentsPage.tsx
│   │   │   │   │   ├── CertificatesPage.tsx
│   │   │   │   │   ├── AnalyticsPage.tsx
│   │   │   │   │   ├── ReportsPage.tsx
│   │   │   │   │   ├── SupportPage.tsx
│   │   │   │   │   └── SettingsPage.tsx
│   │   │   │   └── public/
│   │   │   │       ├── CertificateVerifyPage.tsx
│   │   │   │       ├── CourseCatalogPage.tsx
│   │   │   │       └── BlogPage.tsx
│   │   │   │
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── authSlice.ts
│   │   │   │   │   ├── authAPI.ts
│   │   │   │   │   └── authSelectors.ts
│   │   │   │   ├── courses/
│   │   │   │   │   ├── coursesSlice.ts
│   │   │   │   │   ├── coursesAPI.ts
│   │   │   │   │   └── coursesSelectors.ts
│   │   │   │   ├── enrollment/
│   │   │   │   ├── ai/
│   │   │   │   │   ├── aiSlice.ts
│   │   │   │   │   └── aiAPI.ts
│   │   │   │   ├── student/
│   │   │   │   ├── recruiter/
│   │   │   │   └── notifications/
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useCourses.ts
│   │   │   │   ├── useEnrollment.ts
│   │   │   │   ├── usePayment.ts
│   │   │   │   ├── useAI.ts
│   │   │   │   ├── useUpload.ts
│   │   │   │   ├── useNotifications.ts
│   │   │   │   ├── useDebounce.ts
│   │   │   │   └── useLocalStorage.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── api.ts               # Axios instance + interceptors
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── course.service.ts
│   │   │   │   ├── payment.service.ts
│   │   │   │   ├── ai.service.ts
│   │   │   │   ├── upload.service.ts
│   │   │   │   └── notification.service.ts
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── auth.utils.ts
│   │   │   │   ├── format.utils.ts
│   │   │   │   ├── storage.utils.ts
│   │   │   │   ├── validation.utils.ts
│   │   │   │   └── razorpay.utils.ts
│   │   │   │
│   │   │   ├── styles/
│   │   │   │   ├── globals.css
│   │   │   │   └── animations.css
│   │   │   │
│   │   │   ├── config/
│   │   │   │   └── env.ts
│   │   │   │
│   │   │   ├── router/
│   │   │   │   ├── AppRouter.tsx
│   │   │   │   ├── ProtectedRoute.tsx
│   │   │   │   └── RoleRoute.tsx
│   │   │   │
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   │
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── mobile/                          # React Native Expo App
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login.tsx
│   │   │   │   ├── register.tsx
│   │   │   │   └── otp.tsx
│   │   │   ├── (student)/
│   │   │   │   ├── _layout.tsx
│   │   │   │   ├── index.tsx            # Dashboard
│   │   │   │   ├── courses/
│   │   │   │   ├── learn/
│   │   │   │   ├── placement/
│   │   │   │   ├── ai/
│   │   │   │   └── profile/
│   │   │   ├── (teacher)/
│   │   │   ├── (recruiter)/
│   │   │   └── _layout.tsx
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Avatar.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Loader.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   └── ProgressBar.tsx
│   │   │   ├── layout/
│   │   │   │   ├── TabBar.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── DrawerMenu.tsx
│   │   │   └── feature/
│   │   │       ├── CourseCard.tsx
│   │   │       ├── VideoPlayer.tsx
│   │   │       ├── AIChat.tsx
│   │   │       └── ResumeCard.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts               # Same logic as web
│   │   │   ├── useCourses.ts
│   │   │   └── useAI.ts
│   │   ├── services/
│   │   │   └── api.ts                   # Same endpoints as web
│   │   ├── store/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── assets/
│   │   ├── app.json
│   │   ├── eas.json
│   │   ├── babel.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── backend/                         # Node.js API Server
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   ├── database.ts
│   │   │   │   ├── redis.ts
│   │   │   │   ├── cloudinary.ts
│   │   │   │   ├── s3.ts
│   │   │   │   ├── razorpay.ts
│   │   │   │   ├── stripe.ts
│   │   │   │   ├── email.ts
│   │   │   │   └── env.ts
│   │   │   │
│   │   │   ├── models/
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── studentProfile.model.ts
│   │   │   │   ├── course.model.ts
│   │   │   │   ├── section.model.ts
│   │   │   │   ├── lecture.model.ts
│   │   │   │   ├── enrollment.model.ts
│   │   │   │   ├── quiz.model.ts
│   │   │   │   ├── quizAttempt.model.ts
│   │   │   │   ├── certificate.model.ts
│   │   │   │   ├── payment.model.ts
│   │   │   │   ├── job.model.ts
│   │   │   │   ├── jobApplication.model.ts
│   │   │   │   ├── company.model.ts
│   │   │   │   ├── mentor.model.ts
│   │   │   │   ├── mentorSession.model.ts
│   │   │   │   ├── forumPost.model.ts
│   │   │   │   ├── notification.model.ts
│   │   │   │   ├── resumeProfile.model.ts
│   │   │   │   ├── badge.model.ts
│   │   │   │   ├── aiUsageLog.model.ts
│   │   │   │   ├── auditLog.model.ts
│   │   │   │   ├── studyGroup.model.ts
│   │   │   │   ├── liveClass.model.ts
│   │   │   │   └── placementTracking.model.ts
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── user.routes.ts
│   │   │   │   ├── student.routes.ts
│   │   │   │   ├── course.routes.ts
│   │   │   │   ├── enrollment.routes.ts
│   │   │   │   ├── quiz.routes.ts
│   │   │   │   ├── certificate.routes.ts
│   │   │   │   ├── payment.routes.ts
│   │   │   │   ├── job.routes.ts
│   │   │   │   ├── mentor.routes.ts
│   │   │   │   ├── forum.routes.ts
│   │   │   │   ├── resume.routes.ts
│   │   │   │   ├── placement.routes.ts
│   │   │   │   ├── ai.routes.ts
│   │   │   │   ├── admin.routes.ts
│   │   │   │   ├── notification.routes.ts
│   │   │   │   ├── upload.routes.ts
│   │   │   │   └── health.routes.ts
│   │   │   │
│   │   │   ├── controllers/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── student.controller.ts
│   │   │   │   ├── course.controller.ts
│   │   │   │   ├── enrollment.controller.ts
│   │   │   │   ├── quiz.controller.ts
│   │   │   │   ├── certificate.controller.ts
│   │   │   │   ├── payment.controller.ts
│   │   │   │   ├── job.controller.ts
│   │   │   │   ├── mentor.controller.ts
│   │   │   │   ├── forum.controller.ts
│   │   │   │   ├── resume.controller.ts
│   │   │   │   ├── placement.controller.ts
│   │   │   │   ├── ai.controller.ts
│   │   │   │   ├── admin.controller.ts
│   │   │   │   ├── notification.controller.ts
│   │   │   │   └── upload.controller.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   ├── course.service.ts
│   │   │   │   ├── enrollment.service.ts
│   │   │   │   ├── quiz.service.ts
│   │   │   │   ├── certificate.service.ts
│   │   │   │   ├── payment.service.ts
│   │   │   │   ├── job.service.ts
│   │   │   │   ├── mentor.service.ts
│   │   │   │   ├── forum.service.ts
│   │   │   │   ├── resume.service.ts
│   │   │   │   ├── placement.service.ts
│   │   │   │   ├── ai.service.ts         # Proxy to AI microservice
│   │   │   │   ├── email.service.ts
│   │   │   │   ├── notification.service.ts
│   │   │   │   ├── upload.service.ts
│   │   │   │   ├── cache.service.ts
│   │   │   │   └── audit.service.ts
│   │   │   │
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── rbac.middleware.ts
│   │   │   │   ├── rateLimiter.middleware.ts
│   │   │   │   ├── validation.middleware.ts
│   │   │   │   ├── upload.middleware.ts
│   │   │   │   ├── errorHandler.middleware.ts
│   │   │   │   ├── requestLogger.middleware.ts
│   │   │   │   └── cors.middleware.ts
│   │   │   │
│   │   │   ├── validators/
│   │   │   │   ├── auth.validator.ts
│   │   │   │   ├── course.validator.ts
│   │   │   │   ├── job.validator.ts
│   │   │   │   ├── payment.validator.ts
│   │   │   │   └── user.validator.ts
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── jwt.utils.ts
│   │   │   │   ├── bcrypt.utils.ts
│   │   │   │   ├── otp.utils.ts
│   │   │   │   ├── certificate.utils.ts
│   │   │   │   ├── pdf.utils.ts
│   │   │   │   ├── qr.utils.ts
│   │   │   │   ├── pagination.utils.ts
│   │   │   │   ├── slugify.utils.ts
│   │   │   │   └── response.utils.ts
│   │   │   │
│   │   │   ├── types/
│   │   │   │   ├── express.d.ts
│   │   │   │   └── global.types.ts
│   │   │   │
│   │   │   ├── jobs/                    # Background jobs
│   │   │   │   ├── email.job.ts
│   │   │   │   ├── certificate.job.ts
│   │   │   │   ├── analytics.job.ts
│   │   │   │   └── cleanup.job.ts
│   │   │   │
│   │   │   ├── events/
│   │   │   │   ├── enrollment.event.ts
│   │   │   │   ├── payment.event.ts
│   │   │   │   └── certificate.event.ts
│   │   │   │
│   │   │   └── app.ts
│   │   │
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   └── integration/
│   │   │
│   │   ├── server.ts
│   │   ├── Dockerfile
│   │   ├── .env.example
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── ai-service/                      # Python FastAPI AI Microservice
│       ├── app/
│       │   ├── api/
│       │   │   ├── v1/
│       │   │   │   ├── router.py
│       │   │   │   ├── chat.py
│       │   │   │   ├── tutor.py
│       │   │   │   ├── pdf_chat.py
│       │   │   │   ├── quiz.py
│       │   │   │   ├── flashcards.py
│       │   │   │   ├── mindmap.py
│       │   │   │   ├── resume.py
│       │   │   │   ├── interview.py
│       │   │   │   ├── career.py
│       │   │   │   ├── notes.py
│       │   │   │   ├── study_plan.py
│       │   │   │   ├── summarize.py
│       │   │   │   ├── ocr.py
│       │   │   │   ├── translate.py
│       │   │   │   ├── speech.py
│       │   │   │   └── assignment.py
│       │   │   └── __init__.py
│       │   ├── core/
│       │   │   ├── config.py
│       │   │   ├── security.py
│       │   │   └── logger.py
│       │   ├── services/
│       │   │   ├── llm_service.py
│       │   │   ├── embedding_service.py
│       │   │   ├── vector_store.py
│       │   │   ├── rag_service.py
│       │   │   ├── whisper_service.py
│       │   │   ├── ocr_service.py
│       │   │   ├── tts_service.py
│       │   │   └── translation_service.py
│       │   ├── models/
│       │   │   ├── chat.py
│       │   │   ├── quiz.py
│       │   │   ├── resume.py
│       │   │   └── career.py
│       │   ├── prompts/
│       │   │   ├── tutor.py
│       │   │   ├── interview.py
│       │   │   ├── resume.py
│       │   │   ├── career.py
│       │   │   └── quiz.py
│       │   ├── utils/
│       │   │   ├── pdf_parser.py
│       │   │   ├── text_splitter.py
│       │   │   └── validators.py
│       │   └── main.py
│       ├── tests/
│       ├── Dockerfile
│       ├── requirements.txt
│       └── .env.example
│
├── docker-compose.yml
├── docker-compose.prod.yml
├── .gitignore
├── .env.example
├── README.md
└── package.json                         # Workspace root
```
