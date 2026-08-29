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
export function isOverdue(sub: Subscription): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const renewalDate = new Date(sub.renewal_date)
  return sub.status === 'Active' && renewalDate < today
}

export function getNextRenewalDate(currentDate: string, billingCycle: string): string {
  const date = new Date(currentDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Start from today (not the old date) so a long-overdue subscription
  // jumps to a sensible future date, not just one cycle past the old one
  const base = date < today ? today : date
  const result = new Date(base)

  const monthsToAdd = monthsInCycle(billingCycle)
  result.setMonth(result.getMonth() + monthsToAdd)

  return result.toISOString().split('T')[0] // yyyy-mm-dd for Supabase
}