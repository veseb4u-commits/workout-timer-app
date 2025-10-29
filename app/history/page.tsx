'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import AuthHeader from '@/components/AuthHeader'

type WorkoutHistoryItem = {
  id: string
  workout_name: string
  workout_type: string
  level: number | null
  rest_duration: number
  duration_seconds: number
  completed_at: string
}

type Stats = {
  totalWorkouts: number
  totalTimeMinutes: number
  currentStreak: number
  favoriteType: string
}

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth()
  const [history, setHistory] = useState<WorkoutHistoryItem[]>([])
  const [stats, setStats] = useState<Stats>({
    totalWorkouts: 0,
    totalTimeMinutes: 0,
    currentStreak: 0,
    favoriteType: 'N/A',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHistory = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('workout_history')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error loading history:', error)
      } else {
        setHistory(data || [])
        calculateStats(data || [])
      }

      setLoading(false)
    }

    if (!authLoading) {
      loadHistory()
    }
  }, [user, authLoading])

  const calculateStats = (historyData: WorkoutHistoryItem[]) => {
    const totalWorkouts = historyData.length
    const totalTimeMinutes = Math.floor(
      historyData.reduce((sum, item) => sum + item.duration_seconds, 0) / 60
    )

    // Calculate streak (consecutive days with workouts)
    let currentStreak = 0
    if (historyData.length > 0) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const workoutDates = historyData.map(item => {
        const date = new Date(item.completed_at)
        date.setHours(0, 0, 0, 0)
        return date.getTime()
      })

      const uniqueDates = [...new Set(workoutDates)].sort((a, b) => b - a)

      for (let i = 0; i < uniqueDates.length; i++) {
        const expectedDate = new Date(today)
        expectedDate.setDate(today.getDate() - i)

        if (uniqueDates[i] === expectedDate.getTime()) {
          currentStreak++
        } else {
          break
        }
      }
    }

    // Find favorite workout type
    const typeCounts: { [key: string]: number } = {}
    historyData.forEach(item => {
      typeCounts[item.workout_type] = (typeCounts[item.workout_type] || 0) + 1
    })

    const favoriteType = Object.keys(typeCounts).length > 0
      ? Object.keys(typeCounts).reduce((a, b) =>
          typeCounts[a] > typeCounts[b] ? a : b
        )
      : 'N/A'

    setStats({ totalWorkouts, totalTimeMinutes, currentStreak, favoriteType })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">
            You need to be signed in to view your workout history.
          </p>
          <Link href="/login">
            <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 mb-3">
              Sign In
            </button>
          </Link>
          <Link href="/">
            <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 p-6">
      <AuthHeader />
      <div className="max-w-6xl mx-auto pt-20">
        <Link href="/" className="text-white hover:text-purple-200 mb-6 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-5xl font-bold text-white mb-2">📊 Workout History</h1>
        <p className="text-purple-200 mb-8">Track your progress and stats</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {stats.totalWorkouts}
            </div>
            <div className="text-gray-600 font-medium">Total Workouts</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {stats.totalTimeMinutes}
            </div>
            <div className="text-gray-600 font-medium">Minutes Exercised</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {stats.currentStreak} 🔥
            </div>
            <div className="text-gray-600 font-medium">Day Streak</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {stats.favoriteType === 'circuit' ? '⚡ Circuit' : '💪 Classic'}
            </div>
            <div className="text-gray-600 font-medium">Favorite Type</div>
          </div>
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🏃</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No workout history yet</h2>
            <p className="text-gray-600 mb-6">
              Complete your first workout to start tracking your progress!
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/workouts/circuit">
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700">
                  Start Circuit Workout
                </button>
              </Link>
              <Link href="/workouts/classic">
                <button className="bg-gray-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-700">
                  Start Classic Workout
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {item.workout_name}
                    </h3>
                    <div className="flex gap-2 flex-wrap mb-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {item.workout_type === 'circuit' ? '⚡ Circuit' : '💪 Classic'}
                      </span>
                      {item.level && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          Level {item.level}
                        </span>
                      )}
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        ⏱️ {formatDuration(item.duration_seconds)}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">
                      {formatDate(item.completed_at)}
                    </p>
                  </div>
                  <div className="text-green-500 text-3xl">
                    ✅
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
