import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function importQuadzillaWorkout() {
  console.log('Starting Quadzilla workout import...')

  // Define the workout
  const workoutId = crypto.randomUUID()
  const workout = {
    id: workoutId,
    name: 'Quadzilla',
    description: 'Intense leg workout focusing on quads, glutes, and hamstrings',
    type: 'circuit',
    is_time_based: false,
    has_levels: true,
    created_at: new Date().toISOString(),
  }

  // Define exercises
  const exercises = [
    {
      id: crypto.randomUUID(),
      workout_id: workoutId,
      name: 'Jump Squats',
      exercise_order: 1,
      reps: 4,
      duration: null,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      workout_id: workoutId,
      name: 'Squat Hold',
      exercise_order: 2,
      reps: null,
      duration: 10,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      workout_id: workoutId,
      name: 'Jump Squats',
      exercise_order: 3,
      reps: 4,
      duration: null,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      workout_id: workoutId,
      name: 'Reverse Lunges',
      exercise_order: 4,
      reps: 10,
      duration: null,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      workout_id: workoutId,
      name: 'Squat Hold',
      exercise_order: 5,
      reps: null,
      duration: 10,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      workout_id: workoutId,
      name: 'Reverse Lunges',
      exercise_order: 6,
      reps: 10,
      duration: null,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      workout_id: workoutId,
      name: 'Split Lunges',
      exercise_order: 7,
      reps: 10,
      duration: null,
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
      sets: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      workout_id: workoutId,
      level: 3,
      sets: 5,
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

    console.log('\n✅ Quadzilla workout imported successfully!')
    console.log(`Workout ID: ${workoutId}`)
    console.log(`Exercises: ${exercises.length}`)
    console.log(`Levels: ${levels.length}`)
  } catch (error) {
    console.error('\n❌ Import failed:', error)
    process.exit(1)
  }
}

// Run the import
importQuadzillaWorkout()
