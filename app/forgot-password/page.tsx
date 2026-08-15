'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setSent(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-sm rounded-lg bg-card p-8 shadow-md">
          <h1 className="mb-1 text-2xl font-bold text-navy">Reset your password</h1>
          <p className="mb-6 text-sm text-gray-500">
            Enter your email and we&apos;ll send you a reset link
          </p>

          {sent ? (
            <p className="text-sm text-foreground">
              Check your email for a link to reset your password.
            </p>
          ) : (
            <form onSubmit={handleReset} className="flex flex-col gap-4">
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
              {error && <p className="text-sm text-alert">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-md bg-navy px-4 py-2.5 font-medium text-white shadow-sm transition hover:opacity-90 hover:shadow-md disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}