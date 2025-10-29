import { supabase } from '@/lib/supabase'
import WorkoutPlayer from '@/components/WorkoutPlayer'
import { notFound } from 'next/navigation'

export default async function PlayWorkout({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ level?: string; rest?: string }>
}) {
  const { id } = await params
  const { level, rest } = await searchParams

  const { data: workout } = await supabase
    .from('workouts')
    .select('*, exercises(*), workout_levels(*)')
    .eq('id', id)
    .single()

  if (!workout) {
    notFound()
  }

  const exercises = workout.exercises?.sort(
    (a: any, b: any) => a.exercise_order - b.exercise_order
  ) || []

  return (
    <WorkoutPlayer
      workout={workout}
      exercises={exercises}
      level={level ? parseInt(level) : undefined}
      restDuration={rest ? parseInt(rest) : 120}
    />
  )
}