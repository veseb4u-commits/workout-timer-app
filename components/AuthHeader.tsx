'use client'

import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AuthHeader() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return null
  }

  return (
    <div className="absolute top-0 left-0 right-0 p-6">
      <div className="max-w-2xl mx-auto flex justify-between items-center">
        <div className="text-white text-sm">
          {user ? (
            <span>👋 {user.email}</span>
          ) : (
            <span>Welcome, Guest</span>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {user && (
            <>
              <Link href="/history">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2">
                  📊 History
                </button>
              </Link>
              <Link href="/favorites">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2">
                  ⭐ Favorites
                </button>
              </Link>
            </>
          )}
          {user ? (
            <button
              onClick={handleSignOut}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-lg font-medium transition-all"
            >
              Sign Out
            </button>
          ) : (
            <Link href="/login">
              <button className="bg-white hover:bg-gray-100 text-purple-600 px-4 py-3 rounded-lg font-medium transition-all">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
