'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if user has seen the onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
    if (!hasSeenOnboarding) {
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem('hasSeenOnboarding', 'true')
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-3xl shadow-2xl max-w-md w-full border border-purple-500/30">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-purple-500/20">
          <div className="text-center">
            <div className="text-6xl mb-4">🏋️</div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome to Workout Timer!</h2>
            <p className="text-purple-200">Get started with these quick tips</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Tip 1: Install PWA */}
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">📱</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">Install as App</h3>
              <p className="text-sm text-purple-200">
                <span className="font-medium">iOS:</span> Safari → Share → Add to Home Screen<br />
                <span className="font-medium">Android:</span> Chrome → Menu → Install app
              </p>
            </div>
          </div>

          {/* Tip 2: Voice Guidance */}
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔊</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">Voice Guidance</h3>
              <p className="text-sm text-purple-200">
                Workouts include voice announcements for exercises and countdowns. Toggle with 🔊/🔇 button.
              </p>
            </div>
          </div>

          {/* Tip 3: Screen Wake Lock */}
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">☀️</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">Screen Stays On</h3>
              <p className="text-sm text-purple-200">
                Your screen won't dim or lock during workouts - focus on your exercise!
              </p>
            </div>
          </div>

          {/* Tip 4: Help */}
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">💡</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">Need Help?</h3>
              <p className="text-sm text-purple-200">
                Tap the Help icon in the bottom navigation for detailed instructions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4">
          <button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Got it, Let's Go! 💪
          </button>
          <Link href="/help" onClick={handleClose}>
            <p className="text-center text-purple-300 text-sm mt-3 hover:text-purple-200 transition-colors">
              View Full Instructions →
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
