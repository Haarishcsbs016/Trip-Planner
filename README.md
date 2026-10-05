# 🌿 WanderWise — AI-Powered Eco Travel Planning Platform

> Plan smarter. Travel greener. Explore deeper.

WanderWise is a full-stack AI travel planning application that generates personalized, weather-aware, budget-optimized day-by-day itineraries tailored to your travel style.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- OpenAI API key

### 1. Clone and Install

```bash
# Install all dependencies
cd client && npm install
cd ../server && npm install
```

### 2. Configure Environment Variables

**Backend** (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/tripplanner
JWT_SECRET=your_super_secret_jwt_key
OPENAI_API_KEY=sk-...
GOOGLE_MAPS_API_KEY=       # Optional — enables real places & maps
OPENWEATHER_API_KEY=       # Optional — enables real weather
CLIENT_URL=http://localhost:5173
```

**Frontend** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=   # Optional
```

### 3. Run Development

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health check**: http://localhost:5000/health

---

## 🏗️ Architecture

```
┌──────────────┐    REST API    ┌──────────────────┐
│  React + Vite │ ────────────► │  Express.js API   │
│  Tailwind CSS │               └────────┬─────────┘
│  Zustand      │                        │
│  TanStack Q   │         ┌──────────────┼──────────────┐
└──────────────┘          ▼              ▼              ▼
                    Auth Service   Trip Service    AI Service
                                         │
                    ┌────────────────────┼──────────────────┐
                    ▼                   ▼                   ▼
              OpenAI API         Google Maps API    OpenWeather API
                    │
                    ▼
              MongoDB Atlas
```

---

## 📁 Project Structure

```
Trip planner/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TripCard.jsx
│   │   │   ├── DayCard.jsx
│   │   │   ├── BudgetCard.jsx
│   │   │   └── LoadingScreen.jsx
│   │   ├── pages/              # Route pages
│   │   │   ├── Landing.jsx     # Marketing landing page
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateTrip.jsx  # 7-step wizard
│   │   │   ├── TripDetails.jsx # Full itinerary view
│   │   │   ├── MyTrips.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── SharedTrip.jsx  # Public shared view
│   │   ├── services/api.js     # Axios API layer
│   │   ├── store/tripStore.js  # Zustand state
│   │   └── index.css           # Design system
│   └── .env
│
└── server/                     # Node.js + Express Backend
    ├── src/
    │   ├── config/             # DB & env config
    │   ├── controllers/        # Route handlers
    │   ├── models/             # Mongoose schemas
    │   ├── routes/             # Express routers
    │   ├── services/           # Business logic
    │   │   ├── aiService.js    # OpenAI integration
    │   │   ├── mapsService.js  # Google Maps/Places
    │   │   ├── weatherService.js
    │   │   ├── budgetService.js
    │   │   └── itineraryService.js  # Orchestrator
    │   ├── middleware/         # Auth, error, validation
    │   └── utils/              # JWT, logger, validators
    └── .env
```

---

## 🤖 AI Trip Planning Flow

```
User Input → Backend Validation
         → Fetch Places (Google Places API)
         → Fetch Weather (OpenWeather API)
         → Calculate Budget
         → Build Structured Prompt
         → OpenAI GPT-4o-mini
         → Parse & Validate JSON
         → Save to MongoDB
         → Return to Frontend
```

The AI receives **real contextual data** — it never invents ratings, prices, or weather.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Current user |
| POST | `/api/trips` | Create trip draft |
| GET | `/api/trips` | List user trips |
| GET | `/api/trips/:id` | Get trip details |
| POST | `/api/trips/:id/generate` | AI generate itinerary |
| POST | `/api/trips/:id/regenerate` | AI modify itinerary |
| POST | `/api/trips/:id/share` | Create share link |
| PUT | `/api/trips/:id/save` | Save/unsave trip |
| GET | `/api/shared/:shareId` | Public shared trip |

---

## ⚡ Features

### Phase 1 — Core ✅
- [x] Auth (register, login, JWT)
- [x] 7-step trip creation wizard
- [x] AI itinerary generation (OpenAI GPT-4o-mini)
- [x] Day-by-day timeline view
- [x] Budget calculation & tracking
- [x] Save, share, and delete trips
- [x] PDF export (jsPDF)
- [x] AI regeneration with instructions

### Phase 2 — Smart Travel (API Keys Required)
- [x] Google Places integration (with fallback)
- [x] OpenWeather integration (with fallback)
- [x] Weather-aware planning
- [x] Geo-optimized routing

### Phase 3 — Planned
- [ ] Google Maps interactive map
- [ ] Collaborative trip planning
- [ ] Expense tracking
- [ ] AI travel chat assistant

---

## 🔒 Security

- Passwords hashed with bcryptjs (12 rounds)
- JWT authentication (7-day expiry)
- Rate limiting on all API routes
- Helmet.js security headers
- API keys never exposed to frontend
- CORS configured for specific origins

---

## 🚀 Deployment

**Frontend → Vercel**
```bash
cd client && npm run build
# Deploy dist/ to Vercel, set VITE_API_URL to your backend URL
```

**Backend → Render**
```
Set environment variables in Render dashboard
Deploy server/ directory, start command: node src/server.js
```

**Database → MongoDB Atlas**
```
Use the SRV connection string as MONGODB_URI
```

---

## 🌿 Made with love for Earth's explorers

© 2026 WanderWise
