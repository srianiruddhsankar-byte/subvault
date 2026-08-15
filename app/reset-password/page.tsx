'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push('/login')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-sm rounded-lg bg-card p-8 shadow-md">
          <h1 className="mb-1 text-2xl font-bold text-navy">Set a new password</h1>
          <p className="mb-6 text-sm text-gray-500">Enter your new password below</p>
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm text-foreground">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}