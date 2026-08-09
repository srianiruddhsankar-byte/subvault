'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signUp({ email, password })
    console.log('SIGNUP RESULT ERROR:', error)

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push('/login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm rounded-lg bg-card p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-navy">Sign Up</h1>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm text-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-navy focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-navy focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-alert">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-md bg-navy px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-sm text-foreground">
          Already have an account?{' '}
          <a href="/login" className="text-navy underline">
            Login
          </a>
        </p>
      </div>
    </div>
  )
}