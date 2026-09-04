'use client'

import { useState, useEffect } from 'react'
import { X, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import type { Subscription } from '@/lib/types'
import { getRenewalUrgency } from '@/lib/subscription-utils'

const DISMISS_KEY = 'renewalBannerDismissedDate'

export default function RenewalBanner({ subs }: { subs: Subscription[] }) {
  const [mounted, setMounted] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const urgentSubs = subs.filter(
    (s) => s.status === 'Active' && getRenewalUrgency(s.renewal_date) === 'urgent'
  )

  useEffect(() => {
    const today = new Date().toDateString()
    const dismissedDate = localStorage.getItem(DISMISS_KEY)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDismissed(dismissedDate === today)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const handleDismiss = () => {
    const today = new Date().toDateString()
    localStorage.setItem(DISMISS_KEY, today)
    setDismissed(true)
  }

  // Don't render anything until we've checked localStorage on the client —
  // avoids showing/hiding the banner incorrectly for a split second on load.
  if (!mounted || dismissed || urgentSubs.length === 0) return null

  return (
    <div className="mb-6 flex items-start justify-between gap-3 rounded-lg border border-alert/30 bg-alert/10 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-alert" />
        <div>
          <p className="text-sm font-semibold text-navy">
            {urgentSubs.length === 1
              ? `${urgentSubs[0].service_name} renews within 3 days`
              : `${urgentSubs.length} subscriptions renew within 3 days`}
          </p>
          <p className="mt-0.5 text-xs text-gray-600">
            {urgentSubs.map((s) => s.service_name).join(', ')} —{' '}
            <Link href="/subscriptions" className="underline">
              review subscriptions
            </Link>
          </p>
        </div>
      </div>
      <button
        onClick={handleDismiss}
        className="shrink-0 rounded-md p-1 text-gray-400 hover:bg-black/5 hover:text-gray-600"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}