import Link from 'next/link'
import AuthHeader from '@/components/AuthHeader'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 p-6">
      <AuthHeader />
      <div className="max-w-2xl mx-auto pt-20">
        <h1 className="text-5xl font-bold text-white text-center mb-4">
          🏋️ Workout Timer
        </h1>
        <p className="text-purple-200 text-center mb-12">
          Select your workout type to get started
        </p>

        <div className="space-y-4">
          {/* HIIT/Circuit Workouts Card */}
          <Link href="/workouts/circuit">
            <div className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-4xl">⚡</span>
                <h2 className="text-2xl font-bold text-gray-800">
                  HIIT / Circuit Workouts
                </h2>
              </div>
              <p className="text-gray-600">
                High-intensity interval training with levels
              </p>
              <div className="flex gap-2 mt-4">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  Timed
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  3 Levels
                </span>
              </div>
            </div>
          </Link>

          {/* Classic Workouts Card */}
          <Link href="/workouts/classic">
            <div className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-4xl">💪</span>
                <h2 className="text-2xl font-bold text-gray-800">
                  Classic Workouts
                </h2>
              </div>
              <p className="text-gray-600">
                Rep-based or timed exercises
              </p>
              <div className="flex gap-2 mt-4">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  Flexible
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  Self-Paced
                </span>
              </div>
            </div>
          </Link>

          {/* Favorites Card */}
          <Link href="/favorites">
            <div className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-4xl">⭐</span>
                <h2 className="text-2xl font-bold text-gray-800">
                  My Favorites
                </h2>
              </div>
              <p className="text-gray-600">
                Your saved workouts
              </p>
              <div className="flex gap-2 mt-4">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  Quick Access
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}