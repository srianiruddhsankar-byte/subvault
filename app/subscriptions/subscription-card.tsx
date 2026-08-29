'use client'

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

  const handleDelete = async () => {
    const confirmed = confirm(`Delete ${sub.service_name}? This cannot be undone.`)
    if (!confirmed) return

    const { error } = await supabase.from('subscriptions').delete().eq('id', sub.id)

    if (error) {
      alert('Error deleting: ' + error.message)
      return
    }

    router.refresh()
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
    <div className="flex items-center justify-between rounded-lg bg-card p-4 shadow-sm">
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
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="rounded-md border border-alert px-3 py-1 text-sm text-alert hover:bg-alert hover:text-white"
        >
          Delete
        </button>
      </div>
    </div>
  )
}