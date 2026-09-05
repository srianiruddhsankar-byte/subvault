'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import type { Subscription } from '@/lib/types'
import { formatDate, getRenewalUrgency } from '@/lib/subscription-utils'
import { urgencyStyles, trialColor } from '@/lib/renewal-styles'

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
                <div className="mt-1 flex items-center gap-2 border-t border-gray-100 pt-2 text-xs text-foreground">
                  <Sparkles className="h-3 w-3 shrink-0" style={{ color: trialColor }} />
                  Free trial converting to paid
                </div>
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
            const Icon = style.icon

            if (sub.is_trial) {
              return (
                <div
                  key={sub.id}
                  className="flex items-center justify-between rounded-lg border p-4 shadow-sm"
                  style={{ borderColor: trialColor, backgroundColor: `${trialColor}26` }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: trialColor }}
                    >
                      <Sparkles className="h-3.5 w-3.5 text-white" />
                    </span>
                    <div>
                      <span className="text-base font-semibold text-navy">{sub.service_name}</span>
                      <p
                        className="text-[10px] font-semibold uppercase tracking-wide"
                        style={{ color: trialColor }}
                      >
                        Free Trial Ending
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: trialColor }}>
                    {formatDate(sub.renewal_date)}
                  </span>
                </div>
              )
            }

            return (
              <div
                key={sub.id}
                className={`flex items-center justify-between rounded-lg border p-4 shadow-sm ${style.border} ${style.bg}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${style.dot}`}
                  >
                    <Icon className="h-3.5 w-3.5 text-white" />
                  </span>
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