'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function FeedbackForm({ email, userId }: { email: string; userId: string }) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!message.trim()) {
      setError('Please enter a message before submitting.')
      return
    }

    setLoading(true)

    const { error } = await supabase.from('feedback').insert({
      user_id: userId,
      email: email,
      message: message.trim(),
    })

    setLoading(false)

    if (error) {
      setError('Something went wrong submitting your feedback. Please try again.')
      return
    }

    setSubmitted(true)
    setMessage('')
  }

  if (submitted) {
    return (
      <div className="rounded-lg bg-green/10 p-6 text-center">
        <p className="text-sm font-medium text-navy">Thanks — your feedback has been sent.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-3 text-sm text-navy underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg bg-card p-8 shadow-sm">
      <div>
        <label className="mb-1 block text-sm text-foreground">Your message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          placeholder="What's on your mind?"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-navy focus:outline-none"
        />
      </div>
      {error && <p className="text-sm text-alert">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-navy px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Feedback'}
      </button>
    </form>
  )
}