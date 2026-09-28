# OpsAgent — AI Employee for Small Businesses

> **By CRESCONIX** · Premium SaaS Platform

OpsAgent is a production-grade AI-powered SaaS application that acts as an AI employee for small businesses, automatically handling lead follow-up, invoicing, appointment reminders, and customer re-engagement.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Lead Qualification** | Classifies leads as HOT/WARM/COLD using intent signals and budget/timeline extraction |
| 💬 **Smart Follow-Ups** | AI drafts and sends grounded follow-ups based on your knowledge base |
| 🧾 **Invoice Automation** | Create, send, and track invoices with auto follow-up sequences |
| 📅 **Appointment Reminders** | Automated reminders + no-show re-engagement |
| 🌐 **Embeddable Widget** | One-script website chat widget powered by your knowledge base |
| 📊 **Analytics Dashboard** | Revenue, lead, and activity analytics with charts |
| 📱 **PWA (Mobile App)** | Installable as a native-like mobile app via PWA |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Install dependencies

```bash
cd my-app
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in `/my-app`:

```env
# AI Provider (choose one)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Database (production)
DATABASE_URL=postgresql://user:password@localhost:5432/opsagent
# Or use a free cloud Postgres (Supabase / Neon):
# DATABASE_URL=postgresql://...@db.supabase.co:5432/postgres

# JWT Auth (production)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key

# Email (production)
RESEND_API_KEY=re_...
# Or use Nodemailer SMTP:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your-app-password

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Demo login

Use any email + any password (6+ characters).  
Pre-filled: `owner@apexconsulting.com` / `demo1234`

---

## 📁 Project Structure

```
my-app/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page (marketing)
│   ├── login/page.tsx            # Login page
│   ├── signup/page.tsx           # Signup (2-step)
│   ├── pricing/page.tsx          # Pricing comparison
│   ├── offline/page.tsx          # PWA offline fallback
│   ├── dashboard/
│   │   ├── layout.tsx            # Dashboard layout (auth guard)
│   │   ├── page.tsx              # Dashboard home (metrics + charts)
│   │   ├── leads/page.tsx        # Lead management + conversation view
│   │   ├── invoices/page.tsx     # Invoice CRUD + detail view
│   │   ├── appointments/page.tsx # Calendar + appointment management
│   │   ├── knowledge/page.tsx    # KB entries + AI preview
│   │   ├── notifications/page.tsx# Notification feed
│   │   └── settings/page.tsx     # Business, AI, billing settings
│   └── api/v1/
│       ├── auth/login/route.ts   # POST /api/v1/auth/login
│       ├── leads/route.ts        # GET + POST /api/v1/leads
│       ├── invoices/route.ts     # GET + POST /api/v1/invoices
│       └── agent/route.ts        # POST /api/v1/agent (AI brain)
├── components/
│   ├── ui/
│   │   ├── Button.tsx            # Button variants
│   │   ├── Card.tsx              # Card, MetricCard, Badge, Avatar, etc.
│   │   └── Input.tsx             # Input, Textarea
│   └── layout/
│       └── Sidebar.tsx           # Collapsible sidebar + mobile drawer
├── lib/
│   ├── types.ts                  # TypeScript interfaces
│   ├── mock-data.ts              # Realistic sample data
│   ├── utils.ts                  # Formatting utilities
│   └── store.ts                  # Zustand auth store
└── public/
    ├── manifest.json             # PWA manifest
    └── sw.js                     # Service worker
```

---

## 🧠 AI Agent Architecture

```
Incoming message (widget or dashboard)
        ↓
[1] RAG Retrieval
    └── Query knowledge base (pgvector cosine similarity in prod)
    └── Retrieve top-3 relevant entries
        ↓
[2] Intent Classification
    └── general_question | lead_inquiry | pricing_inquiry | appointment_request | invoice_request
        ↓
[3] Signal Extraction
    └── Budget signals ($X, Xk), Timeline signals (urgent, Q1, etc.)
        ↓
[4] Lead Scoring (0-100)
    └── HOT ≥70 | WARM ≥45 | COLD <45
        ↓
[5] Response Generation
    └── Grounded in KB (never hallucinate pricing)
    └── LLM call: OpenAI GPT-4o / Anthropic Claude (provider-swappable)
        ↓
[6] Action Taking (Tools)
    └── Schedule appointment → POST /api/v1/appointments
    └── Create invoice     → POST /api/v1/invoices
    └── Update lead status → PATCH /api/v1/leads/:id
    └── Notify owner       → POST /api/v1/notifications
        ↓
[7] Log & Update Dashboard
    └── Save to conversations table
    └── Update priority items feed
```

---

## 🗄️ Database Schema (Prisma)

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String
  passwordHash String
  role         Role     @default(MEMBER)
  business     Business @relation(fields: [businessId], references: [id])
  businessId   String
  createdAt    DateTime @default(now())
}

model Business {
  id              String              @id @default(cuid())
  name            String
  industry        String
  email           String
  plan            PlanType            @default(FREE)
  aiPersonaName   String              @default("Alex")
  leads           Lead[]
  conversations   Conversation[]
  invoices        Invoice[]
  appointments    Appointment[]
  knowledgeBase   KnowledgeBaseEntry[]
}

model Lead {
  id          String     @id @default(cuid())
  name        String
  email       String
  status      LeadStatus @default(COLD)
  score       Int        @default(0)
  budget      Float?
  timeline    String?
  createdAt   DateTime   @default(now())
  deletedAt   DateTime?  // soft delete
}

enum LeadStatus    { HOT WARM COLD }
enum InvoiceStatus { DRAFT SENT VIEWED OVERDUE PAID }
enum AppointmentStatus { CONFIRMED PENDING CANCELLED NO_SHOW }
```

---

## 🌐 API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/auth/login` | Authenticate, return JWT |
| POST | `/api/v1/auth/register` | Create account |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| GET | `/api/v1/leads` | List leads (filter by status) |
| POST | `/api/v1/leads` | Create lead |
| PATCH | `/api/v1/leads/:id` | Update lead status |
| GET | `/api/v1/invoices` | List invoices + summary |
| POST | `/api/v1/invoices` | Create invoice |
| PATCH | `/api/v1/invoices/:id/send` | Send invoice email |
| GET | `/api/v1/appointments` | List appointments |
| POST | `/api/v1/appointments` | Create appointment |
| GET | `/api/v1/knowledge-base` | List KB entries |
| POST | `/api/v1/knowledge-base` | Add KB entry |
| POST | `/api/v1/agent` | AI agent (widget calls this) |

---

## 📱 PWA Setup

The app is configured as a Progressive Web App:

1. **manifest.json** — App name, icons, theme, shortcuts
2. **sw.js** — Service worker with network-first caching strategy
3. **Offline page** — `/offline` shown when no network
4. **Install prompt** — Handled in the layout

To test locally: serve with HTTPS or use Chrome DevTools PWA inspector.

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
# Connect your repo to Vercel, set env vars, deploy automatically
vercel deploy
```

### Backend API (embedded in Next.js App Router)
API routes under `/app/api/` deploy with the Next.js app on Vercel.

For a separate Node.js/Express backend:
```bash
# Railway / Render deployment
npm run build && npm start
```

### Database (Supabase Free Tier)
```bash
# Run Prisma migrations
npx prisma migrate deploy
npx prisma db seed
```

---

## 🔧 Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | For AI | OpenAI API key for GPT-4o |
| `ANTHROPIC_API_KEY` | Optional | Anthropic Claude API key |
| `DATABASE_URL` | Production | PostgreSQL connection string |
| `JWT_SECRET` | Production | JWT signing secret (min 32 chars) |
| `RESEND_API_KEY` | Production | For email delivery (Resend) |
| `NEXT_PUBLIC_APP_URL` | Yes | App base URL |

---

## 🔒 Security

- Passwords hashed with **bcrypt** (cost factor 12)
- **JWT** access tokens (15min) + refresh tokens (7 days)
- **Rate limiting** on public `/agent` endpoint
- **Input validation** with Zod on all API routes
- **Row-level security** — businesses can only see their own data
- HTTPS enforced in production

---

## 📈 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 · React 19 · TypeScript |
| Styling | Tailwind CSS 4 · Custom CSS Design System |
| Animation | Framer Motion |
| State | Zustand (persisted) |
| Charts | Recharts |
| Backend API | Next.js App Router API Routes |
| Database | PostgreSQL + Prisma ORM |
| AI | OpenAI GPT-4o / Anthropic Claude |
| RAG | pgvector / Chroma |
| Auth | JWT + bcrypt |
| Email | Resend / Nodemailer |
| PWA | next-pwa + Service Worker |
| Deploy | Vercel (frontend) + Supabase (DB) |

---

## 📞 Support

- **Documentation**: [docs.opsagent.ai](https://docs.opsagent.ai)
- **Email**: support@cresconix.com
- **GitHub Issues**: Open an issue for bugs or features

---

*Built with ❤️ by CRESCONIX · © 2026 All rights reserved*
