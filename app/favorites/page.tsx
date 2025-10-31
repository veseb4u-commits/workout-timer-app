'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthHeader from '@/components/AuthHeader'

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth()
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          id,
          created_at,
          workouts (
            id,
            name,
            description,
            type,
            is_time_based,
            exercises (id)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading favorites:', error)
      } else {
        setFavorites(data || [])
      }

      setLoading(false)
    }

    if (!authLoading) {
      loadFavorites()
    }
  }, [user, authLoading])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center p-6">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-white mb-4">Sign In Required</h1>
          <p className="text-gray-300 mb-6">
            You need to be signed in to view your favorite workouts.
          </p>
          <Link href="/login">
            <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 mb-3">
              Sign In
            </button>
          </Link>
          <Link href="/">
            <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 p-6">
      <AuthHeader />
      <div className="max-w-4xl mx-auto pt-20">
        <Link href="/" className="text-white hover:text-purple-200 mb-6 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-5xl font-bold text-white mb-2">⭐ My Favorites</h1>
        <p className="text-purple-200 mb-8">Your saved workouts</p>

        {favorites.length === 0 ? (
          <div className="bg-gray-800 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-white mb-2">No favorites yet</h2>
            <p className="text-gray-300 mb-6">
              Start by adding workouts to your favorites!
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/workouts/circuit">
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700">
                  Browse Circuit Workouts
                </button>
              </Link>
              <Link href="/workouts/classic">
                <button className="bg-gray-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-700">
                  Browse Classic Workouts
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((fav: any) => {
              const workout = fav.workouts
              if (!workout) return null

              return (
                <Link key={fav.id} href={`/workouts/${workout.id}`}>
                  <div className="bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-purple-500/50 hover:scale-[1.02] transition-all cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-2">
                          {workout.name}
                        </h2>
                        <p className="text-gray-300 mb-3">{workout.description}</p>
                        <div className="flex gap-2 flex-wrap">
                          <span className="px-3 py-1 bg-purple-900 text-purple-200 rounded-full text-sm font-medium">
                            {workout.type === 'circuit' ? '⚡ Circuit/HIIT' : '💪 Classic'}
                          </span>
                          <span className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm font-medium">
                            {workout.is_time_based ? '⏱️ Time-Based' : '🔢 Rep-Based'}
                          </span>
                          <span className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full text-sm">
                            {workout.exercises?.length || 0} exercises
                          </span>
                        </div>
                      </div>
                      <div className="text-yellow-500 text-2xl ml-4">
                        ⭐
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
