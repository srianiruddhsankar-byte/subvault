'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Subscription } from '@/lib/types'
import { getRenewalUrgency } from '@/lib/subscription-utils'
import { urgencyStyles } from '@/lib/renewal-styles'

export default function RenewalCalendar({ subs }: { subs: Subscription[] }) {
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const minDate = new Date(today.getFullYear(), today.getMonth(), 1)
  const maxDate = new Date(today.getFullYear() + 1, today.getMonth(), 1)

  const canGoBack = viewDate > minDate
  const canGoForward = viewDate < maxDate

  const goToPrevMonth = () => {
    if (canGoBack) setViewDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    if (canGoForward) setViewDate(new Date(year, month + 1, 1))
  }

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startWeekday = firstDayOfMonth.getDay()

  const activeSubs = subs.filter((s) => s.status === 'Active')

  const renewalsByDay: Record<number, Subscription[]> = {}
  for (const sub of activeSubs) {
    const renewalDate = new Date(sub.renewal_date)
    if (renewalDate.getFullYear() === year && renewalDate.getMonth() === month) {
      const day = renewalDate.getDate()
      if (!renewalsByDay[day]) renewalsByDay[day] = []
      renewalsByDay[day].push(sub)
    }
  }

  const monthName = viewDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const cells: (number | null)[] = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="rounded-lg bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={goToPrevMonth}
          disabled={!canGoBack}
          className="rounded-md p-1 text-navy hover:bg-navy/10 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold text-navy">{monthName}</h2>
        <button
          onClick={goToNextMonth}
          disabled={!canGoForward}
          className="rounded-md p-1 text-navy hover:bg-navy/10 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400">
        {weekdayLabels.map((label) => (
          <div key={label} className="py-1">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          const isToday =
            day === today.getDate() &&
            year === today.getFullYear() &&
            month === today.getMonth()
          const renewals = day ? renewalsByDay[day] : undefined

          const dayStyle =
            renewals && renewals.length > 0 ? urgencyStyles[getRenewalUrgency(renewals[0].renewal_date)] : null

          return (
            <div
              key={i}
              className={`min-h-[64px] rounded-md border p-1 text-xs ${
                day
                  ? dayStyle
                    ? `${dayStyle.border} ${dayStyle.bg}`
                    : 'border-gray-100'
                  : 'border-transparent'
              } ${isToday ? 'border-2 border-navy shadow-md' : ''}`}
            >
              {day && (
                <>
                  <div className={isToday ? 'font-bold text-navy' : 'text-gray-500'}>
                    <div>{day}</div>
                    {isToday && (
                      <div className="text-center text-[9px] font-bold uppercase tracking-wide text-navy">
                        Today
                      </div>
                    )}
                  </div>
                  {renewals && renewals.length > 0 && (
                    <div className="mt-1 flex flex-col gap-0.5">
                      {renewals.slice(0, 2).map((sub) => (
                        <span
                          key={sub.id}
                          className="block whitespace-normal break-words text-[10px] font-bold leading-tight text-navy"
                        >
                          {sub.service_name}
                        </span>
                      ))}
                      {renewals.length > 2 && (
                        <span className="text-[10px] text-gray-500">
                          +{renewals.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}