'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({ email, password })

    setLoading(false)

    if (error) {
      if (error.message.toLowerCase().includes('already registered')) {
        setError('An account with this email already exists. Try logging in instead.')
      } else {
        setError(error.message)
      }
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <span className="mb-5 rounded-full bg-navy px-4 py-1.5 text-sm font-semibold tracking-wide text-white">
          SIGN UP
        </span>
        <div className="w-full max-w-sm rounded-lg bg-card p-8 shadow-md">
          <h1 className="mb-1 text-2xl font-bold text-navy">Create your account</h1>
          <p className="mb-6 text-sm text-gray-500">Start tracking your subscriptions</p>
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
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
              <label className="mb-1 block text-sm text-foreground">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-md border border-gray-300 px-3 py-2 transition focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-foreground">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-md border border-gray-300 px-3 py-2 transition focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
              />
            </div>
            {error && <p className="text-sm text-alert">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-md bg-navy px-4 py-2.5 font-medium text-white shadow-sm transition hover:opacity-90 hover:shadow-md disabled:opacity-50"
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
      <Footer />
    </div>
  )
}