'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Exercise {
  id: string
  name: string
  exercise_order?: number
}

interface Workout {
  id: string
  name: string
  description?: string
  type: string
  is_time_based?: boolean
  exercises: Exercise[]
}

interface ExpandableWorkoutCardProps {
  workout: Workout
}

export default function ExpandableWorkoutCard({ workout }: ExpandableWorkoutCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="bg-gray-800/80 rounded-lg shadow-xl backdrop-blur-sm overflow-hidden">
      {/* Workout Header - Always Visible */}
      <div className="flex items-center justify-between p-6">
        <Link href={`/workouts/${workout.id}`} className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-white hover:text-purple-300 transition-colors">
            {workout.name}
          </h2>
        </Link>

        {/* Expand/Collapse Button */}
        <button
          onClick={toggleExpand}
          className="ml-4 p-2 rounded-full hover:bg-white/10 transition-all flex-shrink-0 [-webkit-tap-highlight-color:transparent]"
          aria-label={isExpanded ? 'Collapse workout details' : 'Expand workout details'}
        >
          <svg
            className={`w-6 h-6 text-white transition-transform duration-300 ${isExpanded ? 'rotate-45' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Expandable Details */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-6 pb-6 space-y-4">
          {/* Description */}
          {workout.description && (
            <p className="text-gray-100">{workout.description}</p>
          )}

          {/* Exercise List */}
          {workout.exercises && workout.exercises.length > 0 && (
            <div>
              <p className="text-white text-sm font-semibold mb-2">Exercises:</p>
              <div className="flex flex-wrap gap-2">
                {workout.exercises
                  .sort((a, b) => (a.exercise_order || 0) - (b.exercise_order || 0))
                  .map((ex, idx) => (
                    <span key={ex.id}>
                      <span className="text-white text-xs bg-purple-500/20 px-2 py-1 rounded">
                        {ex.name}
                      </span>
                      {idx < workout.exercises.length - 1 && (
                        <span className="text-white/50 text-xs ml-2">•</span>
                      )}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Workout Type Badge (for classic workouts) */}
          {workout.type === 'classic' && (
            <div className="flex gap-3">
              <span className="text-green-200 text-sm">
                {workout.is_time_based ? '⏱️ Time-Based' : '🔢 Rep-Based'}
              </span>
            </div>
          )}

          {/* View Details Link */}
          <Link
            href={`/workouts/${workout.id}`}
            className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors [-webkit-tap-highlight-color:transparent]"
          >
            Next →
          </Link>
        </div>
      </div>
    </div>
  )
}
