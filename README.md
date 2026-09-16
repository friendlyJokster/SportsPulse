# SportPulse — Multi-Sport Live Scoring, AI Highlights & Player Stats Platform

A production-ready, low-latency live scoring engine, broadcast graphics suite, and grassroots sports network built with **React 19**, **TypeScript**, **Tailwind CSS**, **Express.js**, **Capacitor Mobile SDK**, and **Google Gemini AI**.

---

## 🌟 Executive Overview & What's New

SportPulse delivers a CricHeroes-grade live scoring experience across 6 major grassroots and professional sports (**Cricket**, **Football**, **Kabaddi**, **Basketball**, **Badminton**, and **Tennis**). It bridges the gap between field-side scoring and digital broadcasting by providing automated AI highlight clips, real-time broadcast overlays, and a persistent athlete statistics database.

### 🆕 Latest Ergonomic & Visual Upgrades:
- **Menu-Based Sport Selection System**:
  - **Sports Hidden & Selected Sport Featured on Top**: Removed cramped horizontal sport selector strips. The active sport is displayed prominently at the top with its icon, name, and match status.
  - **Touch-Friendly Sports Menu Modal**: Users tap the sport button in the header or in Match Central to open a clean modal overlay (`SportSelectorModal.tsx`) showing sport details, scoring format rules, active match counts, and instant switching.
- **Eye-Friendly, Low-Fatigue Theming (No Green/Black Strain)**:
  - Defaulted to **Sapphire & Cobalt**—a soothing, glare-resistant palette of royal blue, soft slate ink, and porcelain white that eliminates neon green and harsh black eye strain.
  - Added 5 new refined color combinations: **Sapphire & Cobalt**, **Warm Sand & Terracotta**, **Nordic Slate & Sky**, **Amethyst & Lavender**, and **Graphite & Warm Gold**.
- **Spacious, Less Compact Layout**:
  - Replaced cramped mobile chip carousels with airy, well-padded cards, balanced negative space, and generous 44px+ touch targets.
- **Dynamic Typography Engine**: 5 selectable Google Fonts (**Plus Jakarta Sans** [default], **Lexend** [anti-strain], **Outfit**, **Manrope**, and **Space Grotesk**) configurable on-the-fly from the User Preferences menu.
- **User Preferences Modal**: Accessible from the top navbar and athlete profile for selecting themes, switching fonts, toggling tactile haptic feedback with a live test trigger, and setting sound preferences.
- **Mobile Device & Native App Readiness (Android & iOS)**: Complete Capacitor integration, horizontal swipe gestures (`useSwipeNavigation`) between tabs, offline scoring queue with automatic background sync, and edge-to-edge safe area navigation.

---

## 🎨 Eye-Friendly Theming & Softer Color Schemes

To solve visual fatigue and move away from aggressive green-and-black contrast, SportPulse provides carefully formulated color combinations designed for extended scoring sessions under both direct sunlight and floodlit night games:

| Theme | Canvas | Accent Color | Character & Visual Ergonomics |
| :--- | :--- | :--- | :--- |
| **Sapphire & Cobalt (Default)** | Porcelain (`#F8FAFC`) | Royal Cobalt (`#2563EB`) | **Primary recommendation**: Clean, high-contrast porcelain background with eye-friendly cobalt blue accents, warm amber alerts, and soft slate ink. Zero green/black fatigue. |
| **Warm Sand & Terracotta** | Linen (`#FDFBF7`) | Terracotta Clay (`#C85A32`) | Warm, non-reflective parchment canvas with earthy terracotta clay accents and espresso text. The lowest eye strain for bright outdoor scoring. |
| **Nordic Slate & Sky** | Steel Slate (`#151D2A`) | Glacier Sky (`#38BDF8`) | Deep soothing midnight steel navy with soft glacier blue highlights. Eliminates dark-mode glare and halation. |
| **Amethyst & Lavender** | Cloud White (`#FAF7FD`) | Royal Violet (`#6366F1`) | Cloud white canvas with royal violet buttons and lavender indicators. Modern, refined, and distinct from typical sports apps. |
| **Graphite & Warm Gold** | Soft Charcoal (`#181C24`) | Amber Gold (`#F59E0B`) | Mellow graphite dark mode with warm amber-gold action keys and soft pearl text. Free of stark pitch-black and harsh neon greens. |
| **Pure Light** | White (`#FFFFFF`) | Royal Blue (`#2563EB`) | High-contrast white canvas with crisp typography. |
| **Calm Paper** | Warm Sand (`#FBF8F3`) | Espresso & Stone (`#2D2926`) | Neutral bookish paper tone for maximum reading comfort. |
| **Nordic Dark** | Arctic Navy (`#171E28`) | Glacier Sky (`#0284C7`) | Balanced contrast for evening floodlit matches. |
| **OLED Stealth** | Absolute Black (`#000000`) | Sky Blue (`#38BDF8`) | 0% battery drain on AMOLED screens for day-long tournaments. |

---

## 🧭 Menu-Based Sport Selection

In response to feedback regarding visual clutter and compact horizontal chip carousels, SportPulse hides secondary sports by default and organizes sport switching into an intuitive menu system:

1. **Top Header Display**: The active sport is cleanly anchored on the top navigation bar with its icon, name, and a downward chevron indicating it is interactive.
2. **Match Central Banner**: Match Central displays a dedicated sport banner featuring the current sport's icon, title, active fixture counts, and a "Switch Sport" button.
3. **Sports Selector Modal (`SportSelectorModal.tsx`)**:
   - Tapping the sport button opens a modal displaying all 6 supported sports (Cricket, Football, Kabaddi, Basketball, Badminton, Tennis).
   - Each card displays the sport's icon, scoring metric type, balls/period format, and currently active matches.
   - Selecting a sport instantly updates the scoring console, fixture list, and active game clocks, then gracefully closes the menu.

---

## 🔤 Dynamic Typography Engine

SportPulse allows users to choose their preferred typography to suit their readability preferences:

1. **Plus Jakarta Sans (Default)**: Modern, refined geometric sans-serif engineered specifically for digital dashboards and live sport metrics.
2. **Lexend**: Scientifically proven by educational research to reduce visual stress, prevent eye fatigue, and significantly improve reading speed on rapid ball-by-ball keypads.
3. **Outfit**: Friendly, open geometric typeface with high x-height for effortless glanceability on mobile screens.
4. **Manrope**: Semi-geometric grotesk balancing technical precision with modern executive sports journalism aesthetics.
5. **Space Grotesk**: Monospace-adjacent display proportions designed for television broadcast tickers and scoreboard clocks.

All fonts are dynamically injected via Google Fonts in `/index.html` and persisted across sessions using both `localStorage` and `@capacitor/preferences`.

---

## ⚙️ User Preferences Menu

The new **User Preferences** modal can be opened from:
- **Top Navigation Bar**: The Sliders icon (`btn-open-user-preferences`) next to the theme toggle.
- **Account & Athlete Portal**: The "Display & Typography" action button (`btn-portal-open-preferences`).

### Configurable Preferences:
- **Theme Selection**: Interactive cards with live color previews and contrast badges.
- **Typography Engine**: Font selector with real-time preview of player names and ball scores.
- **Hardware Haptic Feedback**: Toggle vibration feedback on scoring keypad presses, with an interactive "Test Haptic Feedback" button.
- **Audio Effects**: Toggle sound effects for raid buzzers, referee whistles, and boundary alerts.
- **Reset to Defaults**: One-click restore returning to Pure Light theme, Plus Jakarta Sans font, and enabled haptics.

---

## 📱 Mobile Device & App Readiness

### Is this ready to run on mobile devices as a native app?
**Yes.** SportPulse is fully optimized for mobile devices as a Progressive Web App (PWA) and as compiled native Android & iOS apps via Capacitor.

### Mobile-Ready Architectural Features:
1. **Horizontal Swipe-to-Navigate Gestures**:
   - Scorers can swipe left or right with one thumb between **Home**, **Matches**, and **Live Scoring**.
   - Includes an interactive swipe indicator bar with visual dot indicators.
2. **Hardware Haptic Feedback**:
   - Integrated with `@capacitor/haptics`.
   - Subtle tactile tap on every run, boundary, or raid point; heavy vibration on wickets, goals, and fouls.
3. **Offline Scoring Queue & Auto-Sync**:
   - In remote sporting grounds with patchy cellular coverage, balls and scores are queued locally in persistent storage (`sportpulse_offline_scoring_queue_v1`).
   - The app listens for connectivity events (`window.addEventListener('online')`) and flushes queued events automatically upon reconnection.
4. **Ergonomic Bottom Navigation (`MobileBottomNav.tsx`)**:
   - Touch targets sized to 48px+ with safe area insets for gesture bars on Android 12+ and iOS.
5. **Mobile AI Clip Studio**:
   - Supports 9:16 portrait reel mode with native Web Share API integration to post highlights directly to WhatsApp groups, Instagram Reels, and YouTube Shorts.
6. **Battery Preservation**:
   - The OLED Stealth theme runs in true pure black (`#000000`), shutting off pixels on AMOLED screens to extend phone battery life across entire tournament days.

---

## 🚀 Key Modules & Capabilities

### 1. Multi-Sport Live Scoring Engine
- **Cricket Ball-by-Ball Keypad**: Rapid scoring pad with quick buttons for `0`, `1`, `2`, `3`, `4`, `6`, `W` (Wicket), `Wd` (Wide), `Nb` (No Ball), `B` (Bye), and `Lb` (Leg Bye).
- **Strike & Bowler Management**: Automatic striker/non-striker strike rotation on odd runs, end-of-over switchovers, and bowler spell limit enforcement.
- **Football (Soccer)**: Clock management with stoppage time, goals, assists, yellow/red cards, substitutions, and half-time whistle.
- **Kabaddi**: Active 30-second raid countdown timer, bonus points, touch points, super tackles, and do-or-die raid tracking.
- **Basketball**: 4-quarter period management, 24-second shot clocks, 1/2/3-point increments, team fouls, and free throws.
- **Badminton & Tennis**: Game and set point tracking, service rotation, tie-breaks, and change-of-ends counters.
- **Live Clock Simulation**: Real-time incrementing clock with pause/resume and low-latency network telemetry (~95–130ms).

### 2. AI Highlights & Auto-Commentary Studio
- **Event-Triggered Clipping**: Automatically triggers video highlights whenever major match events occur (4s, 6s, wickets, goals, super raids, match-point winners).
- **Interactive Broadcast Canvas HUD**:
  - Live broadcast scorebug with team flags and real-time score.
  - Lower-third animated ticker with player bio and strike rate.
  - Field radar & ball trajectory visualizer.
  - Slow-motion replay toggle and sponsor branding overlay.
- **Gemini AI Commentary**: Server-side integration with Google Gemini 2.5 Flash via `@google/genai` generating play-by-play calls, tactical analysis, broadcast headlines, and social clip titles. Includes offline heuristic fallbacks when an API key is not configured.
- **Floating Toast Notification**: Pops up on any scoring screen when an AI highlight is generated, enabling one-click jump directly to the Replay Studio.

### 3. Persistent Player Stats Storage Hub
- **Local & Cloud-Ready Storage**: Persistent athlete statistics stored in browser local storage (`sportpulse_player_stats_v2`) with synchronization across tabs.
- **Comprehensive Player Registry**: Tracks player role (Batsman, Bowler, All-Rounder, Raider, Goalkeeper, Point Guard), matches, runs, highest scores, strike rates, wickets, economy, and boundary counts (4s & 6s).
- **Registration & Edit Modal**: Create or update athlete records with custom teams, jersey numbers, and batting/bowling styles.
- **Data Export & Backup**: One-click JSON backup export and CSV export, with instant import and restore support.
- **Replay Deep-Linking**: "Watch AI Clip" buttons on player cards jump directly into the Highlight Studio loaded with that athlete's moments.

### 4. Tournament & Match Scheduler
- Dynamic match creation with custom team names, venue, overs/period configuration, and umpire/scorer assignments.
- Tournament organizer supporting Knockout, Round Robin, and Group League fixtures.

### 5. Role-Based Access Control (RBAC)
- Preset demo accounts:
  - **Official Scorer**: Full permission to edit live scores, undo balls, and manage bowlers.
  - **Tournament Admin**: Full administrative authority across matches and tournament brackets.
  - **Active Player**: Ability to manage personal profile, registered stats, and bio.
  - **Fan / Spectator**: Read-only access with interactive cheer reactions and live commentary view.

### 6. Design System & Accessibility
- **Light Theme Default**: Crisp white background (`#ffffff`), subtle borders (`#e2e8f0`), soft shadows, and clean slate typography.
- **Dark Mode Support**: One-click theme toggle stored in persistent user preferences.
- **Refined Typography**: Professional typography using **Plus Jakarta Sans** and **JetBrains Mono** for tabular numbers, avoiding exaggerated bold weights or neon clichés.
- **Mobile-First Ergonomics**: Sticky bottom navigation bar on mobile devices and one-thumb accessible scoring keypads.

---

## 🛠️ Architecture & Tech Stack

```
sportpulse/
├── server.ts              # Express backend with Vite SSR/middleware & Gemini AI proxy
├── src/
│   ├── components/        # Modally extracted UI components
│   │   ├── Navbar.tsx                   # Top navigation, sport selector, theme toggle
│   │   ├── MobileBottomNav.tsx          # Mobile sticky bottom tab bar
│   │   ├── LiveScoringEngine.tsx        # Multi-sport live scoring board & keypad
│   │   ├── AIHighlightStudio.tsx        # Interactive broadcast HUD & AI commentary
│   │   ├── PlayerStatsHub.tsx           # Player stats registry, search, CSV/JSON export
│   │   ├── CreateMatchOrTournamentModal.tsx  # Match & tournament creation
│   │   ├── AuthModal.tsx                # Role-based login and user switching
│   │   └── AthleteProCard.tsx           # Digital player identity card
│   ├── engine/            # Scoring rules and strike calculation strategies
│   ├── types/             # TypeScript definitions (sport, match, playerStats, auth)
│   ├── utils/             # Storage management (playerStatsStorage.ts)
│   ├── data/              # Default seed matches, tournaments, and rosters
│   ├── App.tsx            # Main application router and state coordinator
│   ├── main.tsx           # React DOM root mounting
│   └── index.css          # Tailwind CSS global styles and theme overrides
├── package.json           # Dependencies and build scripts
└── metadata.json          # Platform metadata
```

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React
- **Backend**: Node.js, Express, `tsx` (dev runtime), `esbuild` (production bundler)
- **AI**: `@google/genai` (Gemini 2.5 Flash) with fallback rule-based heuristics
- **Build System**: Vite 6, standalone CommonJS production bundle (`dist/server.cjs`)

---

## 🔌 API Endpoints

### 1. `GET /api/health`
Returns system status, server version, and Gemini AI configuration status.
```json
{
  "status": "ok",
  "engine": "OmniScore Core Engine v2.4",
  "geminiConfigured": true,
  "timestamp": "2026-09-14T09:16:15.335Z"
}
```

### 2. `POST /api/ai/commentary`
Generates professional live commentary, headlines, and tactical analysis for an event.
- **Request Body**:
  ```json
  {
    "sport": "Cricket",
    "eventType": "SIX",
    "player": "Aarav Sharma",
    "team": "Shivaji Park Lions",
    "matchTime": "14.2 Overs",
    "score": "142/3",
    "context": "Chasing 178 in Final"
  }
  ```
- **Response**:
  ```json
  {
    "source": "gemini",
    "data": {
      "headline": "MASSIVE SIX: AARAV SHARMA CLEARS THE STANDS!",
      "commentary": "High, handsome, and out of the park! Aarav Sharma launches that delivery into the deep midwicket pavilion.",
      "tacticalAnalysis": "Picked the slower variation early and maintained excellent head balance through contact.",
      "highlightClipTitle": "🏏 HUGE SIX! Aarav Sharma deposits it over midwicket #GrassrootsCricket"
    }
  }
  ```

### 3. `POST /api/ai/moderate`
Analyzes locker room and community comments for sportsmanlike language.

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js 20+
- npm 10+

### 2. Installation
```bash
git clone https://github.com/friendlyJokster/SportsPulse.git
cd SportsPulse
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and optionally set your Google Gemini API key:
```bash
cp .env.example .env
```
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If no API key is provided, the application automatically uses smart built-in heuristic commentary engines).*

### 4. Running Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 📋 Master Redevelopment Prompt (AI Blueprint)

> Use the following master prompt to redevelop or duplicate this application from scratch using any AI coding assistant:

```markdown
Build a comprehensive, production-grade grassroots sports live scoring and AI highlights platform named "SportPulse" using React 19, TypeScript, Tailwind CSS, an Express.js backend with Vite middleware, and Google Gemini AI integration (@google/genai).

### 1. Visual Aesthetics & Design System
- Provide a clean, modern default Light Theme with a crisp white background (#ffffff), subtle light borders (#e2e8f0), soft elevation shadows, and slate typography (text-slate-800).
- Include an accessible Dark Mode toggle that switches the canvas to a dark slate background (#020617) with slate-800 card surfaces.
- Use 'Plus Jakarta Sans' as the primary font family with balanced weights (regular 400, medium 500, semibold 600) and 'JetBrains Mono' for tabular sports stats and timers. Avoid exaggerated ultra-bold weights (no font-extrabold/font-black) and avoid neon gradient clichés.
- Mobile-first layout: Include a responsive header navbar for desktop and a sticky bottom navigation bar for mobile screens (<768px).

### 2. Multi-Sport Live Scoring Engine (Tab: Live Scoring Engine)
Support 6 sports with distinct scoring rules and dynamic scoreboards:
1. Cricket:
   - Ball-by-ball fast scoring keypad: 0, 1, 2, 3, 4, 6, W (Wicket), Wd (Wide), Nb (No Ball), Bye (B), Leg-Bye (Lb).
   - Real-time strike rotation: Automatically switch striker and non-striker on odd runs (1, 3) and at the end of each completed over.
   - Live bowler spell tracking: Track current bowler, overs bowled, maidens, runs conceded, and wickets. Include an option to select a new bowler every 6 legal balls.
   - Batting scorecard: Track runs, balls faced, 4s, 6s, and strike rate for on-strike and off-strike batsmen.
   - Undo last ball capability to correct scoring mistakes.
2. Football (Soccer): Goal scoring with scorer/assist selector, yellow/red bookings, substitutions, and match period tracking.
3. Kabaddi: 30-second countdown raid timer with buzzer sound/visual cue, touch points, bonus points, super tackles, and do-or-die raid counter.
4. Basketball: 4 quarters, 24-second shot clock, 1/2/3-point increments, team fouls, and timeout management.
5. Badminton & Tennis: Set and game scores, tie-break rules, and service rotation.
6. Real-Time Match Clock: Active clock incrementing live with play/pause controls, alongside an interactive latency indicator (~95-125ms).

### 3. Automated AI Highlights & Broadcast Studio (Tab: AI Clips & Highlights)
- Automatic Event Trigger: When an umpire or scorer enters a 4, 6, Wicket, Goal, Super Raid, or Game Point, automatically clip the event and display a floating animated toast notification with a direct "Launch Replay Player" button.
- Broadcast Video HUD Simulation:
  - Canvas-based player displaying high-energy court/pitch animation with realistic ball trajectory and player radar.
  - Television broadcast scorebug overlay with real-time score, tournament watermark, and sponsor badge.
  - Lower-third graphic banner showing athlete headshot, stats, and animated replay badge.
  - Video scrubber, play/pause, slow-motion (0.5x, 1x, 2x), and camera angle selector.
- Server-Side Gemini AI Integration:
  - Express endpoint `POST /api/ai/commentary` that accepts sport, event, player, team, time, and score.
  - Prompts Gemini 2.5 Flash (`@google/genai`) to generate a punchy 4-8 word broadcast headline, energetic 2-sentence play-by-play commentary, 1-sentence tactical analysis, and social media clip title.
  - Provide a complete offline heuristic fallback that generates realistic, context-specific commentary if the Gemini API key is not configured.

### 4. Persistent Player Statistics Storage Hub (Tab: Player Stats Storage)
- Storage & Persistence: Store all player statistics records in browser localStorage (key: `sportpulse_player_stats_v2`) and synchronize across browser tabs.
- Filter & Search: Search by player name, filter by sport, team, or player role (Batsman, Bowler, All-Rounder, Goalkeeper, Raider, Point Guard).
- Performance Highlights: Display top run scorer, leading wicket taker, total runs stored, and total wickets stored across the league.
- Player Cards: Render stats cards showing matches, runs, highest score, strike rate, 4s/6s, wickets, and economy.
- Action Modal: "Register Player" modal to add new athletes with custom name, team, sport, jersey number, and batting/bowling styles.
- Export & Import: Download full player statistics as JSON backup or CSV spreadsheet, and allow uploading JSON backup to restore or merge data.
- Deep Link to Replay: Provide a "Watch AI Clip" button on every player card that immediately opens the AI Highlight Studio with that player's featured moment.

### 5. Match & Tournament Management Modal
- Modal allowing creation of a new Match with custom teams, sport picker, venue, overs/duration, and umpire name.
- Modal tab to create a new Tournament (Knockout, Round Robin, League) with automated seed match generator.

### 6. Role-Based Authentication & Permissions
- Demo account switcher supporting:
  - Official Scorer: Can score, undo, and change bowlers.
  - Tournament Admin: Full access to create matches and manage tournaments.
  - Active Player: Profile viewing and personal statistics management.
  - Fan / Spectator: Read-only access with live cheer reactions.

### 7. Server & Build Architecture
- Express server (`server.ts`) hosting API routes at `/api/*` and serving Vite middleware in development.
- Production build using `vite build` and `esbuild server.ts --bundle --platform=node --format=cjs --outfile=dist/server.cjs`.
- Clean error handling and zero console crashes when third-party keys are missing.

---

## 📱 Mobile Native Experience (Android & iOS Integration)

SportPulse has been upgraded into a mobile-first Android and iOS application designed for field-side scorers, umpires, and tournament broadcasters.

### 🌟 Native Mobile Features Implemented:
1. **Ergonomic Bottom Navigation (`MobileBottomNav.tsx`)**:
   - 5 primary touch destinations: **Home**, **Matches**, **Live Score**, **AI Clips**, and **Stats**.
   - Floating quick-action center button with haptic feedback for instant match/tournament creation.
   - Safe-area inset support (`env(safe-area-inset-bottom)`) for edge-to-edge Android 12+ and iOS Home Indicator bars.

2. **Native Hardware Haptics**:
   - Single-tap feedback (`ImpactStyle.Light`) on every run scored, ball delivered, and strike rotated.
   - Warning haptics (`NotificationType.Warning`) on wickets, fouls, red cards, and match completion.
   - Long-press haptics on instant undo.

3. **Resilient Offline Scoring & Sync Queue**:
   - When scorers lose internet connection at remote grounds, all score changes and ball events are queued locally via Capacitor Preferences / durable storage (`sportpulse_offline_scoring_queue_v1`).
   - The app automatically detects connectivity restoration and synchronizes the scoring queue to the backend.

4. **Native Mobile Push / Local Notifications**:
   - Triggers native Android & iOS notifications on landmark events (centuries, hat-tricks, match finishes).

5. **AI Highlight Reel Mode (9:16 Portrait) & Native Sharing**:
   - Portrait 9:16 canvas preview optimized for mobile devices.
   - Native iOS & Android Share Sheet integration for sharing highlights directly to **WhatsApp**, **Instagram Reels**, and other social platforms.
   - Double-tap seek gestures (rewind / fast-forward 5 seconds).

6. **Broadcast Presentation Mode (`BroadcastModeModal.tsx`)**:
   - Dedicated full-screen live scorebug display for casting or field-side TV screens.

### 📦 Android APK & Play Store Build Steps

```bash
# 1. Install Capacitor Android dependencies
npm install @capacitor/android

# 2. Build the production web bundle
npm run build

# 3. Add Android platform (first-time only)
npx cap add android

# 4. Sync web assets and plugins to Android project
npx cap sync android

# 5. Open in Android Studio to build APK or AAB
npx cap open android

# 6. Build Debug APK directly via Gradle
cd android && ./gradlew assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

### 🍎 iOS App & App Store Build Steps

#### Prerequisites (iOS Development):
- **macOS** (Required for building iOS apps with Xcode)
- **Xcode 15+** installed via Mac App Store
- **CocoaPods** installed (`sudo gem install cocoapods` or `brew install cocoapods`)
- **Apple Developer Account** (Required for device testing, TestFlight, and App Store submission)

#### Build Steps:

```bash
# 1. Install Capacitor iOS dependencies
npm install @capacitor/ios

# 2. Build the production web bundle
npm run build

# 3. Add iOS platform (first-time only)
npx cap add ios

# 4. Sync web assets and plugins to iOS project
npx cap sync ios

# 5. Open in Xcode
npx cap open ios

# 6. Build Debug binary via CLI (macOS with Xcode Command Line Tools)
xcodebuild -workspace ios/App/App.xcworkspace -scheme App -configuration Debug -sdk iphonesimulator
# Output: ios/App/build/Release-iphonesimulator/App.app
```

#### Xcode Archiving & App Store / TestFlight Deployment:
1. In Xcode, select the root **App** project and select your **Signing Team** under *Signing & Capabilities*.
2. Select target device **Any iOS Device (arm64)** from the top device toolbar.
3. Go to **Product > Archive**.
4. Once the archive completes, click **Distribute App** in the Organizer window to upload to **TestFlight** or export an **IPA** file.


