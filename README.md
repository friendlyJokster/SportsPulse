# SportPulse — Multi-Sport Live Scoring & Tournament Network

A real-time, low-latency scoring engine and grassroots sports tournament platform built with React 19, TypeScript, Tailwind CSS, Express, and Google Gemini AI.

---

## Features

### 1. Multi-Sport Live Scoring Engine
- **Cricket**: Ball-by-ball scoring keypad (runs, wickets, extras like Wd/Nb/B/Lb), strike-rotation logic, bowler spell counters, run-rate tracking, and live commentary.
- **Football (Soccer)**: Clock management with extra time, goals, assists, yellow/red bookings, substitutions, and half-time intervals.
- **Kabaddi**: Raid timers (30-second countdowns), bonus points, touch points, super tackles, and do-or-die raid tracking.
- **Badminton & Tennis**: Game and set points, service rotations, tie-breaks, and change-of-ends counters.
- **Basketball**: Quarter periods, shot clocks, 1/2/3-point buckets, team fouls, and free throws.

### 2. AI Highlights & Auto-Commentary
- **Automated Match Highlights**: Server-side Gemini API generates play-by-play commentary, highlight packages, and momentum shifts.
- **Broadcast Simulator**: Real-time scorebug overlays, lower-third tickers, and latency telemetry.

### 3. Tournament & Match Management
- Bracket creation, fixtures scheduling, and table standings.
- Support for league tables, group stages, and knockout formats.
- Umpire and official scorer roles with administrative overrides.

### 4. Athlete Pro-Cards & Verified Stats
- Digital athlete cards showcasing season averages, strike rates, win percentages, and recent form.
- Direct video highlight reel attachments and badge achievements.

### 5. Community & Grassroots Ecosystem
- **Locker Room Feed**: Live match discussions, verified player posts, photo updates, and fan reactions.
- **"Looking For" Marketplace**: Connects local teams, coaches, umpires, and players needing substitute or squad recruitment.
- **Micro-Monetization & PPV**: Digital pass ticketing and tournament sponsorship tiers.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Motion, Lucide Icons
- **Backend**: Express.js with custom Vite middleware for development and standalone CommonJS bundle for production
- **AI Integration**: Google GenAI SDK (`@google/genai`) for automated commentary and highlight analysis
- **Build Tooling**: Vite 6, esbuild, TypeScript

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### Installation
```bash
# Clone repository
git clone <repo-url>
cd <repo-folder>

# Install dependencies
npm install
```

### Environment Variables
Copy `.env.example` to `.env` and provide your Gemini API key:
```bash
cp .env.example .env
```

| Variable | Description | Required |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API key for automated commentary and highlights | Optional (smart fallbacks provided) |

### Running the App
```bash
# Start development server
npm run dev

# App will be accessible at http://localhost:3000
```

### Building for Production
```bash
# Build frontend and bundle server
npm run build

# Start production server
npm run start
```

---

## Project Structure

```
├── server.ts              # Express backend & Gemini API proxy
├── src/
│   ├── components/        # UI modules (Scoring, Highlights, Marketplace, Portal, etc.)
│   ├── engine/            # Multi-sport scoring strategies & game rules
│   ├── types/             # TypeScript definitions for sports, matches, users, and events
│   ├── data/              # Default seed tournaments, matches, and rosters
│   ├── App.tsx            # Main application container & router
│   ├── main.tsx           # React DOM entry point
│   └── index.css          # Tailwind CSS global stylesheet
├── package.json           # Dependencies and build scripts
└── metadata.json          # Platform metadata and permissions
```
