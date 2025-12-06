import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import ExpandableWorkoutCard from '@/components/ExpandableWorkoutCard'

export default async function CircuitWorkouts() {
  // Fetch circuit workouts from database
  const { data: workouts } = await supabase
    .from('workouts')
    .select('*, workout_levels(*), exercises(*)')
    .eq('type', 'circuit')
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
          <h1 className="text-xl font-semibold text-white flex-1">
            Circuit Workouts
          </h1>
          <Link href="/help" className="p-2 hover:bg-white/10 rounded-full transition-all">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Link>
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

        {/* Workout Cards */}
        <div className="flex flex-col gap-3">
          {workouts?.map((workout) => (
            <ExpandableWorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
        </div>
      </div>
    </div>
  )
}