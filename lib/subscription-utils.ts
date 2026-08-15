type Subscription = {
  id: string
  service_name: string
  price: number
  billing_cycle: string
  renewal_date: string
  status: string
}

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