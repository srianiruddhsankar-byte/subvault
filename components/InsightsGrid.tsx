import { PiggyBank, TrendingUp, PieChart, Wallet } from 'lucide-react'
import { formatAmount } from '@/lib/currencies'
import type { Subscription } from '@/lib/types'
import {
  calculateMoneySaved,
  getMostExpensiveSubscription,
  getTopCategory,
  getRenewingThisWeek,
} from '@/lib/subscription-utils'

export default function InsightsGrid({
  subs,
  currency,
}: {
  subs: Subscription[]
  currency: string
}) {
    const moneySaved = calculateMoneySaved(subs)
  const mostExpensive = getMostExpensiveSubscription(subs)
  const topCategory = getTopCategory(subs)
  const renewingThisWeek = getRenewingThisWeek(subs)

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div className="rounded-lg bg-card p-4 shadow-sm">
        <PiggyBank className="mb-2 h-5 w-5 text-green" />
        <p className="text-sm text-gray-500">Saved by Cancelling</p>
        <p className="text-lg font-bold text-navy">{formatAmount(moneySaved, currency)}/yr</p>
      </div>

      <div className="rounded-lg bg-card p-4 shadow-sm">
        <TrendingUp className="mb-2 h-5 w-5 text-alert" />
        <p className="text-sm text-gray-500">Priciest Subscription</p>
        <p className="text-lg font-bold text-navy">
          {mostExpensive ? mostExpensive.service_name : '—'}
        </p>
      </div>

      <div className="rounded-lg bg-card p-4 shadow-sm">
        <PieChart className="mb-2 h-5 w-5 text-navy" />
        <p className="text-sm text-gray-500">Top Category</p>
        <p className="text-lg font-bold text-navy">
          {topCategory ? topCategory.category : '—'}
        </p>
      </div>

            <div className="rounded-lg bg-card p-4 shadow-sm">
        <Wallet className="mb-2 h-5 w-5 text-navy" />
        <p className="text-sm text-gray-500">Renewing This Week</p>
        <p className="text-lg font-bold text-navy">
          {renewingThisWeek.count > 0
            ? `${renewingThisWeek.count} · ${formatAmount(renewingThisWeek.total, currency)}`
            : 'None'}
        </p>
      </div>
    </div>
  )
}