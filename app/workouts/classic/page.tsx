import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function ClassicWorkouts() {
  // Fetch classic workouts from database
  const { data: workouts } = await supabase
    .from('workouts')
    .select('*, exercises(*)')
    .eq('type', 'classic')
    .order('name')

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
            Classic Workouts
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="px-3 py-6 max-w-4xl mx-auto w-full space-y-6">

        {/* Instruction Text */}
        <div className="text-center">
          <p className="text-2xl text-white font-bold">
            Select a workout
          </p>
        </div>

        <div className="flex flex-col gap-1">
          {workouts?.map((workout) => (
            <Link key={workout.id} href={`/workouts/${workout.id}`}>
              <div className="bg-gray-800/80 rounded-lg p-6 shadow-xl hover:shadow-purple-500/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer backdrop-blur-sm [-webkit-tap-highlight-color:transparent]">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {workout.name}
                </h2>
                <p className="text-gray-100 mb-4">{workout.description}</p>

                {/* Exercise List */}
                {workout.exercises && workout.exercises.length > 0 && (
                  <div className="mb-4">
                    <p className="text-white text-sm mb-2">Exercises:</p>
                    <div className="flex flex-wrap gap-2">
                      {workout.exercises
                        .sort((a: any, b: any) => (a.exercise_order || 0) - (b.exercise_order || 0))
                        .map((ex: any, idx: number) => (
                          <span key={ex.id}>
                            <span className="text-white text-xs">{ex.name}</span>
                            {idx < workout.exercises.length - 1 && <span className="text-white text-xs ml-2">•</span>}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <span className="text-green-200 text-sm">
                    {workout.is_time_based ? '⏱️ Time-Based' : '🔢 Rep-Based'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        </div>
      </div>
    </div>
  )
}