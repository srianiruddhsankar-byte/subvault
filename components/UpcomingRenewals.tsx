'use client'

import { useState } from 'react'
import type { Subscription } from '@/lib/types'
import { formatDate, getRenewalUrgency } from '@/lib/subscription-utils'
import { urgencyStyles } from '@/lib/renewal-styles'

export default function UpcomingRenewals({ subs }: { subs: Subscription[] }) {
  const [showLegend, setShowLegend] = useState(false)

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-semibold text-navy">Upcoming Renewals</h2>
        <div className="relative">
          <button
            onClick={() => setShowLegend((v) => !v)}
            className="flex h-5 w-5 items-center justify-center rounded-full border border-navy/50 text-[11px] font-semibold text-navy hover:bg-navy/10"
            aria-label="Show color legend"
          >
            i
          </button>

          {showLegend && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowLegend(false)} />
              <div className="absolute left-0 z-20 mt-2 w-64 rounded-lg border border-gray-100 bg-card p-3 shadow-lg">
                {Object.values(urgencyStyles).map((style) => (
                  <div key={style.label} className="flex items-center gap-2 py-1 text-xs text-foreground">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} />
                    {style.label}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {subs.length > 0 ? (
        <div className="flex flex-col gap-2">
          {subs.map((sub) => {
            const urgency = getRenewalUrgency(sub.renewal_date)
            const style = urgencyStyles[urgency]
            return (
              <div
                key={sub.id}
                className={`flex items-center justify-between rounded-lg border p-4 shadow-sm ${style.border} ${style.bg}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
                  <span className="text-base font-semibold text-navy">{sub.service_name}</span>
                </div>
                <span className="text-sm text-gray-500">{formatDate(sub.renewal_date)}</span>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-navy/20 bg-card p-6 text-center">
          <p className="text-sm text-gray-500">
            Nothing renewing soon — you&apos;re all caught up.
          </p>
        </div>
      )}
    </div>
  )
}