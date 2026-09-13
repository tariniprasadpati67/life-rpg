# LIFE RPG — Cyberpunk Real-Life Gamification Platform

> **"Turn everyday goals into RPG quests. Complete tasks, earn XP, build streaks, and level up your life."**

Life RPG is a hackathon-ready web application designed to banish mundane to-do lists and transform personal productivity into a cyberpunk RPG. It features non-linear leveling curves, daily streak tracking, RPG attributes (Intellect, Strength, Discipline, Knowledge), server-validated anti-cheat, synthesized retro-audio sound effects, and Supabase PostgreSQL persistence with Row Level Security.

---

## 🌟 Key Features

### 1. ⚡ Non-Linear XP & Progression Engine
- **Algorithmic Curve**: $requiredXP(level) = \lfloor 100 \times level^{1.5} \rfloor$
- Early levels provide instant gratification; higher tiers demand disciplined consistency.
- Seamless excess XP carryover on every level-up.
- Fullscreen **Level-Up Modal** celebration with particle confetti, sound fanfare, and attribute boost recaps.
- Floating "+XP" upward drift animations over completed quests.

### 2. 🔥 Consecutive Daily Streak Protocol
- Dedicated **Streak Widget** with dynamic flame intensity (Ember → Fire → Golden Inferno → Cosmic Plasma).
- **7-Day Visual Matrix** (MON · TUE · WED · THU · FRI · SAT · SUN) marking daily completed directives.
- Milestone Badges:
  - 🥉 **3 Days** → Bronze Vanguard
  - 🥈 **7 Days** → Silver Sentinel
  - 🥇 **14 Days** → Gold Champion
  - 👑 **30 Days** → Legendary Cyberlord
- Smart same-day deduplication prevents repeated completions from artificially bloating streaks.

### 3. 🧠 Neural Character Attributes
- **Intellect**: Boosted by Coding and Technical Study quests (+XP/10).
- **Strength**: Reinforced through Physical Training and Workouts (+XP/10).
- **Discipline**: Cultivated via Meditation and Mindfulness (+XP/10).
- **Knowledge**: Expanded by Reading books and research (+XP/10).

### 4. 🛡️ Server-Validated Anti-Cheat & Security
- XP rewards are determined and enforced authoritatively on the Express server.
- Supabase PostgreSQL schema with **Row Level Security (RLS)** ensuring users only access their own quests and telemetry.
- **Zero-Friction Fallback**: If Supabase credentials are not provided in `.env`, the app automatically switches to an in-memory/JSON local engine so judges and evaluators can run the entire system instantly with zero configuration!

### 5. 🎵 Native Web Audio Synthesizer
- Built using the browser's native `AudioContext`—no missing MP3 files or CDN latency.
- Generates 8-bit blips, ascending arpeggio completion chimes, and triumphant chord fanfares.
- Includes a global mute/unmute toggle in the HUD.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Audio**: Native Web Audio API Synthesizer
- **Backend**: Node.js, Express.js, CORS, Dotenv
- **Database & Auth**: Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS)

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

*(Optional)* To connect your own Supabase project, set:
```env
PORT=5000
CLIENT_URL=http://localhost:5173

# Supabase Credentials (optional - falls back to local engine if left empty)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 3. Run Development Servers
Launch both the Express API and Vite frontend concurrently with a single command:
```bash
npm run dev
```

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🗄️ Database Setup (Supabase PostgreSQL)

To configure your Supabase database:
1. Create a new project on [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase Dashboard.
3. Paste the contents of `supabase/schema.sql` and run the query.
4. The schema creates:
   - `profiles`: user level, XP, streak, and RPG attributes.
   - `quests`: individual user quests and categories.
   - `quest_completions`: completion telemetry logs.
   - Triggers for automatic profile creation on `auth.users` signup.
   - Complete Row Level Security (RLS) policies.

---

## 📁 Project Structure

```
├── index.html                    # SEO tags, Open Graph, Google Fonts (Orbitron & Outfit)
├── package.json                  # Root scripts & dependencies
├── vite.config.js                # Vite config + proxy to :5000 backend
├── tailwind.config.js            # Cyberpunk color tokens & neon animations
├── supabase/
│   └── schema.sql                # Complete Supabase PostgreSQL schema with RLS
├── server/
│   ├── index.js                  # Express API entrypoint
│   ├── config/supabase.js        # Supabase client connector + fallback
│   ├── middleware/auth.js        # JWT token verification
│   ├── controllers/
│   │   ├── questController.js    # Quests CRUD & server-side XP validation
│   │   ├── progressController.js # Profile, streak calendar, and telemetry
│   │   └── authController.js     # Guest demo access & health status
│   └── utils/progression.js      # Non-linear leveling formula & streak logic
└── src/
    ├── App.jsx                   # Main routing & providers
    ├── index.css                 # Cyberpunk glassmorphism, glow keyframes, scanlines
    ├── lib/
    │   ├── soundEffects.js       # Native Web Audio API synthesizer
    │   ├── xpSystem.js           # XP math & rank titles
    │   └── streakSystem.js       # Streak tiers & 7-day calendar logic
    ├── context/
    │   ├── AuthContext.jsx       # Supabase Auth + Session state
    │   └── GameContext.jsx       # Real-time XP, Quests, Streaks, and Level-up state
    ├── components/
    │   ├── Navbar.jsx            # Cyberpunk HUD header with audio toggle & rank badge
    │   ├── Hero.jsx              # Landing hero with live interactive hologram demo
    │   ├── QuestCard.jsx         # Quest card with category badge, XP, and Complete button
    │   ├── QuestModal.jsx        # Create/Edit quest dialog
    │   ├── XPProgress.jsx        # Holographic animated XP progress bar
    │   ├── StreakPanel.jsx       # 7-day calendar & streak milestones
    │   ├── CharacterStats.jsx    # Intellect, Strength, Discipline, Knowledge HUD
    │   ├── LevelUpModal.jsx      # Celebration modal with confetti & fanfare
    │   └── FloatingXP.jsx        # Floating "+XP" particle animation
    └── pages/
        ├── Home.jsx              # Landing page (SEO optimized)
        ├── Dashboard.jsx         # Gamer command center
        ├── Quests.jsx            # Complete quest log with search & filters
        ├── Progress.jsx          # Character sheet & telemetry history
        ├── Login.jsx             # Cyberpunk login terminal
        └── Signup.jsx            # Account creation terminal
```

---

## 🎮 Evaluation & Judge Demo Mode

For rapid hackathon evaluation without registering an email or configuring Supabase:
1. Navigate to `/login` or `/signup`.
2. Click **"1-CLICK DEMO LOGIN (INSTANT ACCESS)"**.
3. You will immediately be loaded with a Level 3 Cyber Runner profile with active quests, an active streak, and working XP/Level-up interactions!
