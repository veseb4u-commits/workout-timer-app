# 🏋️ Workout Timer

A Progressive Web App (PWA) for voice-guided HIIT and circuit training workouts with progress tracking.

## ✨ Features

- 🎯 **HIIT & Circuit Workouts** - Timed exercises with 3 difficulty levels
- 💪 **Classic Workouts** - Rep-based or timed exercises
- 🔊 **Voice Guidance** - Countdown announcements for hands-free workouts ("Get ready, 5, 4, 3, 2, 1")
- 📊 **Progress Tracking** - History, streaks, and workout statistics
- ⭐ **Favorites System** - Save your favorite workouts
- 🔐 **User Authentication** - Magic link (passwordless) login via Supabase
- 📱 **Progressive Web App** - Install on any device, works offline
- 🎨 **Beautiful UI** - Gradient animations and responsive design

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Supabase Auth (Magic Links)
- **PWA**: @ducanh2912/next-pwa
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

## 🛠️ Installation

1. **Clone and install**
   ```bash
   git clone https://github.com/YOUR_USERNAME/workout-timer-app.git
   cd workout-timer-app
   npm install
   ```

2. **Set up Supabase database** (see [Database Setup](#database-setup) below)

3. **Configure environment**
   ```bash
   cp .env .env.local
   ```

   Edit `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

Run these SQL commands in your Supabase SQL editor:

<details>
<summary>Click to expand SQL setup</summary>

```sql
-- Create user_favorites table
CREATE TABLE user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  workout_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, workout_id)
);

-- Create workout_history table
CREATE TABLE workout_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  workout_id TEXT NOT NULL,
  workout_name TEXT NOT NULL,
  workout_type TEXT NOT NULL,
  level INTEGER,
  rest_duration INTEGER,
  duration_seconds INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_history ENABLE ROW LEVEL SECURITY;

-- Favorites policies
CREATE POLICY "Users can insert own favorites"
ON user_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own favorites"
ON user_favorites FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
ON user_favorites FOR DELETE USING (auth.uid() = user_id);

-- History policies
CREATE POLICY "Users can insert own history"
ON workout_history FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own history"
ON workout_history FOR SELECT USING (auth.uid() = user_id);
```

</details>

## 🚢 Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com) and import your repo
   - Add environment variables in project settings:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Configure Supabase Auth**
   - In Supabase: Authentication → URL Configuration
   - Set **Site URL**: `https://your-app.vercel.app`
   - Add **Redirect URL**: `https://your-app.vercel.app/auth/callback`

4. **Optional: Custom Domain**
   - In Vercel: Settings → Domains
   - Add custom domain (e.g., `workout.onveseb.com`)
   - Update DNS with CNAME record to `cname.vercel-dns.com`

## 📱 PWA Installation

Users can install the app on:
- **Desktop** (Chrome/Edge): Click install icon in address bar
- **iOS** (Safari): Share → Add to Home Screen
- **Android** (Chrome): Menu → Add to Home screen

Visit `/install` page for guided installation instructions.

## 🔗 Integration with Main Website

To link this app from your main website, see **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** for:
- Subdomain setup instructions
- Ready-to-use HTML/CSS code snippets
- User journey examples

## 🔒 Security

Built with security best practices:
- HTTP security headers (X-Frame-Options, CSP, etc.)
- Rate limiting on authentication endpoints
- Row Level Security (RLS) on all database tables
- Input validation and error handling
- Environment variable protection

See **[SECURITY.md](SECURITY.md)** for complete security documentation.

## 📂 Project Structure

```
workout-timer-app/
├── app/                      # Next.js App Router pages
│   ├── auth/                # Auth callback
│   ├── favorites/           # User favorites
│   ├── history/             # Workout history & stats
│   ├── install/             # PWA install instructions
│   ├── login/               # Magic link login
│   ├── play/                # Workout player
│   └── workouts/            # Workout selection
├── components/              # React components
│   ├── AuthHeader.tsx       # Navigation with auth state
│   ├── WorkoutDetailClient.tsx
│   └── WorkoutPlayer.tsx    # Main workout timer
├── lib/                     # Utilities & config
│   ├── auth-context.tsx     # Auth provider
│   ├── supabase.ts          # Supabase client
│   └── workouts.ts          # Workout data
├── public/                  # Static assets
│   ├── manifest.json        # PWA manifest
│   └── icon.svg             # App icon
├── middleware.ts            # Rate limiting
└── next.config.ts           # Next.js & PWA config
```

## 🏋️ Available Workouts

### HIIT / Circuit Workouts
- **Full Body Blast** (9 exercises)
- **Core Crusher** (6 exercises)
- **Cardio Burn** (8 exercises)

**Difficulty Levels:**
- Level 1: 30s work / 15s rest
- Level 2: 45s work / 15s rest
- Level 3: 60s work / 20s rest

### Classic Workouts
- Push Day
- Pull Day
- Leg Day
- Full Body

Rep-based with customizable rest periods.

## 📜 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🗺️ Roadmap

- [ ] Custom workout builder
- [ ] Exercise library with demo videos
- [ ] Social features (share workouts)
- [ ] Apple Health / Google Fit integration
- [ ] Multi-day workout programs
- [ ] Dark mode theme
- [ ] Internationalization (i18n)

## 📄 License

MIT License

## 🙏 Support

For questions or issues:
- Open an issue on GitHub
- Visit [onveseb.com](https://onveseb.com)

---

Built with ❤️ using Next.js and Supabase
