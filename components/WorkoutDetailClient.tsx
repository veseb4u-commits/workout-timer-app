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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto pt-8">
        <Link 
          href={workout.type === 'circuit' ? '/workouts/circuit' : '/workouts/classic'} 
          className="text-white hover:text-purple-200 mb-6 inline-block"
        >
          ← Back to {workout.type === 'circuit' ? 'Circuit' : 'Classic'} Workouts
        </Link>

        <div className="bg-white rounded-2xl p-8 shadow-2xl mb-6">
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-4xl font-bold text-gray-800 flex-1">
              {workout.name}
            </h1>
            <button
              onClick={handleFavoriteToggle}
              disabled={loading}
              className={`ml-4 p-3 rounded-full transition-all ${
                isFavorite
                  ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-600'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-400'
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
          </div>
          <p className="text-gray-600 text-lg mb-6">{workout.description}</p>

          <div className="flex gap-3 mb-6">
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
              {workout.type === 'circuit' ? '⚡ Circuit/HIIT' : '💪 Classic'}
            </span>
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
              {workout.is_time_based ? '⏱️ Time-Based' : '🔢 Rep-Based'}
            </span>
          </div>

          {workout.has_levels && levels.length > 0 && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Select Level:</h2>
                <div className="grid grid-cols-3 gap-4">
                  {levels.map((level: any) => (
                    <button
                      key={level.level}
                      onClick={() => setSelectedLevel(level.level)}
                      className={`rounded-xl p-4 text-center transition-all cursor-pointer border-2 ${
                        selectedLevel === level.level
                          ? 'bg-purple-200 border-purple-500'
                          : 'bg-purple-50 border-purple-200 hover:bg-purple-100 hover:border-purple-400'
                      }`}
                    >
                      <div className="text-lg font-bold text-purple-700">Level {level.level}</div>
                      <div className="text-sm text-gray-600">{level.sets} sets</div>
                      <div className="text-xs text-gray-500 mt-1">{level.estimated_time}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">⚙️ Rest Between Sets:</h2>
                <div className="grid grid-cols-3 gap-4">
                  {[30, 60, 120].map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setSelectedRest(duration)}
                      className={`rounded-xl p-4 text-center transition-all cursor-pointer border-2 ${
                        selectedRest === duration
                          ? 'bg-yellow-200 border-yellow-500'
                          : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100 hover:border-yellow-400'
                      }`}
                    >
                      <div className="text-lg font-bold text-yellow-700">{duration} sec</div>
                      {duration === 120 && <div className="text-xs text-gray-500 mt-1">(default)</div>}
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
            <h2 className="text-xl font-bold text-gray-800 mb-4">Exercises ({exercises.length}):</h2>
            <div className="space-y-2">
              {exercises.map((exercise: any, index: number) => (
                <div key={exercise.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-purple-600 font-bold text-lg w-8">{index + 1}.</span>
                  <span className="flex-1 font-medium text-gray-700">{exercise.name}</span>
                  <span className="text-gray-600 font-medium">
                    {exercise.duration ? `${exercise.duration}s` : `${exercise.reps} reps`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}