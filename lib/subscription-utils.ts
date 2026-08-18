import type { Subscription } from './types'

// Single source of truth for how many months each billing cycle represents.
// Add or remove cycles here only — the calculation functions below don't
// need to change.
const CYCLE_MONTHS: Record<string, number> = {
  Monthly: 1,
  Quarterly: 3,
  'Half-Yearly': 6,
  '9-Monthly': 9,
  Yearly: 12,
}

function monthsInCycle(cycle: string): number {
  return CYCLE_MONTHS[cycle] ?? 1 // defaults to Monthly if somehow unrecognized
}

export function calculateMonthlySpending(subs: Subscription[]): number {
  return subs
    .filter((s) => s.status === 'Active')
    .reduce((total, s) => total + s.price / monthsInCycle(s.billing_cycle), 0)
}

export function calculateYearlySpending(subs: Subscription[]): number {
  return subs
    .filter((s) => s.status === 'Active')
    .reduce((total, s) => total + (s.price / monthsInCycle(s.billing_cycle)) * 12, 0)
}

export function getUpcomingRenewals(subs: Subscription[], limit = 5) {
  const today = new Date()
  return subs
    .filter((s) => s.status === 'Active' && new Date(s.renewal_date) >= today)
    .sort((a, b) => new Date(a.renewal_date).getTime() - new Date(b.renewal_date).getTime())
    .slice(0, limit)
}

export function getSpendingBreakdown(subs: Subscription[]) {
  return subs
    .filter((s) => s.status === 'Active')
    .map((s) => ({
      name: s.service_name,
      monthly: s.price / monthsInCycle(s.billing_cycle),
    }))
    .sort((a, b) => b.monthly - a.monthly)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleString('en-US', { month: 'short' })
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}