import { supabase } from '@/lib/supabase'
import WorkoutDetailClient from '@/components/WorkoutDetailClient'
import { notFound } from 'next/navigation'

export default async function WorkoutDetail({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  
  const { data: workout } = await supabase
    .from('workouts')
    .select('*, exercises(*), workout_levels(*)')
    .eq('id', id)
    .single()

  if (!workout) {
    notFound()
  }

  const exercises = workout.exercises?.sort((a: any, b: any) => a.exercise_order - b.exercise_order) || []
  const levels = workout.workout_levels?.sort((a: any, b: any) => a.level - b.level) || []

  return <WorkoutDetailClient workout={workout} exercises={exercises} levels={levels} />
}