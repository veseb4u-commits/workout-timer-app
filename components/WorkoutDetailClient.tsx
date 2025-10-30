'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Props = {
  workout: any
  exercises: any[]
  levels: any[]
}

export default function WorkoutDetailClient({ workout, exercises, levels }: Props) {
  const [selectedLevel, setSelectedLevel] = useState(2)
  const [selectedRest, setSelectedRest] = useState(120)
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  // Check if workout is already favorited
  useEffect(() => {
    const checkFavorite = async () => {
      if (!user) {
        setIsFavorite(false)
        return
      }

      const { data } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('workout_id', workout.id)
        .single()

      setIsFavorite(!!data)
    }

    checkFavorite()
  }, [user, workout.id])

  const handleFavoriteToggle = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push('/login')
      return
    }

    setLoading(true)

    try {
      if (isFavorite) {
        // Remove from favorites
        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('workout_id', workout.id)

        setIsFavorite(false)
      } else {
        // Add to favorites
        await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            workout_id: workout.id,
          })

        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 flex flex-col">
      {/* Native App Header with Back Button */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Link
              href={workout.type === 'circuit' ? '/workouts/circuit' : '/workouts/classic'}
              className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-all flex-shrink-0"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-lg font-semibold text-white truncate">
              {workout.name}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFavoriteToggle}
              disabled={loading}
              className={`p-2 rounded-full transition-all flex-shrink-0 ${
                isFavorite
                  ? 'bg-yellow-500/20 text-yellow-300'
                  : 'text-white/60 hover:bg-white/10'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill={isFavorite ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
            <Link href="/help" className="p-2 hover:bg-white/10 rounded-full transition-all flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
            <Link href="/login" className="p-2 hover:bg-white/10 rounded-full transition-all flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="px-3 py-6 w-full max-w-4xl mx-auto space-y-6">

        {/* Instruction Text */}
        <div className="text-center">
          <p className="text-2xl text-white font-bold">
            {workout.type === 'circuit'
              ? 'Select the level and rest between sets'
              : 'Rep-based or timed exercises at your own pace'
            }
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl mb-6">
          <p className="text-gray-300 text-base mb-6">{workout.description}</p>

          <div className="flex gap-2 mb-6">
            <span className="px-3 py-1 bg-purple-900/50 text-purple-200 rounded-full text-sm">
              {workout.type === 'circuit' ? '⚡ Circuit/HIIT' : '💪 Classic'}
            </span>
            <span className="px-3 py-1 bg-purple-900/50 text-purple-200 rounded-full text-sm">
              {workout.is_time_based ? '⏱️ Time-Based' : '🔢 Rep-Based'}
            </span>
          </div>

          {workout.has_levels && levels.length > 0 && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-3">Select Level:</h2>
                <div className="grid grid-cols-3 gap-4">
                  {levels.map((level: any) => (
                    <button
                      key={level.level}
                      onClick={() => setSelectedLevel(level.level)}
                      className={`rounded-xl p-4 text-center transition-all cursor-pointer border-2 ${
                        selectedLevel === level.level
                          ? 'bg-purple-700 border-purple-400'
                          : 'bg-purple-950 border-purple-800 hover:bg-purple-900 hover:border-purple-600'
                      }`}
                    >
                      <div className="text-2xl font-bold text-purple-200">{level.level}</div>
                      <div className="text-sm text-gray-300">{level.sets} sets</div>
                      <div className="text-xs text-gray-400 mt-1">{level.estimated_time}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-3">⚙️ Rest Between Sets:</h2>
                <div className="grid grid-cols-3 gap-4">
                  {[30, 60, 120].map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setSelectedRest(duration)}
                      className={`rounded-xl p-4 text-center transition-all cursor-pointer border-2 ${
                        selectedRest === duration
                          ? 'bg-purple-600 border-purple-400'
                          : 'bg-purple-900 border-purple-700 hover:bg-purple-800 hover:border-purple-500'
                      }`}
                    >
                      <div className="text-lg font-bold text-purple-100">{duration} sec</div>
                      {duration === 120 && <div className="text-xs text-gray-300 mt-1">(default)</div>}
                    </button>
                  ))}
                </div>
              </div>

              <Link href={`/play/${workout.id}?level=${selectedLevel}&rest=${selectedRest}`}>
                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-xl text-xl shadow-lg hover:shadow-xl transition-all">
                  START WORKOUT
                </button>
              </Link>
            </>
          )}

          {!workout.has_levels && (
            <Link href={`/play/${workout.id}`}>
              <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-xl text-xl shadow-lg hover:shadow-xl transition-all">
                START WORKOUT
              </button>
            </Link>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Exercises ({exercises.length}):</h2>
            <div className="space-y-2">
              {exercises.map((exercise: any, index: number) => (
                <div key={exercise.id} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                  <span className="text-purple-400 font-bold text-lg w-8">{index + 1}.</span>
                  <span className="flex-1 font-medium text-gray-200">{exercise.name}</span>
                  <span className="text-gray-300 font-medium">
                    {exercise.duration ? `${exercise.duration}s` : `${exercise.reps} reps`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}