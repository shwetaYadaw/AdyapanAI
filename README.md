# ADYAPAN — AI-Powered Career Development Ecosystem

> **ady. ADYAPAN** — From Learning to Placement.

ADYAPAN is a production-ready, full-stack EdTech platform that helps students become placement-ready for top MNCs while also preparing learners for Sales, Marketing, HR, Finance, and other non-technical careers.

---

## Architecture Overview

```
adyapan/
├── apps/
│   ├── web/           React 18 + TypeScript + Tailwind CSS + Framer Motion
│   ├── mobile/        React Native (Expo) — shares API & business logic with web
│   ├── backend/       Node.js + Express + TypeScript REST API
│   └── ai-service/    Python FastAPI — LangChain, FAISS, OpenAI/Llama
└── packages/
    └── shared/        TypeScript types, constants, utils — used by all apps
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Web Frontend | React 18, TypeScript, Tailwind CSS, Framer Motion, Redux Toolkit, React Query |
| Mobile | React Native (Expo), Expo Router, Shared API layer |
| Backend | Node.js 20, Express.js, TypeScript, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT (RS256), Google OAuth, OTP, Email Verification |
| Storage | Cloudinary / AWS S3 |
| Payments | Razorpay (India) + Stripe (International) |
| AI Service | Python FastAPI, LangChain, FAISS/Chroma, OpenAI/Llama, Whisper, OCR |
| Cache | Redis (Upstash in production) |
| Deployment | Vercel (web), Render/Railway (backend + AI), MongoDB Atlas, Docker |
| CI/CD | GitHub Actions |

---

## Prerequisites

- **Node.js** >= 20.0.0
- **Yarn** >= 1.22.0
- **Python** >= 3.11 (for AI service)
- **Docker** (optional, for containerized dev)
- **MongoDB Atlas** account
- **Redis** (local or Upstash)

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/adyapan-tech/adyapan-monorepo.git
cd adyapan-monorepo
```

### 2. Install all dependencies

```bash
yarn install
```

### 3. Configure environment variables

```bash
# Backend
cp apps/backend/.env.example apps/backend/.env

# Web
cp apps/web/.env.example apps/web/.env

# AI Service
cp apps/ai-service/.env.example apps/ai-service/.env
```

Fill in the values in each `.env` file. The required keys are documented in each `.env.example`.

### 4. Set up AI Service (Python)

```bash
cd apps/ai-service
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 5. Start all services (development)

Open four terminals:

**Terminal 1 — Backend:**
```bash
yarn dev:backend
```

**Terminal 2 — AI Service:**
```bash
cd apps/ai-service
uvicorn app.main:app --reload --port 8000
```

**Terminal 3 — Web:**
```bash
yarn dev:web
```

**Terminal 4 — Mobile (optional):**
```bash
yarn dev:mobile
```

### 6. Access the apps

| App | URL |
|---|---|
| Web | http://localhost:3000 |
| Backend API | http://localhost:5000/api/v1 |
| AI Service | http://localhost:8000/docs |
| Backend Health | http://localhost:5000/api/v1/health |

---

## Docker (Full Stack)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all
docker-compose down
```

---

## Environment Variables Reference

### Backend (`apps/backend/.env`)

| Variable | Description | Required |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ |
| `JWT_ACCESS_SECRET` | JWT access token secret (min 32 chars) | ✅ |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | ✅ |
| `JWT_EMAIL_SECRET` | Email verification token secret | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ✅ |
| `SMTP_USER` | Email SMTP username | ✅ |
| `SMTP_PASS` | Email SMTP password/app key | ✅ |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ |
| `RAZORPAY_KEY_ID` | Razorpay key ID | ✅ |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret | ✅ |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook secret | ✅ |
| `STRIPE_SECRET_KEY` | Stripe secret key | ✅ |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | ✅ |
| `AI_SERVICE_API_KEY` | Internal key for AI service | ✅ |
| `CERTIFICATE_SECRET` | Secret for certificate signing | ✅ |
| `REDIS_URL` | Redis connection URL | Optional |

### AI Service (`apps/ai-service/.env`)

| Variable | Description | Required |
|---|---|---|
| `OPENAI_API_KEY` | OpenAI API key | ✅ (or use LOCAL_LLM) |
| `OPENAI_MODEL` | Model name (default: gpt-4o-mini) | Optional |
| `USE_LOCAL_LLM` | Use Ollama instead of OpenAI | Optional |
| `OLLAMA_BASE_URL` | Ollama server URL | If local LLM |
| `LOCAL_MODEL` | Local model name (e.g. llama3) | If local LLM |
| `AI_SERVICE_API_KEY` | Must match backend's AI_SERVICE_API_KEY | ✅ |

---

## User Roles

| Role | Access |
|---|---|
| **Student** | Courses, Placement Prep, Resume Builder, Jobs, AI Features, Mentors, Community, Certificates |
| **Teacher** | Create & manage courses, view enrolled students, analytics |
| **Mentor** | Create mentor profile, manage sessions, view mentees |
| **Recruiter** | Post jobs, search candidates, manage applications |
| **Admin** | Manage users, approve courses, payments, analytics, CMS |
| **Super Admin** | All admin capabilities + billing, RBAC, audit logs |

---

## API Documentation

Base URL: `http://localhost:5000/api/v1`

See `.kiro/specs/adyapan-platform/api-documentation.md` for the complete API reference.

Key endpoint groups:
- `POST /auth/*` — Authentication
- `GET/POST /courses` — Course catalog
- `POST /enrollments` — Course enrollment
- `POST /payments/create-order` — Payment flow
- `GET/POST /jobs` — Job portal
- `POST /ai/*` — All AI features
- `GET /certificates/verify/:id` — Public certificate verification

---

## AI Features

All AI features are proxied through the backend to the FastAPI AI service:

| Feature | Endpoint |
|---|---|
| AI Chatbot | `POST /ai/chat` |
| AI Tutor | `POST /ai/tutor` |
| PDF Chat | `POST /ai/pdf-chat` |
| Notes Generator | `POST /ai/generate-notes` |
| Quiz Generator | `POST /ai/generate-quiz` |
| Flashcards | `POST /ai/generate-flashcards` |
| Mind Map | `POST /ai/generate-mindmap` |
| Career Recommendation | `POST /ai/career-recommendation` |
| Skill Gap Analysis | `POST /ai/skill-gap` |
| Study Planner | `POST /ai/study-plan` |
| Resume Analyzer (ATS) | `POST /resume/analyze` |
| Cover Letter Generator | `POST /resume/cover-letter` |
| Mock Interview | `POST /placement/mock-interview/start` |
| OCR | `POST /ai/ocr` |
| Translation | `POST /ai/translate` |
| Speech to Text | `POST /ai/speech-to-text` |
| Text to Speech | `POST /ai/text-to-speech` |
| Assignment Evaluator | `POST /ai/evaluate-assignment` |

---

## Deployment

### Web (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel --prod
```

### Backend (Render)
1. Create a new Web Service on Render
2. Set root directory: `apps/backend`
3. Build command: `yarn install && yarn build`
4. Start command: `node dist/server.js`
5. Add all environment variables from `.env`

### AI Service (Render)
1. Create a new Web Service on Render
2. Set root directory: `apps/ai-service`
3. Build: `pip install -r requirements.txt`
4. Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Mobile (Expo EAS)
```bash
cd apps/mobile

# Install EAS CLI
npm install -g eas-cli

# Configure
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

---

## Project Structure Deep Dive

### Shared Package
`packages/shared/` contains TypeScript types, API endpoint constants, and utility functions shared between the web and mobile apps. This ensures type safety across the entire stack.

### Mobile Code Sharing
The mobile app (`apps/mobile`) reuses:
- All API endpoint constants from `@adyapan/shared`
- Same REST API as the web app — no mobile-specific endpoints
- Same TypeScript types
- Same business logic hooks (useAuth, useCourses, etc.)
- Only the UI layer differs (React Native components vs React DOM)

### Authentication Flow
1. Register → email verification → activate account
2. Login → JWT access token (15 min) + refresh token (7 days)
3. Google OAuth → instant access
4. OTP → phone verification for 2FA
5. Tokens stored in `localStorage` (web) or `SecureStore` (mobile)
6. Auto-refresh via Axios interceptor

### Payment Flow
1. Frontend calls `POST /payments/create-order`
2. Backend creates Razorpay/Stripe order, returns `orderId`
3. Frontend opens payment widget
4. On success, frontend calls `POST /payments/verify` with signature
5. Backend verifies signature cryptographically
6. Enrollment created, confirmation email sent
7. Razorpay webhook as fallback for reliability

---

## Development Milestones

| Milestone | Week | Status |
|---|---|---|
| Auth system + DB schema | 2 | Architecture Complete |
| Landing page + Course catalog | 4 | |
| Course player + Payments | 6 | |
| Student dashboard + Certificates | 8 | |
| Resume Builder + ATS Score | 10 | |
| Recruiter portal | 12 | |
| AI Tutor + Chatbot | 14 | |
| Mock Interview + Quiz Generator | 16 | |
| Community features | 18 | |
| Mobile app (Expo) | 20 | |
| Admin dashboard | 22 | |
| Production launch | 24 | |

---

## Security

- All passwords hashed with **bcrypt** (12 rounds)
- JWT signed with **RS256** (asymmetric)
- **Rate limiting** on all endpoints (100 req/15min global, 5 req/15min auth)
- **Helmet.js** security headers
- **MongoDB injection** prevention via `express-mongo-sanitize`
- **RBAC** on every protected route
- **Audit logs** for all admin actions (TTL: 1 year)
- **Input validation** via Zod schemas on all endpoints
- **Payment signature** cryptographic verification
- **PII encryption** at rest

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m 'feat: add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

Please follow the [PR template](.github/PULL_REQUEST_TEMPLATE.md).

---

## License

Proprietary — ADYAPAN © 2026. All rights reserved.

---

## Support

- 📧 support@adyapan.com
- 🌐 https://adyapan.com
- 📱 Available on Android & iOS

---

<div align="center">
  <strong>Built with ❤️ to make every student placement-ready</strong>
</div>
