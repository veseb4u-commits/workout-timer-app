# Integration Guide for onveseb.com

## Overview
This guide shows you how to link the Workout Timer app from your main website (onveseb.com).

## Recommended Setup: Subdomain

### 1. Deploy the Workout App
1. Push this repo to GitHub
2. Deploy to Vercel
3. Add custom domain: `workout.onveseb.com`

### 2. DNS Configuration
In your domain registrar (where you manage onveseb.com), add:

```
Type: CNAME
Name: workout
Value: cname.vercel-dns.com
TTL: 3600
```

### 3. Vercel Custom Domain Setup
1. Go to your Vercel project → Settings → Domains
2. Add domain: `workout.onveseb.com`
3. Wait for DNS propagation (~5-10 minutes)

### 4. Update Supabase Settings
In Supabase project → Authentication → URL Configuration:
- **Site URL**: `https://workout.onveseb.com`
- **Redirect URLs**: Add `https://workout.onveseb.com/auth/callback`

## Integration on Your Main Site

### Option A: Hero Section with Call-to-Action

```html
<!-- Add this section to your landing page -->
<section class="workout-timer-cta">
  <div class="container">
    <div class="content">
      <span class="icon">🏋️</span>
      <h2>New: Workout Timer App</h2>
      <p>Voice-guided HIIT workouts with progress tracking. Works offline!</p>

      <div class="buttons">
        <!-- Direct play link -->
        <a href="https://workout.onveseb.com" class="btn-primary">
          <span>▶️</span> Play Now
        </a>

        <!-- Install page link -->
        <a href="https://workout.onveseb.com/install" class="btn-secondary">
          <span>📲</span> Install App
        </a>
      </div>
    </div>
  </div>
</section>

<style>
.workout-timer-cta {
  background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
  padding: 60px 20px;
  text-align: center;
  color: white;
}

.workout-timer-cta .icon {
  font-size: 64px;
  display: block;
  margin-bottom: 20px;
}

.workout-timer-cta h2 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  font-weight: bold;
}

.workout-timer-cta p {
  font-size: 1.25rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

.workout-timer-cta .buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.workout-timer-cta .btn-primary,
.workout-timer-cta .btn-secondary {
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 12px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.workout-timer-cta .btn-primary {
  background: white;
  color: #7c3aed;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.workout-timer-cta .btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.workout-timer-cta .btn-secondary {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 2px solid white;
}

.workout-timer-cta .btn-secondary:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-2px);
}
</style>
```

### Option B: Card in Projects/Apps Section

```html
<!-- Add this to your projects or apps section -->
<div class="app-card">
  <div class="app-icon">🏋️</div>
  <h3>Workout Timer</h3>
  <p>Voice-guided workout timer with HIIT programs, progress tracking, and offline support.</p>

  <div class="features">
    <span class="tag">PWA</span>
    <span class="tag">Voice Guided</span>
    <span class="tag">Offline</span>
  </div>

  <div class="app-actions">
    <a href="https://workout.onveseb.com" class="btn-play">
      ▶️ Play
    </a>
    <a href="https://workout.onveseb.com/install" class="btn-install">
      📲 Install
    </a>
  </div>
</div>

<style>
.app-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.app-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(124, 58, 237, 0.3);
}

.app-card .app-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.app-card h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #1f2937;
}

.app-card p {
  color: #6b7280;
  margin-bottom: 15px;
  line-height: 1.6;
}

.app-card .features {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.app-card .tag {
  background: #ede9fe;
  color: #7c3aed;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.app-card .app-actions {
  display: flex;
  gap: 10px;
}

.app-card .btn-play,
.app-card .btn-install {
  flex: 1;
  padding: 12px 20px;
  border-radius: 8px;
  text-align: center;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.app-card .btn-play {
  background: #7c3aed;
  color: white;
}

.app-card .btn-play:hover {
  background: #6d28d9;
}

.app-card .btn-install {
  background: #f3f4f6;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.app-card .btn-install:hover {
  background: #e5e7eb;
}
</style>
```

### Option C: Simple Navigation Link

```html
<!-- Add to your main navigation -->
<nav>
  <a href="https://onveseb.com">Home</a>
  <a href="https://onveseb.com/about">About</a>
  <a href="https://onveseb.com/projects">Projects</a>
  <a href="https://workout.onveseb.com">🏋️ Workout Timer</a>
</nav>
```

## User Journey

### Journey 1: Quick Play
1. User sees "Play Now" button on onveseb.com
2. Clicks → Goes to `workout.onveseb.com`
3. Sees workout homepage
4. Selects workout type and starts immediately

### Journey 2: Install App
1. User sees "Install App" button on onveseb.com
2. Clicks → Goes to `workout.onveseb.com/install`
3. Sees installation instructions with benefits
4. Can either:
   - Install as PWA (if supported)
   - Or click "Play Now" to use in browser

## Testing Checklist

After deployment:

- [ ] Visit `workout.onveseb.com` - should load the app
- [ ] Visit `workout.onveseb.com/install` - should show install page
- [ ] Test "Add to Home Screen" on mobile
- [ ] Test desktop PWA install (Chrome address bar icon)
- [ ] Verify authentication works with new domain
- [ ] Test offline functionality after installation
- [ ] Check that links from onveseb.com work correctly

## Analytics (Optional)

To track usage from your main site, add UTM parameters:

```html
<a href="https://workout.onveseb.com?utm_source=onveseb&utm_medium=homepage&utm_campaign=launch">
  Play Now
</a>
```

Then set up Google Analytics or Vercel Analytics on the workout app.

## Troubleshooting

### PWA Install Not Showing
- Ensure you're on HTTPS (Vercel provides this automatically)
- Check browser console for manifest errors
- PWA requires production build (not dev mode)
- Some browsers require the site to be visited 2+ times

### Authentication Issues
- Verify redirect URLs in Supabase include the new domain
- Check that environment variables are set in Vercel
- Test magic link emails arrive correctly

### DNS Not Resolving
- DNS propagation can take up to 48 hours (usually 5-10 minutes)
- Use `dig workout.onveseb.com` to check DNS status
- Verify CNAME record is correctly set in domain registrar
