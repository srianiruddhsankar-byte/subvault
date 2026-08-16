'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

import type { Subscription } from '@/lib/types'

export default function SubscriptionCard({ sub }: { sub: Subscription }) {
  const router = useRouter()
  const supabase = createClient()

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

  return (
    <div className="flex items-center justify-between rounded-lg bg-card p-4 shadow-sm">
      <div>
        <p className="font-semibold text-navy">{sub.service_name}</p>
        <p className="text-sm text-gray-500">
          ₹{sub.price} · {sub.billing_cycle} · Renews {sub.renewal_date}
        </p>
        <span
          className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${
            sub.status === 'Active'
              ? 'bg-green/10 text-green'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {sub.status}
        </span>
      </div>
      <div className="flex gap-2">
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