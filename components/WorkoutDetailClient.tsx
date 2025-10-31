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
  const [showTimeline, setShowTimeline] = useState(false)
  const [visibleExercises, setVisibleExercises] = useState(0)
  const [previewLevel, setPreviewLevel] = useState<number | null>(null)
  const [previewRest, setPreviewRest] = useState<number | null>(null)
  const [settingsChanged, setSettingsChanged] = useState(false)
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
            Workout timer
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl mb-6">
          <div className="flex gap-3 mb-6 text-purple-200 text-sm">
            <span>
              {workout.type === 'circuit' ? '⚡ Circuit/HIIT' : '💪 Classic'}
            </span>
            <span>
              {workout.is_time_based ? '⏱️ Time-Based' : '🔢 Rep-Based'}
            </span>
          </div>

          {workout.has_levels && levels.length > 0 && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-3">Select Sets:</h2>
                <div className="inline-flex rounded-lg overflow-hidden border-2 border-purple-700 w-full">
                  {levels.map((level: any, index: number) => (
                    <button
                      key={level.level}
                      onClick={() => {
                        setSelectedLevel(level.level)
                        if (showTimeline && previewLevel !== null && level.level !== previewLevel) {
                          setSettingsChanged(true)
                        }
                      }}
                      className={`flex-1 py-3 px-4 text-center transition-all ${
                        selectedLevel === level.level
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      } ${index !== 0 ? 'border-l-2 border-purple-700' : ''}`}
                    >
                      <div className="text-lg font-bold">Level {level.level}</div>
                      <div className="text-xs mt-1">{level.sets} sets • {level.estimated_time}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-3">⚙️ Rest Between Sets:</h2>
                <div className="inline-flex rounded-lg overflow-hidden border-2 border-purple-700 w-full">
                  {[30, 60, 120].map((duration, index) => (
                    <button
                      key={duration}
                      onClick={() => {
                        setSelectedRest(duration)
                        if (showTimeline && previewRest !== null && duration !== previewRest) {
                          setSettingsChanged(true)
                        }
                      }}
                      className={`flex-1 py-3 px-4 text-center transition-all ${
                        selectedRest === duration
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      } ${index !== 0 ? 'border-l-2 border-purple-700' : ''}`}
                    >
                      <div className="text-base font-bold">{duration} sec</div>
                      {duration === 120 && <div className="text-xs mt-1">(default)</div>}
                    </button>
                  ))}
                </div>
              </div>

              {!showTimeline ? (
                <button
                  onClick={() => {
                    setShowTimeline(true)
                    setVisibleExercises(0)
                    setPreviewLevel(selectedLevel)
                    setPreviewRest(selectedRest)
                    setSettingsChanged(false)
                    // Animate exercises appearing one by one (only first set + rest)
                    const totalItems = exercises.length + 1 // exercises + 1 rest period

                    let count = 0
                    const interval = setInterval(() => {
                      count++
                      setVisibleExercises(count)
                      if (count >= totalItems) {
                        clearInterval(interval)
                      }
                    }, 200) // Each item appears after 200ms
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl text-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Preview Workout
                </button>
              ) : (
                <>
                  {/* Settings changed banner */}
                  {settingsChanged && (
                    <div className="mb-4 p-4 bg-yellow-500/20 border-2 border-yellow-500 rounded-lg flex items-center justify-between animate-fade-in">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div>
                          <p className="text-yellow-200 font-semibold">Settings changed</p>
                          <p className="text-yellow-300 text-sm">The preview below reflects previous settings</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setShowTimeline(false)
                          setSettingsChanged(false)
                          // Trigger preview rebuild
                          setTimeout(() => {
                            setShowTimeline(true)
                            setVisibleExercises(0)
                            setPreviewLevel(selectedLevel)
                            setPreviewRest(selectedRest)
                            const totalItems = exercises.length + 1
                            let count = 0
                            const interval = setInterval(() => {
                              count++
                              setVisibleExercises(count)
                              if (count >= totalItems) {
                                clearInterval(interval)
                              }
                            }, 200)
                          }, 50)
                        }}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-all whitespace-nowrap"
                      >
                        Rebuild Preview
                      </button>
                    </div>
                  )}

                  {/* Timeline */}
                  {/* Timeline */}
                  <div className="mb-6 p-4 bg-gray-900/50 rounded-xl">
                    <h3 className="text-lg font-bold text-white mb-4">Workout Timeline</h3>
                    <div className="relative space-y-3">
                      {/* Continuous vertical timeline line */}
                      <div
                        className="absolute left-4 top-8 w-0.5 bg-purple-600 transition-all duration-300"
                        style={{
                          height: `${Math.max(0, (visibleExercises - 1) * 76 + (visibleExercises > exercises.length ? 76 : 0))}px`
                        }}
                      />

                      {/* Only show first set exercises */}
                      {exercises.map((exercise: any, exIndex: number) => {
                        if (exIndex < visibleExercises) {
                          return (
                            <div key={`ex-${exIndex}`} className="relative flex items-center gap-3 animate-fade-in">
                              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold relative z-10">
                                {exIndex + 1}
                              </div>
                              <div className="flex-1 bg-purple-700/30 rounded-lg p-3">
                                <p className="text-white font-medium">{exercise.name}</p>
                                <p className="text-purple-200 text-xs mt-1">
                                  {exercise.duration ? `${exercise.duration} sec` : exercise.reps ? `${exercise.reps} reps` : 'Time-based'}
                                </p>
                              </div>
                            </div>
                          )
                        }
                        return null
                      })}

                      {/* Show rest period after exercises */}
                      {visibleExercises > exercises.length && (
                        <div className="relative flex items-center gap-3 animate-fade-in">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs relative z-10">
                            ⏸
                          </div>
                          <div className="flex-1 bg-blue-600/20 rounded-lg p-3 border-l-4 border-blue-500">
                            <p className="text-blue-200 font-medium">Rest</p>
                            <p className="text-blue-300 text-xs mt-1">{selectedRest} seconds</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Summary */}
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Sets:</span>
                        <span className="text-white font-bold">{levels.find((l: any) => l.level === selectedLevel)?.sets || 3}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-gray-400">Rest Between Sets:</span>
                        <span className="text-white font-bold">{selectedRest} sec</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-gray-400">Estimated Time:</span>
                        <span className="text-white font-bold">{levels.find((l: any) => l.level === selectedLevel)?.estimated_time || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* START WORKOUT button appears after timeline is built */}
                  {visibleExercises > exercises.length && (
                    <Link href={`/play/${workout.id}?level=${selectedLevel}&rest=${selectedRest}`}>
                      <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-xl text-xl shadow-lg hover:shadow-xl transition-all animate-fade-in">
                        START WORKOUT
                      </button>
                    </Link>
                  )}
                </>
              )}
            </>
          )}

          {!workout.has_levels && (
            <>
              {/* Exercise List for Classic Workouts */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-4">Exercises ({exercises.length})</h2>
                <div className="space-y-3">
                  {exercises.map((exercise: any, index: number) => (
                    <div key={exercise.id} className="bg-gray-700/50 rounded-lg p-4 flex items-center gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-lg">{exercise.name}</p>
                        <p className="text-purple-200 text-sm mt-1">
                          {exercise.duration
                            ? `${exercise.duration} seconds`
                            : exercise.reps
                            ? `${exercise.reps} reps`
                            : 'At your own pace'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link href={`/play/${workout.id}`}>
                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-xl text-xl shadow-lg hover:shadow-xl transition-all">
                  START WORKOUT
                </button>
              </Link>
            </>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}