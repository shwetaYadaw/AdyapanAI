# ADYAPAN — Complete Architecture Documentation
**Version:** 1.0.0

---

## 1. Backend Architecture

### System Architecture Overview
```
                    ┌─────────────────────────────────────────────────────┐
                    │                   CLIENT LAYER                       │
                    │   React Web (Vercel)    React Native (Expo)          │
                    └─────────────────────────────┬───────────────────────┘
                                                  │ HTTPS/REST
                    ┌─────────────────────────────▼───────────────────────┐
                    │              API GATEWAY / Load Balancer             │
                    │            (Nginx / Railway / Render)                │
                    └─────────────────────────────┬───────────────────────┘
                                                  │
              ┌───────────────────────────────────┼──────────────────────┐
              │                                   │                       │
    ┌─────────▼─────────┐             ┌───────────▼───────┐   ┌──────────▼──────────┐
    │   Backend API      │             │   AI Microservice │   │  Background Workers  │
    │ Node.js+Express    │             │  Python FastAPI   │   │   (Bull Queues)      │
    │   Port: 5000       │◄────────────┤    Port: 8000     │   │                      │
    └────────┬──────────┘             └─────────┬─────────┘   └──────────┬───────────┘
             │                                  │                        │
    ┌────────▼──────────┐             ┌─────────▼─────────┐   ┌──────────▼───────────┐
    │   MongoDB Atlas    │             │  FAISS/Chroma DB  │   │    Redis Cache        │
    │   (Primary DB)    │             │  (Vector Store)   │   │    (Session/Cache)    │
    └───────────────────┘             └───────────────────┘   └──────────────────────┘
             │
    ┌────────▼──────────┐
    │  Cloudinary/S3    │
    │  (File Storage)   │
    └───────────────────┘
```

### Backend Service Architecture (Clean Architecture Pattern)
```
HTTP Request
    │
    ▼
Routes (Express Router)
    │
    ▼
Middleware Stack:
  1. CORS
  2. Helmet
  3. Rate Limiter
  4. Request Logger
  5. Auth Middleware (JWT verification)
  6. RBAC Middleware (Role check)
  7. Validation Middleware (Zod)
    │
    ▼
Controller (Request/Response handling)
    │
    ▼
Service Layer (Business logic)
    │
    ├──► Repository/Model (MongoDB via Mongoose)
    ├──► Cache Service (Redis)
    ├──► AI Service (HTTP to FastAPI)
    ├──► Email Service (Nodemailer/SendGrid)
    └──► Event Emitter (Background jobs)
```

---

## 2. AI Architecture

### AI Microservice Design
```
┌────────────────────────────────────────────────────────────┐
│                   AI Microservice (FastAPI)                 │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Request Router                       │  │
│  └──────────────┬───────────────────────────────────────┘  │
│                 │                                          │
│    ┌────────────┼─────────────────────────────────┐        │
│    │            │                                 │        │
│  ┌─▼──────┐  ┌──▼─────┐  ┌──────────┐  ┌────────▼─────┐  │
│  │  RAG   │  │  LLM   │  │ Whisper  │  │  Embeddings  │  │
│  │Service │  │Service │  │ Service  │  │   Service    │  │
│  └─┬──────┘  └──┬─────┘  └──────────┘  └────────┬─────┘  │
│    │            │                               │        │
│  ┌─▼─────────┐  │  ┌──────────────────┐  ┌─────▼──────┐  │
│  │FAISS/     │  │  │ LangChain Chain  │  │  Sentence  │  │
│  │Chroma     │  └──► (Prompt+Memory)  │  │Transformers│  │
│  │Vector DB  │     └──────────────────┘  └────────────┘  │
│  └───────────┘                                           │
└────────────────────────────────────────────────────────────┘
```

### AI Feature Map
| Feature | Model | Technique |
|---|---|---|
| AI Tutor | LLM (Llama/OpenAI) | RAG + Prompt Engineering |
| Chatbot | LLM | Conversational Chain + Memory |
| PDF Chat | LLM + Embeddings | RAG (Document QA) |
| Notes Generator | LLM | Summarization Chain |
| Quiz Generator | LLM | Structured Output |
| Flashcards | LLM | Structured Output |
| Mind Map | LLM | JSON Structured Output |
| Assignment Evaluator | LLM | Rubric-based Evaluation |
| Resume Analyzer | LLM | Structured Analysis |
| Interview Coach | LLM | Role-play Chain |
| Career Recommendation | LLM + Embeddings | Semantic Similarity |
| Skill Gap Analysis | LLM | Comparison Analysis |
| Study Planner | LLM | Planning Chain |
| Lecture Summarizer | LLM | Summarization |
| Voice Assistant | Whisper + LLM | STT + LLM + TTS |
| OCR | Tesseract/EasyOCR | Computer Vision |
| Translation | LLM / Google Translate API | Translation |
| Speech to Text | Whisper | ASR |
| Text to Speech | gTTS / ElevenLabs | TTS |

---

## 3. Authentication Flow

```
1. EMAIL/PASSWORD REGISTRATION:
   Client → POST /auth/register
   Backend: Hash password (bcrypt 12) → Save user (isEmailVerified:false)
   → Send verification email (JWT token, 24h expiry)
   → Client clicks link → POST /auth/verify-email
   → isEmailVerified = true → Return 200

2. LOGIN:
   Client → POST /auth/login
   Backend: Find user → Compare bcrypt hash
   → Generate accessToken (15min, RS256) + refreshToken (7d, HS256)
   → Store refreshToken hash in Redis
   → Return tokens + user object

3. GOOGLE LOGIN:
   Client → Google OAuth → Get idToken
   → POST /auth/google { idToken }
   Backend: Verify idToken with Google SDK
   → Find/Create user → Generate JWT tokens
   → Return tokens

4. OTP FLOW:
   Client → POST /auth/send-otp { phone }
   Backend: Generate 6-digit OTP → Store in Redis (5min TTL)
   → Send via SMS (Twilio/MSG91)
   Client → POST /auth/verify-otp { phone, otp }
   Backend: Verify OTP from Redis → Delete OTP → Mark phoneVerified

5. TOKEN REFRESH:
   Client → POST /auth/refresh-token { refreshToken }
   Backend: Verify refreshToken → Check Redis → Issue new accessToken
   → Rotate refreshToken (sliding window)

6. PROTECTED ROUTE FLOW:
   Client → Request with Authorization: Bearer <accessToken>
   Middleware: Verify JWT signature + expiry
   → Decode payload → Attach user to req.user
   → RBAC check: req.user.role vs required role
   → Proceed to controller
```

---

## 4. Mobile Architecture

```
React Native (Expo) Architecture:

┌─────────────────────────────────────────────┐
│                  Expo App                    │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │         Expo Router (File-based)     │   │
│  └────────────────┬────────────────────┘   │
│                   │                        │
│  ┌────────────────▼────────────────────┐   │
│  │      Screens / Pages                │   │
│  │  (uses shared hooks + services)     │   │
│  └────────────────┬────────────────────┘   │
│                   │                        │
│  ┌────────────────▼────────────────────┐   │
│  │   Shared Hooks (same as web)        │   │
│  │   useAuth, useCourses, useAI...     │   │
│  └────────────────┬────────────────────┘   │
│                   │                        │
│  ┌────────────────▼────────────────────┐   │
│  │   Shared Services Layer             │   │
│  │   api.ts → Same REST endpoints      │   │
│  └────────────────┬────────────────────┘   │
│                   │                        │
│  ┌────────────────▼────────────────────┐   │
│  │   Redux Store (same reducers)       │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘

Code Sharing Strategy:
├── packages/shared/          # 100% shared
│   ├── types/               # TypeScript types
│   ├── constants/           # API endpoints, roles
│   └── utils/               # Formatters, validators
│
├── apps/web/src/services/    # ~95% portable
└── apps/mobile/services/     # Same logic, same API
    (Minor difference: AsyncStorage vs localStorage)
```

---

## 5. Deployment Architecture

### Production Infrastructure
```
┌──────────────────────────────────────────────────────────────┐
│                     DNS (Cloudflare)                          │
│  adyapan.com → Vercel                                        │
│  api.adyapan.com → Render/Railway                            │
│  ai.adyapan.com → Render/Railway (AI service)               │
└───────────────────────────┬──────────────────────────────────┘
                            │
        ┌───────────────────┼──────────────────┐
        │                   │                  │
┌───────▼──────┐   ┌────────▼───────┐  ┌──────▼──────┐
│   Vercel     │   │    Render      │  │  Render     │
│  (React Web) │   │ (Node Backend) │  │ (FastAPI AI)│
│  CDN + Edge  │   │  Docker        │  │  Docker     │
└──────────────┘   └────────┬───────┘  └─────────────┘
                            │
             ┌──────────────┼──────────────┐
             │              │              │
    ┌────────▼──────┐ ┌─────▼────┐ ┌──────▼──────┐
    │ MongoDB Atlas │ │  Redis   │ │ Cloudinary  │
    │   (M10+)      │ │ (Upstash)│ │   / S3      │
    └───────────────┘ └──────────┘ └─────────────┘

CI/CD Pipeline:
GitHub Push → GitHub Actions:
  1. Lint + Type Check
  2. Unit Tests
  3. Build Docker Image
  4. Push to Registry
  5. Deploy to Render/Vercel
  6. Health Check
  7. Notify on Slack/Discord
```

---

## 6. Security Architecture

```
SECURITY LAYERS:

Layer 1: Network
  ├── HTTPS everywhere (TLS 1.3)
  ├── Cloudflare WAF
  └── DDoS protection

Layer 2: Application
  ├── Helmet.js (security headers)
  ├── CORS whitelist
  ├── Rate limiting (express-rate-limit)
  │   ├── Global: 100 req/15min per IP
  │   ├── Auth: 5 attempts/15min
  │   └── AI: 20 req/min per user
  └── Input sanitization (express-mongo-sanitize)

Layer 3: Authentication
  ├── JWT RS256 (asymmetric)
  ├── Refresh token rotation
  ├── Redis-backed token blacklist
  └── bcrypt (12 rounds) for passwords

Layer 4: Authorization
  ├── RBAC middleware on every route
  ├── Resource ownership checks
  └── Field-level access control

Layer 5: Data
  ├── Mongoose schema validation
  ├── Zod request validation
  ├── PII encryption at rest (AES-256)
  └── Audit log for all write operations

Layer 6: Infrastructure
  ├── MongoDB Atlas VPC peering
  ├── Environment secrets (never in code)
  └── Secrets rotation policy
```

---

## 7. Development Roadmap

### Phase 1 — Foundation (Weeks 1–4)
- Monorepo setup (Turborepo)
- Backend: Auth, User, Course models + APIs
- Frontend: Landing page, Auth pages, Course catalog
- Database schema implementation
- Docker setup

### Phase 2 — Core Learning (Weeks 5–8)
- Course creation workflow (Teacher)
- Video upload + playback (Cloudinary)
- Enrollment + payment (Razorpay/Stripe)
- Student dashboard
- Progress tracking
- Quiz system
- Certificate generation

### Phase 3 — Placement Features (Weeks 9–12)
- Resume Builder + ATS Score
- AI Resume Analyzer
- Mock Interview (AI)
- Aptitude tests
- Job portal (Recruiter)
- Company-wise roadmaps

### Phase 4 — AI Features (Weeks 13–16)
- AI Tutor + Chatbot
- PDF Chat
- Notes/Quiz/Flashcard generator
- Skill Gap Analysis
- Career Recommendation
- Voice Assistant

### Phase 5 — Community & Mobile (Weeks 17–20)
- Discussion Forums
- Study Groups
- Live Classes
- React Native Expo app
- Push notifications
- Mentor booking

### Phase 6 — Polish & Scale (Weeks 21–24)
- Performance optimization
- Analytics dashboard
- Admin CMS
- Dark mode
- Accessibility audit
- Load testing
- Production deployment

---

## 8. Milestones

| Milestone | Target | Deliverable |
|---|---|---|
| M1 | Week 2 | Auth system live, DB schema done |
| M2 | Week 4 | Landing page + Course catalog |
| M3 | Week 6 | Course player + Payments working |
| M4 | Week 8 | Student dashboard + Certificates |
| M5 | Week 10 | Resume Builder + ATS Score |
| M6 | Week 12 | Recruiter portal + Job applications |
| M7 | Week 14 | AI Tutor + Chatbot live |
| M8 | Week 16 | Mock Interview + Quiz Generator |
| M9 | Week 18 | Community features live |
| M10 | Week 20 | Mobile app (Expo) on TestFlight/Play |
| M11 | Week 22 | Admin dashboard complete |
| M12 | Week 24 | Production launch + monitoring |

---

## 9. GitHub Repository Structure

```
GitHub Organization: adyapan-tech

Repositories:
├── adyapan-monorepo          # Main monorepo (this repo)
│   ├── apps/web              # React web app
│   ├── apps/mobile           # Expo mobile app
│   ├── apps/backend          # Node.js API
│   ├── apps/ai-service       # FastAPI AI
│   └── packages/shared       # Shared types/utils
│
├── adyapan-design            # Figma exports, brand assets
└── adyapan-docs              # Developer documentation

Branch Strategy:
├── main          (production)
├── develop       (staging)
├── feature/*     (feature branches)
├── fix/*         (bug fixes)
└── release/*     (release candidates)

PR Rules:
- Required reviewers: 1
- All tests must pass
- No direct push to main/develop
- Squash merge preferred

GitHub Actions:
├── .github/workflows/ci-web.yml
├── .github/workflows/ci-backend.yml
├── .github/workflows/ci-ai.yml
├── .github/workflows/deploy-staging.yml
└── .github/workflows/deploy-production.yml
```
