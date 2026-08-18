'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function DeleteAccountButton() {
  const [confirmText, setConfirmText] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm.')
      return
    }

    setLoading(true)
    setError('')

    // Delete the user's subscriptions first, so no orphaned rows are left behind
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('subscriptions').delete().eq('user_id', user.id)
    }

    // Note: Supabase's client SDK cannot delete the auth user itself —
    // that requires the service role key, which must stay server-side.
    // For now this signs the user out and clears their data; full account
    // removal happens via the request-based process in the Privacy Policy.
    await supabase.auth.signOut()

    setLoading(false)
    router.push('/login')
    router.refresh()
  }

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="rounded-md border border-alert px-4 py-2 text-sm text-alert hover:bg-alert hover:text-white"
      >
        Delete Account
      </button>
    )
  }

  return (
    <div className="rounded-md border border-alert/30 bg-alert/5 p-4">
      <p className="mb-2 text-sm text-foreground">
        This will permanently delete all your subscription data. Type{' '}
        <strong>DELETE</strong> to confirm.
      </p>
      <input
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        placeholder="Type DELETE"
      />
      {error && <p className="mb-2 text-sm text-alert">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="rounded-md bg-alert px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Deleting...' : 'Confirm Delete'}
        </button>
        <button
          onClick={() => {
            setShowConfirm(false)
            setConfirmText('')
            setError('')
          }}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-foreground hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}