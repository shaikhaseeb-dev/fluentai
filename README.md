# FluentAI 🎙️ – Real-Time English Speaking Coach

A production-ready SaaS web application that helps users improve English speaking confidence through AI-powered real-time coaching.

---

## 🚀 Features

| Feature | Free | Pro |
|---|---|---|
| Real-time AI conversation | ✅ (5 min/day) | ✅ Unlimited |
| Live grammar correction | ✅ | ✅ All modes |
| Filler word detection | ✅ | ✅ |
| Session summary report | ✅ | ✅ |
| Progress dashboard | ✅ | ✅ |
| **Stuck Word Assistant** | ❌ | ✅ |
| Detailed analytics | Basic | ✅ Full |
| Weekly email reports | ❌ | ✅ |

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **AI**: OpenAI GPT-4 Turbo (conversation, grammar, summaries)
- **Speech**: Web Speech API (SpeechRecognition + SpeechSynthesis)
- **Auth**: NextAuth.js v5 (Email + Google OAuth)
- **Payments**: Stripe
- **State**: Zustand
- **Charts**: Recharts

---

## 📦 Quick Setup

### 1. Prerequisites

- Node.js 18+
- PostgreSQL database (local or cloud like [Neon](https://neon.tech) / [Supabase](https://supabase.com))
- OpenAI API key
- Google OAuth credentials (optional but recommended)
- Stripe account (for payments)

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Fill in your values in `.env.local`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/fluentai_db"
NEXTAUTH_SECRET="your-random-secret"
OPENAI_API_KEY="sk-..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_PRO_PRICE_ID="price_..."
```

### 4. Set up the database

```bash
# Run migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate

# (Optional) Seed with demo data
npm run db:seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
fluentai/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Demo data seeder
│
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   │
│   │   ├── auth/
│   │   │   └── signin/        # Sign-in page
│   │   │
│   │   ├── dashboard/
│   │   │   ├── layout.tsx     # Dashboard layout (sidebar)
│   │   │   ├── page.tsx       # Dashboard home
│   │   │   ├── session/       # Practice session
│   │   │   ├── progress/      # Progress page
│   │   │   └── settings/      # Settings page
│   │   │
│   │   └── api/
│   │       ├── auth/          # NextAuth handlers
│   │       ├── conversation/  # AI conversation + grammar
│   │       ├── session/       # Session management
│   │       ├── stuck-word/    # Stuck Word Assistant
│   │       ├── improvement-memory/ # Vocabulary tracking
│   │       ├── settings/      # User settings
│   │       ├── dashboard/     # Dashboard data
│   │       └── stripe/        # Stripe checkout + webhooks
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx    # Navigation sidebar
│   │   │   └── Providers.tsx  # NextAuth provider
│   │   │
│   │   ├── session/
│   │   │   ├── SessionInterface.tsx  # Main session UI
│   │   │   ├── CorrectionCard.tsx    # Grammar correction card
│   │   │   ├── StuckWordPanel.tsx    # Stuck word suggestions
│   │   │   ├── FillerCounter.tsx     # Real-time filler count
│   │   │   ├── TranscriptArea.tsx    # Conversation transcript
│   │   │   ├── SessionSummary.tsx    # End session report
│   │   │   └── CorrectionModeSelector.tsx
│   │   │
│   │   └── dashboard/
│   │       ├── DashboardStats.tsx    # Stats cards
│   │       ├── ProgressCharts.tsx    # Recharts line charts
│   │       ├── RecentSessions.tsx    # Sessions list
│   │       └── QuickStart.tsx        # CTA card
│   │
│   ├── hooks/
│   │   ├── useSpeechRecognition.ts  # Web Speech API hook
│   │   ├── useFillerDetection.ts    # Filler word tracking
│   │   └── useAudio.ts              # Text-to-speech hook
│   │
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── openai.ts          # OpenAI client
│   │   ├── auth.ts            # NextAuth config
│   │   └── stripe.ts          # Stripe utilities
│   │
│   ├── store/
│   │   └── sessionStore.ts    # Zustand global state
│   │
│   └── types/
│       └── session.ts         # TypeScript interfaces
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy!

For the database, use [Neon](https://neon.tech) (free PostgreSQL) or [Supabase](https://supabase.com).

### Set up Stripe Webhooks (Production)

```bash
# Install Stripe CLI
stripe listen --forward-to your-domain.com/api/stripe/webhook
```

Add the webhook endpoint in your Stripe dashboard:
- URL: `https://your-domain.com/api/stripe/webhook`
- Events: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`

### Run database migrations in production

```bash
npx prisma migrate deploy
```

---

## 🔧 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://your-domain.com/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`

---

## 🎨 Customization

### Correction Mode Prompts
Edit `src/app/api/conversation/route.ts` to customize grammar detection behavior.

### AI Personality
Edit the `SYSTEM_PROMPT` in `src/app/api/conversation/route.ts` to change how the AI coach speaks.

### Color Theme
Edit `tailwind.config.js` — the color tokens `primary`, `accent`, and `surface` control the entire UI.

### Filler Words
Edit `FILLER_PATTERNS` in `src/hooks/useFillerDetection.ts` to add/remove tracked filler words.

---

## 🧪 Browser Compatibility

Speech recognition works best in:
- ✅ Google Chrome (recommended)
- ✅ Microsoft Edge
- ⚠️ Safari (partial support)
- ❌ Firefox (not supported)

---

## 📄 License

MIT License — feel free to use and customize.

---

Built with ❤️ for English learners everywhere.
