import Link from 'next/link'
import OnboardingModal from '@/components/OnboardingModal'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 flex flex-col">
      <OnboardingModal />
      {/* App Header - Minimal */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            🏋️ Workouts
          </h1>
          <div className="flex items-center gap-2">
            <Link href="/help" className="p-2 rounded-full hover:bg-white/10 transition-all">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
            <Link href="/login" className="p-2 rounded-full hover:bg-white/10 transition-all">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content - Full Screen */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-6 space-y-6 max-w-2xl mx-auto w-full">

        {/* Instruction Text */}
        <div className="text-center">
          <p className="text-2xl text-white font-bold">
            Select your workout type to get started
          </p>
        </div>

        <div className="flex flex-col gap-1">
          {/* HIIT/Circuit Workouts Card */}
          <Link href="/workouts/circuit">
            <div className="bg-gray-800/80 rounded-lg p-8 shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 cursor-pointer backdrop-blur-sm [-webkit-tap-highlight-color:transparent]">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-4xl">⚡</span>
                <h2 className="text-2xl font-bold text-white">
                  HIIT / Circuit Workouts
                </h2>
              </div>
              <p className="text-gray-100">
                High-intensity interval training with levels
              </p>
              <div className="flex gap-2 mt-4">
                <span className="text-purple-200 text-sm">
                  Timed
                </span>
                <span className="text-purple-200 text-sm">
                  • 3 Levels
                </span>
              </div>
            </div>
          </Link>

          {/* Classic Workouts Card */}
          <Link href="/workouts/classic">
            <div className="bg-gray-800/80 rounded-lg p-8 shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 cursor-pointer backdrop-blur-sm [-webkit-tap-highlight-color:transparent]">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-4xl">💪</span>
                <h2 className="text-2xl font-bold text-white">
                  Classic Workouts
                </h2>
              </div>
              <p className="text-gray-100">
                Rep-based or timed exercises
              </p>
              <div className="flex gap-2 mt-4">
                <span className="text-purple-200 text-sm">
                  Flexible
                </span>
                <span className="text-purple-200 text-sm">
                  • Self-Paced
                </span>
              </div>
            </div>
          </Link>

          {/* Favorites Card */}
          <Link href="/favorites">
            <div className="bg-gray-800/80 rounded-lg p-8 shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 cursor-pointer backdrop-blur-sm [-webkit-tap-highlight-color:transparent]">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-4xl">⭐</span>
                <h2 className="text-2xl font-bold text-white">
                  My Favorites
                </h2>
              </div>
              <p className="text-gray-100">
                Your saved workouts
              </p>
              <div className="flex gap-2 mt-4">
                <span className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm [-webkit-tap-highlight-color:transparent]">
                  Quick Access
                </span>
              </div>
            </div>
          </Link>
        </div>
        </div>
      </div>
    </div>
  )
}