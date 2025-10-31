import Link from 'next/link'

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 flex flex-col">
      {/* Native App Header with Back Button */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-all">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-semibold text-white">
            Help & Instructions
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="px-4 py-6 w-full max-w-4xl mx-auto space-y-6">

          {/* Getting Started */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              🚀 Getting Started
            </h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="font-semibold text-white mb-2">1. Choose Your Workout</h3>
                <p className="text-sm">Select from Circuit/HIIT workouts or Classic workouts. Each workout shows the exercises, duration, and difficulty levels.</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">2. Select Level & Rest</h3>
                <p className="text-sm">Pick your difficulty level (1-3) and rest time between sets. Level 1 is easier with fewer sets.</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">3. Start Workout</h3>
                <p className="text-sm">Hit the green "START WORKOUT" button and follow the voice guidance!</p>
              </div>
            </div>
          </div>

          {/* Install as PWA */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              📱 Install as App
            </h2>

            {/* iOS Instructions */}
            <div className="mb-6">
              <h3 className="font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <span className="text-xl"></span> iOS (iPhone/iPad)
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300 ml-2">
                <li>Open this site in <strong className="text-white">Safari</strong> browser</li>
                <li>Tap the <strong className="text-white">Share</strong> button (square with arrow)</li>
                <li>Scroll down and tap <strong className="text-white">"Add to Home Screen"</strong></li>
                <li>Tap <strong className="text-white">"Add"</strong> in the top-right corner</li>
                <li>The app icon will appear on your home screen! 🎉</li>
              </ol>
              <div className="mt-3 p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
                <p className="text-xs text-purple-200">
                  <strong>Note:</strong> For best experience on iOS, use Safari. Firefox and Chrome on iOS don't support PWA features fully.
                </p>
              </div>
            </div>

            {/* Android Instructions */}
            <div>
              <h3 className="font-semibold text-green-300 mb-3 flex items-center gap-2">
                <span className="text-xl">🤖</span> Android
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300 ml-2">
                <li>Open this site in <strong className="text-white">Chrome</strong> browser</li>
                <li>Tap the <strong className="text-white">menu</strong> (three dots) in the top-right</li>
                <li>Tap <strong className="text-white">"Install app"</strong> or <strong className="text-white">"Add to Home screen"</strong></li>
                <li>Confirm by tapping <strong className="text-white">"Install"</strong></li>
                <li>The app icon will appear in your app drawer! 🎉</li>
              </ol>
              <div className="mt-3 p-3 bg-green-900/30 rounded-lg border border-green-500/30">
                <p className="text-xs text-green-200">
                  <strong>Tip:</strong> Chrome may show an install banner automatically. Just tap "Install" when it appears!
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              ✨ Features
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  🔊 Voice Guidance
                </h3>
                <p className="text-sm text-gray-300 mb-2">
                  The app announces exercise names, rep counts, and countdowns during your workout.
                </p>
                <ul className="list-disc list-inside text-sm text-gray-300 ml-4 space-y-1">
                  <li>Toggle voice on/off with the 🔊/🔇 button during workout</li>
                  <li>Countdown for last 5 seconds of timed exercises</li>
                  <li><strong className="text-purple-300">iOS Tip:</strong> If voice doesn't work on first start, tap the screen during "Get Ready" countdown</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  ☀️ Screen Wake Lock
                </h3>
                <p className="text-sm text-gray-300">
                  Your screen automatically stays on during workouts - no need to keep tapping! Works on both iOS and Android.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  ⭐ Favorites
                </h3>
                <p className="text-sm text-gray-300">
                  Tap the star icon on any workout to save it to your Favorites for quick access. Find them in the Favorites tab.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  📊 History
                </h3>
                <p className="text-sm text-gray-300">
                  All completed workouts are automatically saved to your History with duration and level tracked.
                </p>
              </div>
            </div>
          </div>

          {/* Workout Controls */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              🎮 Workout Controls
            </h2>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 bg-purple-600 text-white px-3 py-1 rounded font-medium">⏸️ PAUSE</span>
                <p className="flex-1">Pause the timer and resume when ready</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 bg-orange-600 text-white px-3 py-1 rounded font-medium">⏭️ SKIP</span>
                <p className="flex-1">Skip current exercise or rest period</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 bg-red-600 text-white px-3 py-1 rounded font-medium">❌ QUIT</span>
                <p className="flex-1">Exit workout and return to home</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 bg-gray-600 text-white px-3 py-1 rounded font-medium">✓ NEXT</span>
                <p className="flex-1">For rep-based exercises, tap when you've completed the reps</p>
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              🔧 Troubleshooting
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-purple-300 mb-2">Voice not working on iOS?</h3>
                <ul className="list-disc list-inside text-sm text-gray-300 ml-4 space-y-1">
                  <li>Make sure your phone is not in silent mode</li>
                  <li>Tap the screen during "Get Ready" countdown</li>
                  <li>Check the 🔊 button is enabled (not 🔇)</li>
                  <li>Try pausing and resuming the workout</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-green-300 mb-2">Screen still dims during workout?</h3>
                <ul className="list-disc list-inside text-sm text-gray-300 ml-4 space-y-1">
                  <li>Make sure you've installed as PWA (see instructions above)</li>
                  <li>Check your phone's battery saver mode isn't forcing screen timeout</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-yellow-300 mb-2">App not saving favorites/history?</h3>
                <ul className="list-disc list-inside text-sm text-gray-300 ml-4 space-y-1">
                  <li>You need to log in first (tap profile icon in top-right)</li>
                  <li>Make sure you're not in private/incognito mode</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Recommended Browsers */}
          <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl p-6 shadow-xl border border-purple-500/30">
            <h2 className="text-xl font-bold text-white mb-3">💡 Best Experience</h2>
            <div className="space-y-2 text-sm text-gray-200">
              <p><strong className="text-purple-300">iOS:</strong> Use Safari for full PWA support</p>
              <p><strong className="text-green-300">Android:</strong> Use Chrome for best performance</p>
              <p className="text-xs text-gray-400 mt-3">Other browsers may work but with limited functionality.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-xl border-t border-white/10 pb-safe">
        <div className="flex justify-around items-center py-2">
          <Link href="/" className="flex flex-col items-center py-2 px-6 text-white/60">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link href="/favorites" className="flex flex-col items-center py-2 px-6 text-white/60">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="text-xs font-medium">Favorites</span>
          </Link>
          <Link href="/history" className="flex flex-col items-center py-2 px-6 text-white/60">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs font-medium">History</span>
          </Link>
          <Link href="/help" className="flex flex-col items-center py-2 px-6 text-white">
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium">Help</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
