'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import Link from 'next/link'
import type { Subscription } from '@/lib/types'
import { getRenewalUrgency, formatDate } from '@/lib/subscription-utils'
import { formatAmount } from '@/lib/currencies'

const DISMISS_KEY = 'trialBannerDismissedDate'
const TRIAL_COLOR = '#8B5CF6'

export default function TrialEndingBanner({
  subs,
  currency,
}: {
  subs: Subscription[]
  currency: string
}) {
  const [mounted, setMounted] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const endingTrials = subs.filter(
    (s) => s.status === 'Active' && s.is_trial && getRenewalUrgency(s.renewal_date) === 'urgent'
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

  if (!mounted || dismissed || endingTrials.length === 0) return null

  return (
    <div
      className="mb-6 flex items-start justify-between gap-3 rounded-lg border p-4"
      style={{ borderColor: `${TRIAL_COLOR}66`, backgroundColor: `${TRIAL_COLOR}1A` }}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" style={{ color: TRIAL_COLOR }} />
        <div>
          <p className="text-sm font-semibold text-navy">
            {endingTrials.length === 1
              ? `${endingTrials[0].service_name}'s trial ends soon`
              : `${endingTrials.length} free trials are ending soon`}
          </p>
          <p className="mt-0.5 text-xs text-gray-600">
            {endingTrials.map((s) => (
              <span key={s.id} className="mr-2">
                {s.service_name} — converts to {formatAmount(s.price, currency)} on {formatDate(s.renewal_date)}
              </span>
            ))}
          </p>
          <Link href="/subscriptions" className="mt-1 inline-block text-xs font-medium text-navy underline">
            Review before you&apos;re charged
          </Link>
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