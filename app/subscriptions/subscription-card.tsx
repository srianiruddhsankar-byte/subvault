'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { formatAmount } from '@/lib/currencies'
import { formatDate, isOverdue, getNextRenewalDate } from '@/lib/subscription-utils'

import type { Subscription } from '@/lib/types'

export default function SubscriptionCard({
  sub,
  currency,
}: {
  sub: Subscription
  currency: string
}) {
  const router = useRouter()
  const supabase = createClient()
  const overdue = isOverdue(sub)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [showUndoToast, setShowUndoToast] = useState(false)
  const [undoTimeoutId, setUndoTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const handleDelete = async () => {
    setShowDeleteConfirm(false)
    setShowUndoToast(true)

    const timeoutId = setTimeout(async () => {
      const { error } = await supabase.from('subscriptions').delete().eq('id', sub.id)
      if (!error) {
        router.refresh()
      }
    }, 6000)

    setUndoTimeoutId(timeoutId)
  }

  const handleUndo = () => {
    if (undoTimeoutId) {
      clearTimeout(undoTimeoutId)
    }
    setShowUndoToast(false)
  }

  const handleRenew = async () => {
    const nextDate = getNextRenewalDate(sub.renewal_date, sub.billing_cycle)

    const { error } = await supabase
      .from('subscriptions')
      .update({ renewal_date: nextDate, updated_at: new Date().toISOString() })
      .eq('id', sub.id)

    if (error) {
      alert('Error renewing: ' + error.message)
      return
    }

    router.refresh()
  }

  return (
    <div
      onClick={() => router.push(`/subscriptions/${sub.id}`)}
      className="flex cursor-pointer items-center justify-between rounded-lg bg-card p-4 shadow-sm transition hover:bg-navy/5"
    >
      <div>
        <p className="mb-1 text-xl font-bold leading-tight text-navy">{sub.service_name}</p>
        <p className="text-sm text-gray-400">
          {formatAmount(sub.price, currency)} · {sub.billing_cycle} · Renews {formatDate(sub.renewal_date)}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs ${
              sub.status === 'Active'
                ? 'bg-green/10 text-green'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {sub.status}
          </span>
          {overdue && (
            <span className="inline-block rounded-full bg-alert/10 px-2 py-0.5 text-xs font-medium text-alert">
              Renewal overdue
            </span>
          )}
        </div>
      </div>
      <div
        className="flex flex-col items-end gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-2">
          {overdue && (
            <button
              onClick={handleRenew}
              className="rounded-md bg-green px-3 py-1 text-sm text-white hover:opacity-90"
            >
              Renew
            </button>
          )}
          <button
            onClick={() => router.push(`/subscriptions/edit/${sub.id}`)}
            className="rounded-md border border-navy px-3 py-1 text-sm text-navy hover:bg-navy hover:text-white"
            title="Edit details or mark as Cancelled to keep it in your history"
          >
            Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-md border border-alert px-3 py-1 text-sm text-alert hover:bg-alert hover:text-white"
            title="Permanently removes this subscription — use Cancel instead to keep a record"
          >
            Delete
          </button>
        </div>
        <p className="text-[11px] text-gray-400">
          Cancel via Edit to keep history · Delete removes it permanently
        </p>
      </div>
      {showUndoToast && (
        <div className="fixed bottom-8 left-1/2 z-50 flex w-[90%] max-w-sm -translate-x-1/2 items-center justify-between gap-4 rounded-lg bg-navy px-6 py-4 text-white shadow-xl">
          <span className="text-base">{sub.service_name} deleted</span>
          <button
            onClick={handleUndo}
            className="rounded-md bg-green px-4 py-1.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Undo
          </button>
        </div>
      )}

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-2 text-lg font-bold text-navy">Delete {sub.service_name}?</h3>
            <p className="mb-4 text-sm text-gray-500">
              This permanently removes it from your subscriptions. This cannot be undone.
            </p>
            {deleteError && <p className="mb-3 text-sm text-alert">{deleteError}</p>}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteError('')
                }}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-foreground hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-md bg-alert px-4 py-2 text-sm text-white hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}