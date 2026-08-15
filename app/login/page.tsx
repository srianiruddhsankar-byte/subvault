'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <span className="mb-5 rounded-full bg-navy px-4 py-1.5 text-sm font-semibold tracking-wide text-white">
          LOGIN
        </span>
        <div className="w-full max-w-sm rounded-lg bg-card p-8 shadow-md">
          <h1 className="mb-1 text-2xl font-bold text-navy">Welcome back</h1>
          <p className="mb-6 text-sm text-gray-500">Log in to your SubVault account</p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm text-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 transition focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm text-foreground">Password</label>
                <a href="/forgot-password" className="text-xs text-navy underline">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 transition focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
              />
            </div>
            {error && <p className="text-sm text-alert">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-md bg-navy px-4 py-2.5 font-medium text-white shadow-sm transition hover:opacity-90 hover:shadow-md disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="mt-4 text-sm text-foreground">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-navy underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}