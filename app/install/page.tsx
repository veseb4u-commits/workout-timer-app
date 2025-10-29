'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setIsInstalled(true)
    }

    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 p-6">
      <div className="max-w-3xl mx-auto pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl mb-4">🏋️</h1>
          <h1 className="text-5xl font-bold text-white mb-4">Workout Timer</h1>
          <p className="text-xl text-purple-200">
            Voice-guided workouts with progress tracking
          </p>
        </div>

        {/* Already Installed */}
        {isInstalled && (
          <div className="bg-green-500 text-white rounded-2xl p-8 mb-6 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-2xl font-bold mb-2">App Installed!</h2>
            <p className="mb-4">You can now use Workout Timer from your home screen</p>
            <Link href="/">
              <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-green-50">
                Start Workout
              </button>
            </Link>
          </div>
        )}

        {/* Main Options */}
        {!isInstalled && (
          <div className="space-y-6">
            {/* Install Option */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">📲</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Install as App
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Get the full experience with offline access, home screen icon, and app-like feel
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-4">
                    <li>✓ Works offline after first visit</li>
                    <li>✓ Add to home screen</li>
                    <li>✓ No app store needed</li>
                    <li>✓ Auto-updates</li>
                    <li>✓ Full-screen mode</li>
                  </ul>
                </div>
              </div>

              {isInstallable ? (
                <button
                  onClick={handleInstallClick}
                  className="w-full bg-purple-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors"
                >
                  Install Now
                </button>
              ) : (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-800 mb-3">
                    <strong>To install on your device:</strong>
                  </p>
                  <div className="text-sm text-purple-700 space-y-2">
                    <p><strong>Chrome/Edge (Desktop):</strong> Click the install icon in the address bar</p>
                    <p><strong>Safari (iOS):</strong> Tap Share → Add to Home Screen</p>
                    <p><strong>Chrome (Android):</strong> Tap menu (⋮) → Add to Home screen</p>
                  </div>
                </div>
              )}
            </div>

            {/* Play in Browser Option */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">🌐</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Play in Browser
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Try it out instantly without installing anything
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-4">
                    <li>✓ No installation required</li>
                    <li>✓ Works on any device</li>
                    <li>✓ Full features available</li>
                    <li>✓ Save favorites & history (with login)</li>
                  </ul>
                </div>
              </div>

              <Link href="/">
                <button className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors">
                  Play Now
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">Features</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold mb-2">🎯 HIIT & Circuit Workouts</h4>
              <p className="text-sm text-purple-200">Timed exercises with 3 difficulty levels</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">💪 Classic Workouts</h4>
              <p className="text-sm text-purple-200">Rep-based or timed exercises</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">🔊 Voice Guidance</h4>
              <p className="text-sm text-purple-200">Countdown announcements for hands-free workouts</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">📊 Progress Tracking</h4>
              <p className="text-sm text-purple-200">History, streaks, and favorite workouts</p>
            </div>
          </div>
        </div>

        {/* Back to main site link */}
        <div className="text-center mt-8">
          <a
            href="https://onveseb.com"
            className="text-purple-200 hover:text-white transition-colors"
          >
            ← Back to onveseb.com
          </a>
        </div>
      </div>
    </div>
  )
}
