# ADYAPAN — API Documentation
**Base URL:** `https://api.adyapan.com/api/v1`  
**Version:** 1.0.0  
**Authentication:** Bearer JWT Token

---

## Auth Endpoints

### POST /auth/register
Register a new user.
```json
Body: { "email": "string", "password": "string", "firstName": "string", "lastName": "string", "role": "student|teacher|recruiter" }
Response 201: { "message": "Verification email sent", "userId": "string" }
```

### POST /auth/login
```json
Body: { "email": "string", "password": "string" }
Response 200: { "accessToken": "string", "refreshToken": "string", "user": { ...userObject } }
```

### POST /auth/google
```json
Body: { "idToken": "string" }
Response 200: { "accessToken": "string", "refreshToken": "string", "user": { ...userObject } }
```

### POST /auth/send-otp
```json
Body: { "phone": "string" }
Response 200: { "message": "OTP sent" }
```

### POST /auth/verify-otp
```json
Body: { "phone": "string", "otp": "string" }
Response 200: { "verified": true }
```

### POST /auth/verify-email
```json
Body: { "token": "string" }
Response 200: { "message": "Email verified" }
```

### POST /auth/refresh-token
```json
Body: { "refreshToken": "string" }
Response 200: { "accessToken": "string" }
```

### POST /auth/forgot-password
```json
Body: { "email": "string" }
Response 200: { "message": "Reset link sent" }
```

### POST /auth/reset-password
```json
Body: { "token": "string", "newPassword": "string" }
Response 200: { "message": "Password updated" }
```

### POST /auth/logout
```json
Headers: Authorization: Bearer <token>
Response 200: { "message": "Logged out" }
```

---

## User Endpoints

### GET /users/me
Get current user profile.

### PUT /users/me
Update user profile.

### DELETE /users/me
Deactivate account.

### GET /users/:id/public
Get public profile of a user.

---

## Student Profile Endpoints

### GET /students/profile
Get own student profile.

### PUT /students/profile
Update student profile.

### GET /students/:id/profile
Get student profile by ID (recruiter/admin).

### GET /students/search
Search students by skills, location, availability (Recruiter only).
```
Query: ?skills=react,node&location=bangalore&availability=immediate&page=1&limit=20
```

### PUT /students/placement-status
Update placement status.

---

## Course Endpoints

### GET /courses
List all published courses.
```
Query: ?category=tech&level=beginner&search=react&page=1&limit=20&sort=rating
Response: { courses: [...], total, page, pages }
```

### GET /courses/:slug
Get single course detail.

### POST /courses (Teacher/Admin)
Create course.

### PUT /courses/:id (Teacher/Admin)
Update course.

### DELETE /courses/:id (Admin)
Delete course.

### GET /courses/:id/sections
Get course sections and lectures.

### POST /courses/:id/sections (Teacher)
Add section.

### POST /courses/:id/sections/:sectionId/lectures (Teacher)
Add lecture.

### GET /courses/:id/reviews
Get course reviews.

### POST /courses/:id/reviews
Submit course review (enrolled student).

---

## Enrollment Endpoints

### POST /enrollments
Enroll in a course.
```json
Body: { "courseId": "string", "paymentId": "string" }
```

### GET /enrollments/my-courses
Get student's enrolled courses.

### GET /enrollments/:courseId/progress
Get progress in a course.

### PUT /enrollments/:courseId/progress
Update lecture progress.
```json
Body: { "lectureId": "string", "watchedDuration": 120, "completed": true }
```

---

## Quiz Endpoints

### GET /quizzes/:id
Get quiz.

### POST /quizzes/:id/attempt
Submit quiz attempt.
```json
Body: { "answers": [{ "questionId": "string", "selectedOptions": ["string"] }] }
```

### GET /quizzes/:id/attempts
Get student's attempts for a quiz.

---

## Certificate Endpoints

### GET /certificates/my-certificates
Get student's certificates.

### GET /certificates/verify/:certificateId
Public endpoint to verify certificate.

### POST /certificates/generate (Admin/Teacher)
Generate certificate.

### GET /certificates/:id/download
Download certificate PDF.

---

## Payment Endpoints

### POST /payments/create-order
Create payment order.
```json
Body: { "courseId": "string", "gateway": "razorpay|stripe", "couponCode": "string" }
Response: { "orderId": "string", "amount": number, "currency": "string", "key": "string" }
```

### POST /payments/verify
Verify payment after gateway callback.
```json
Body: { "razorpay_order_id": "...", "razorpay_payment_id": "...", "razorpay_signature": "..." }
```

### POST /payments/webhook/razorpay
Razorpay webhook (public, verified by signature).

### POST /payments/webhook/stripe
Stripe webhook (public, verified by signature).

### GET /payments/history
Get payment history.

---

## Job Endpoints

### GET /jobs
List active jobs.
```
Query: ?type=full-time&skills=react&remote=true&page=1&limit=20
```

### GET /jobs/:slug
Get job details.

### POST /jobs (Recruiter)
Post a job.

### PUT /jobs/:id (Recruiter)
Update job.

### DELETE /jobs/:id (Recruiter/Admin)
Delete job.

### POST /jobs/:id/apply (Student)
Apply for job.
```json
Body: { "resumeUrl": "string", "coverLetter": "string" }
```

### GET /jobs/:id/applications (Recruiter)
Get applications for a job.

### PUT /jobs/:id/applications/:applicationId (Recruiter)
Update application status.
```json
Body: { "status": "shortlisted|rejected|interview_scheduled", "note": "string" }
```

---

## Mentor Endpoints

### GET /mentors
List available mentors.

### GET /mentors/:id
Get mentor profile.

### POST /mentors/sessions/book
Book mentor session.
```json
Body: { "mentorId": "string", "scheduledAt": "ISO date", "topic": "string" }
```

### GET /mentors/sessions/my-sessions
Get student's mentor sessions.

### PUT /mentors/sessions/:id/review
Rate and review a session.

---

## Forum Endpoints

### GET /forum/posts
List forum posts.

### POST /forum/posts
Create forum post.

### GET /forum/posts/:id
Get post with replies.

### POST /forum/posts/:id/replies
Add reply.

### POST /forum/posts/:id/upvote
Upvote a post.

---

## Resume Builder Endpoints

### GET /resume/profile
Get resume data.

### PUT /resume/profile
Save resume data.

### POST /resume/analyze (AI)
Analyze resume and get ATS score.

### POST /resume/generate-pdf
Generate resume PDF.

### POST /resume/cover-letter (AI)
Generate cover letter.

### POST /resume/linkedin-suggestions (AI)
Get LinkedIn profile optimization suggestions.

---

## Placement Prep Endpoints

### GET /placement/aptitude/tests
List aptitude tests.

### GET /placement/aptitude/tests/:id
Get aptitude test.

### POST /placement/aptitude/tests/:id/submit
Submit aptitude test.

### GET /placement/companies
List companies with prep material.

### GET /placement/companies/:slug/roadmap
Get company-specific preparation roadmap.

### GET /placement/interview-experiences
Get interview experiences.

### POST /placement/mock-interview/start (AI)
Start AI mock interview session.

### POST /placement/mock-interview/:sessionId/answer (AI)
Submit answer, get AI feedback.

---

## AI Endpoints

### POST /ai/chat
AI Chatbot.
```json
Body: { "message": "string", "conversationId": "string", "context": "string" }
```

### POST /ai/tutor
AI Tutor for concept explanation.
```json
Body: { "topic": "string", "level": "beginner|intermediate|advanced", "courseId": "string" }
```

### POST /ai/pdf-chat
Chat with uploaded PDF.
```json
Body: { "pdfUrl": "string", "question": "string", "conversationId": "string" }
```

### POST /ai/generate-notes
Generate notes from lecture.
```json
Body: { "lectureId": "string", "content": "string" }
```

### POST /ai/generate-quiz
Generate quiz from topic.
```json
Body: { "topic": "string", "count": 10, "difficulty": "easy|medium|hard", "type": "mcq" }
```

### POST /ai/generate-flashcards
Generate flashcards.
```json
Body: { "topic": "string", "count": 20 }
```

### POST /ai/generate-mindmap
Generate mind map structure.
```json
Body: { "topic": "string" }
```

### POST /ai/career-recommendation
Get career recommendations.
```json
Body: { "skills": [], "interests": [], "experience": "string" }
```

### POST /ai/skill-gap
Skill gap analysis.
```json
Body: { "targetRole": "string", "currentSkills": [] }
```

### POST /ai/study-plan
Generate personalized study plan.
```json
Body: { "goal": "string", "availableHours": 2, "targetDate": "ISO date" }
```

### POST /ai/lecture-summarize
Summarize lecture transcript.

### POST /ai/ocr
Extract text from image.

### POST /ai/translate
Translate content.
```json
Body: { "text": "string", "targetLanguage": "string" }
```

### POST /ai/speech-to-text
Convert audio to text.

### POST /ai/text-to-speech
Convert text to audio.

### POST /ai/evaluate-assignment
AI assignment evaluation.

---

## Admin Endpoints

### GET /admin/users
List users with filters.

### PUT /admin/users/:id/status
Activate/deactivate user.

### GET /admin/courses/pending
Courses awaiting approval.

### PUT /admin/courses/:id/approve
Approve course.

### GET /admin/analytics/overview
Platform analytics overview.

### GET /admin/analytics/revenue
Revenue analytics.

### GET /admin/analytics/enrollments
Enrollment analytics.

### GET /admin/support-tickets
List support tickets.

### PUT /admin/support-tickets/:id
Update ticket status.

---

## Notification Endpoints

### GET /notifications
Get user notifications.

### PUT /notifications/:id/read
Mark as read.

### PUT /notifications/read-all
Mark all as read.

### DELETE /notifications/:id
Delete notification.

---

## Upload Endpoints

### POST /upload/signature
Get Cloudinary upload signature (signed upload).

### POST /upload/s3-presigned
Get S3 presigned URL.

---

## Health Endpoints

### GET /health
Service health check.
```json
Response: { "status": "ok", "timestamp": "ISO", "version": "1.0.0" }
```
