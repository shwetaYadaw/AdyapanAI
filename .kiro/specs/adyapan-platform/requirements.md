# ADYAPAN — Software Requirements Specification (SRS)
**Version:** 1.0.0  
**Date:** July 2026  
**Classification:** Internal — Architecture & Engineering

---

## 1. Introduction

### 1.1 Purpose
This document defines the complete software requirements for **ADYAPAN**, an AI-Powered Career Development Ecosystem. It serves as the single source of truth for all engineering, design, and product decisions.

### 1.2 Product Vision
ADYAPAN is not a Learning Management System. It is a full-stack career development platform that takes a student from zero knowledge to placement-ready at Top MNCs and non-technical career tracks (Sales, Marketing, BD, HR, Finance, Operations, Customer Success).

### 1.3 Scope
- Responsive Web Application (React.js + TypeScript)
- Android & iOS Mobile Apps (React Native / Expo)
- Backend REST API (Node.js + Express + TypeScript)
- AI Microservice (Python FastAPI)
- Admin & Analytics Dashboards
- Recruiter Portal
- Certificate Validation Portal

### 1.4 Definitions
| Term | Definition |
|---|---|
| LMS | Learning Management System |
| ATS | Applicant Tracking System |
| RBAC | Role-Based Access Control |
| SRS | Software Requirements Specification |
| JWT | JSON Web Token |
| RAG | Retrieval Augmented Generation |
| MNC | Multinational Corporation |

---

## 2. Stakeholders

| Role | Description |
|---|---|
| Student | Primary learner and placement seeker |
| Teacher | Course creator and educator |
| Mentor | Industry professional providing guidance |
| Recruiter | Company HR/TA hiring from the platform |
| Admin | Platform moderator and content manager |
| Super Admin | Full system access, billing, infrastructure |

---

## 3. Functional Requirements

### 3.1 Authentication & Authorization (All Roles)
- FR-AUTH-001: Users shall register via Email + Password with email verification
- FR-AUTH-002: Users shall log in via Google OAuth 2.0
- FR-AUTH-003: Users shall authenticate via OTP (SMS/email)
- FR-AUTH-004: JWT access tokens (15 min expiry) + refresh tokens (7 days)
- FR-AUTH-005: RBAC enforcement on every protected route
- FR-AUTH-006: Password reset via email link
- FR-AUTH-007: Multi-device session management
- FR-AUTH-008: Account deactivation and deletion (GDPR)

### 3.2 Student Features
- FR-STU-001: Browse and search courses by category, skill level, and career track
- FR-STU-002: Enroll in free and paid courses
- FR-STU-003: Watch video lectures with progress tracking
- FR-STU-004: Download notes, assignments, and resources
- FR-STU-005: Attempt quizzes and assignments with AI evaluation
- FR-STU-006: Track learning progress via dashboard
- FR-STU-007: Build and export resume using Resume Builder
- FR-STU-008: Get ATS score and AI suggestions for resume
- FR-STU-009: Generate cover letters with AI
- FR-STU-010: Optimize LinkedIn profile with AI recommendations
- FR-STU-011: Build portfolio from completed projects
- FR-STU-012: Attempt aptitude, reasoning, verbal, and quantitative tests
- FR-STU-013: Practice company-wise interview questions
- FR-STU-014: Schedule and attempt mock interviews (AI-driven)
- FR-STU-015: Participate in coding challenges and hackathons
- FR-STU-016: Earn and download certificates with QR verification
- FR-STU-017: Post and reply in discussion forums
- FR-STU-018: Join study groups
- FR-STU-019: Book mentor sessions
- FR-STU-020: Attend live classes and webinars
- FR-STU-021: Use AI Tutor for concept explanations
- FR-STU-022: Chat with AI Chatbot for queries
- FR-STU-023: Upload PDF and chat with its content
- FR-STU-024: Generate AI notes from lecture content
- FR-STU-025: Generate quizzes from topics
- FR-STU-026: Create flashcards and mind maps
- FR-STU-027: Get career recommendations from AI
- FR-STU-028: View skill gap analysis report
- FR-STU-029: Get personalized study plan from AI
- FR-STU-030: Use voice assistant for hands-free learning
- FR-STU-031: Get lecture summaries
- FR-STU-032: Use OCR to extract text from images
- FR-STU-033: Text-to-speech and speech-to-text features
- FR-STU-034: View company-wise preparation roadmaps
- FR-STU-035: View and manage placement status
- FR-STU-036: Earn badges and achievements
- FR-STU-037: Connect GitHub and LinkedIn profiles
- FR-STU-038: Make payments via Razorpay / Stripe
- FR-STU-039: View payment history and invoices

### 3.3 Teacher Features
- FR-TCH-001: Create and publish courses with sections and lectures
- FR-TCH-002: Upload video, PDF, audio, and text content
- FR-TCH-003: Create quizzes and assignments
- FR-TCH-004: View enrolled student list and progress
- FR-TCH-005: Respond to student queries in course discussion
- FR-TCH-006: View earnings and payout history
- FR-TCH-007: Schedule and host live classes
- FR-TCH-008: Issue certificates to students
- FR-TCH-009: View course analytics (views, completions, ratings)
- FR-TCH-010: Manage course pricing (free/paid/subscription)

### 3.4 Mentor Features
- FR-MEN-001: Create mentor profile with expertise and availability
- FR-MEN-002: Accept or decline mentorship requests
- FR-MEN-003: Schedule 1:1 sessions with students
- FR-MEN-004: Conduct video sessions (integrated or external link)
- FR-MEN-005: Add session notes and action items
- FR-MEN-006: View mentee progress and course completion
- FR-MEN-007: Earn from paid mentorship sessions

### 3.5 Recruiter Features
- FR-REC-001: Register company account with verification
- FR-REC-002: Post jobs and internships with detailed JD
- FR-REC-003: Search and filter student profiles by skills, GPA, location
- FR-REC-004: Shortlist candidates to pipeline
- FR-REC-005: Schedule interviews with automated notifications
- FR-REC-006: Manage offer letters and acceptances
- FR-REC-007: View AI-ranked student profiles
- FR-REC-008: Access verified certificates and project portfolios
- FR-REC-009: View placement analytics

### 3.6 Admin Features
- FR-ADM-001: Manage all user accounts (activate, deactivate, delete)
- FR-ADM-002: Review and approve courses before publishing
- FR-ADM-003: Manage platform payments and refunds
- FR-ADM-004: Issue and revoke certificates
- FR-ADM-005: Monitor AI usage and costs
- FR-ADM-006: View platform analytics and generate reports
- FR-ADM-007: Send platform-wide notifications
- FR-ADM-008: Manage CMS (landing page, blog, announcements)
- FR-ADM-009: Handle support tickets
- FR-ADM-010: Configure platform settings

### 3.7 Super Admin Features
- FR-SUP-001: All Admin capabilities
- FR-SUP-002: Manage Admin accounts
- FR-SUP-003: Access billing and subscription management
- FR-SUP-004: View infrastructure and system health
- FR-SUP-005: Configure RBAC permissions
- FR-SUP-006: Access audit logs

---

## 4. Non-Functional Requirements

### 4.1 Performance
- NFR-PERF-001: API response time < 200ms for 95th percentile
- NFR-PERF-002: Page load time < 3s on 4G connection
- NFR-PERF-003: Support 10,000 concurrent users at launch
- NFR-PERF-004: Video streaming with adaptive bitrate
- NFR-PERF-005: AI features response < 5s for standard queries

### 4.2 Security
- NFR-SEC-001: All data in transit encrypted via TLS 1.3
- NFR-SEC-002: Passwords hashed with bcrypt (12 rounds)
- NFR-SEC-003: JWT tokens signed with RS256
- NFR-SEC-004: Rate limiting on all public endpoints (100 req/15min)
- NFR-SEC-005: SQL/NoSQL injection prevention via input sanitization
- NFR-SEC-006: XSS prevention via output encoding
- NFR-SEC-007: CSRF protection on state-changing operations
- NFR-SEC-008: Audit logs for all admin actions
- NFR-SEC-009: PII data encrypted at rest

### 4.3 Scalability
- NFR-SCL-001: Horizontal scaling via Docker containers
- NFR-SCL-002: MongoDB Atlas auto-scaling
- NFR-SCL-003: CDN for static assets and videos
- NFR-SCL-004: Redis caching for hot data
- NFR-SCL-005: Message queue for async AI tasks

### 4.4 Availability
- NFR-AVL-001: 99.9% uptime SLA
- NFR-AVL-002: Zero-downtime deployments
- NFR-AVL-003: Automated health checks and alerting
- NFR-AVL-004: Database daily backups with 30-day retention

### 4.5 Accessibility
- NFR-ACC-001: WCAG 2.1 AA compliance
- NFR-ACC-002: Screen reader support
- NFR-ACC-003: Keyboard navigation

---

## 5. Feature Priority Matrix

### P0 — Launch Blockers
- User registration and authentication
- Course browsing, enrollment, video playback
- Student dashboard
- Payment integration (Razorpay + Stripe)
- Resume Builder + ATS Score
- Admin user management
- Certificate generation

### P1 — Core Value (Month 2–3)
- AI Tutor and Chatbot
- Mock Interview (AI-driven)
- Recruiter Portal
- Skill Gap Analysis
- Study Planner
- Discussion Forums
- Live Classes

### P2 — Differentiators (Month 4–6)
- PDF Chat
- Voice Assistant
- Emotion-aware recommendations
- Hackathons
- Company-wise roadmaps
- Portfolio Builder
- LinkedIn Optimizer
- Mobile App (Expo)

---

## 6. System Constraints
- All APIs must be stateless and REST-compliant
- Mobile app shares API contracts with web; no mobile-specific endpoints
- AI microservice communicates with backend via internal HTTP
- File uploads go directly to Cloudinary/S3, not through backend server
- Payment webhooks must be idempotent

---

## 7. Assumptions & Dependencies
- MongoDB Atlas M10+ cluster for production
- OpenAI API or self-hosted Llama 3 for AI features
- Cloudinary free tier sufficient for MVP; upgrade as needed
- Razorpay for India; Stripe for international payments
- Google Cloud for OAuth credentials
- Twilio or MSG91 for OTP delivery
- Zoom SDK or Jitsi for live video sessions
