import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function cleanupDuplicateQuadzilla() {
  console.log('Finding duplicate Quadzilla workouts...')

  // Fetch all Quadzilla workouts
  const { data: workouts, error: fetchError } = await supabase
    .from('workouts')
    .select('id, name, created_at')
    .eq('name', 'Quadzilla')
    .order('created_at', { ascending: true })

  if (fetchError) {
    console.error('Error fetching workouts:', fetchError)
    process.exit(1)
  }

  if (!workouts || workouts.length === 0) {
    console.log('No Quadzilla workouts found.')
    return
  }

  console.log(`Found ${workouts.length} Quadzilla workout(s)`)
  workouts.forEach((w, idx) => {
    console.log(`  ${idx + 1}. ID: ${w.id}, Created: ${w.created_at}`)
  })

  if (workouts.length <= 1) {
    console.log('Only one Quadzilla workout found. No duplicates to remove.')
    return
  }

  // Keep the last one (most recent), delete the first 3
  const toDelete = workouts.slice(0, -1) // All except the last one
  console.log(`\nRemoving ${toDelete.length} duplicate workout(s)...`)

  try {
    for (const workout of toDelete) {
      console.log(`\nDeleting workout ID: ${workout.id}`)

      // Delete associated exercises first (foreign key constraint)
      const { error: exercisesError } = await supabase
        .from('exercises')
        .delete()
        .eq('workout_id', workout.id)

      if (exercisesError) {
        console.error('Error deleting exercises:', exercisesError)
        continue
      }
      console.log('  ✓ Exercises deleted')

      // Delete associated workout levels (foreign key constraint)
      const { error: levelsError } = await supabase
        .from('workout_levels')
        .delete()
        .eq('workout_id', workout.id)

      if (levelsError) {
        console.error('Error deleting workout levels:', levelsError)
        continue
      }
      console.log('  ✓ Workout levels deleted')

      // Delete the workout
      const { error: workoutError } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workout.id)

      if (workoutError) {
        console.error('Error deleting workout:', workoutError)
        continue
      }
      console.log('  ✓ Workout deleted')
    }

    console.log('\n✅ Cleanup completed!')
    console.log(`Kept the latest Quadzilla workout (ID: ${workouts[workouts.length - 1].id})`)
  } catch (error) {
    console.error('\n❌ Cleanup failed:', error)
    process.exit(1)
  }
}

// Run the cleanup
cleanupDuplicateQuadzilla()
