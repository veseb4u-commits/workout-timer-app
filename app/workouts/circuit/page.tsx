import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function CircuitWorkouts() {
  // Fetch circuit workouts from database
  const { data: workouts } = await supabase
    .from('workouts')
    .select('*, workout_levels(*)')
    .eq('type', 'circuit')
    .order('name')

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Back Button */}
        <Link href="/" className="text-white hover:text-purple-200 mb-6 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-white mb-2">
          ⚡ HIIT / Circuit Workouts
        </h1>
        <p className="text-purple-200 mb-8">
          Select a workout and choose your level
        </p>

        {/* Workout Cards */}
        <div className="space-y-4">
          {workouts?.map((workout) => (
            <Link key={workout.id} href={`/workouts/${workout.id}`}>
              <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-purple-500/50 hover:scale-[1.02] transition-all cursor-pointer">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {workout.name}
                </h2>
                <p className="text-gray-600 mb-4">{workout.description}</p>
                
                {/* Level Badges */}
                <div className="flex gap-3 flex-wrap">
                  {workout.workout_levels?.map((level: any) => (
                    <span
                      key={level.level}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium"
                    >
                      Level {level.level}: {level.sets} sets • {level.estimated_time}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}