import type { Subscription } from './types'

export function calculateMonthlySpending(subs: Subscription[]): number {
  return subs
    .filter((s) => s.status === 'Active')
    .reduce((total, s) => {
      if (s.billing_cycle === 'Monthly') return total + s.price
      if (s.billing_cycle === 'Yearly') return total + s.price / 12
      return total
    }, 0)
}

export function calculateYearlySpending(subs: Subscription[]): number {
  return subs
    .filter((s) => s.status === 'Active')
    .reduce((total, s) => {
      if (s.billing_cycle === 'Monthly') return total + s.price * 12
      if (s.billing_cycle === 'Yearly') return total + s.price
      return total
    }, 0)
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
      monthly: s.billing_cycle === 'Yearly' ? s.price / 12 : s.price,
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