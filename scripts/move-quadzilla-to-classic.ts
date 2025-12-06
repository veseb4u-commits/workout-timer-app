import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function moveQuadzillaToClassic() {
  console.log('Moving Quadzilla workout to Classic section...')

  try {
    // Update the workout type from 'circuit' to 'classic'
    // Note: We'll keep has_levels as true since it still has difficulty levels
    const { data, error } = await supabase
      .from('workouts')
      .update({
        type: 'classic',
        has_levels: false  // Classic workouts don't typically use the levels system
      })
      .eq('name', 'Quadzilla')
      .select()

    if (error) {
      console.error('Error updating workout:', error)
      throw error
    }

    if (!data || data.length === 0) {
      console.log('No Quadzilla workout found.')
      return
    }

    console.log('✅ Quadzilla workout successfully moved to Classic section!')
    console.log(`Updated workout ID: ${data[0].id}`)
    console.log(`New type: ${data[0].type}`)
    console.log(`Has levels: ${data[0].has_levels}`)

    // Note: The workout_levels data will remain in the database
    // but won't be used in the classic workout flow
    console.log('\nNote: The difficulty levels are still in the database but won\'t be displayed in classic workout mode.')
  } catch (error) {
    console.error('\n❌ Update failed:', error)
    process.exit(1)
  }
}

// Run the update
moveQuadzillaToClassic()
