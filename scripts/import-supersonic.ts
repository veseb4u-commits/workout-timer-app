import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function importSupersonicWorkout() {
  console.log('Starting Supersonic workout import...')

  // Define the workout
  const workoutId = crypto.randomUUID()
  const workout = {
    id: workoutId,
    name: 'Supersonic',
    description: 'High-intensity HIIT workout with timed exercises',
    type: 'circuit',
    is_time_based: true,
    has_levels: true,
    created_at: new Date().toISOString(),
  }

  // Define exercises (all are 20 seconds duration)
  const exercises = [
    {
      id: crypto.randomUUID(),
      workout_id: workoutId,
      name: 'High Knees',
      exercise_order: 1,
      reps: null,
      duration: 20,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      workout_id: workoutId,
      name: 'Climbers',
      exercise_order: 2,
      reps: null,
      duration: 20,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      workout_id: workoutId,
      name: 'High Knees',
      exercise_order: 3,
      reps: null,
      duration: 20,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      workout_id: workoutId,
      name: 'Climbers',
      exercise_order: 4,
      reps: null,
      duration: 20,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      workout_id: workoutId,
      name: 'Basic Burpees',
      exercise_order: 5,
      reps: null,
      duration: 20,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      workout_id: workoutId,
      name: 'High Knees',
      exercise_order: 6,
      reps: null,
      duration: 20,
      created_at: new Date().toISOString(),
    },
  ]

  // Define workout levels
  const levels = [
    {
      id: crypto.randomUUID(),
      workout_id: workoutId,
      level: 1,
      sets: 3,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      workout_id: workoutId,
      level: 2,
      sets: 5,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      workout_id: workoutId,
      level: 3,
      sets: 7,
      created_at: new Date().toISOString(),
    },
  ]

  try {
    // Insert workout
    const { error: workoutError } = await supabase
      .from('workouts')
      .insert(workout)

    if (workoutError) {
      console.error('Error inserting workout:', workoutError)
      throw workoutError
    }
    console.log('✓ Workout inserted')

    // Insert exercises
    const { error: exercisesError } = await supabase
      .from('exercises')
      .insert(exercises)

    if (exercisesError) {
      console.error('Error inserting exercises:', exercisesError)
      throw exercisesError
    }
    console.log('✓ Exercises inserted')

    // Insert workout levels
    const { error: levelsError } = await supabase
      .from('workout_levels')
      .insert(levels)

    if (levelsError) {
      console.error('Error inserting workout levels:', levelsError)
      throw levelsError
    }
    console.log('✓ Workout levels inserted')

    console.log('\n✅ Supersonic workout imported successfully!')
    console.log(`Workout ID: ${workoutId}`)
    console.log(`Exercises: ${exercises.length}`)
    console.log(`Levels: ${levels.length}`)
  } catch (error) {
    console.error('\n❌ Import failed:', error)
    process.exit(1)
  }
}

// Run the import
importSupersonicWorkout()
