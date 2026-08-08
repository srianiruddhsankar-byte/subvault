import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import {
  calculateMonthlySpending,
  calculateYearlySpending,
  getUpcomingRenewals,
} from '@/lib/subscription-utils'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*')

  const subs = subscriptions || []
  const monthlySpending = calculateMonthlySpending(subs)
  const yearlySpending = calculateYearlySpending(subs)
  const activeCount = subs.filter((s) => s.status === 'Active').length
  const upcoming = getUpcomingRenewals(subs)

  return (
    <div>
      <h1>Dashboard</h1>

      <nav>
        <a href="/dashboard">Dashboard</a> |{' '}
        <a href="/subscriptions">Subscriptions</a> |{' '}
        <a href="/profile">Profile</a>
      </nav>

      <div style={{ marginTop: '20px' }}>
        <p>Monthly Spending: {monthlySpending.toFixed(2)}</p>
        <p>Yearly Spending: {yearlySpending.toFixed(2)}</p>
        <p>Active Subscriptions: {activeCount}</p>
        <p>Upcoming Renewals: {upcoming.length}</p>
      </div>

      <h2>Upcoming Renewals</h2>
      {upcoming.length > 0 ? (
        upcoming.map((sub) => (
          <p key={sub.id}>
            {sub.renewal_date} — {sub.service_name}
          </p>
        ))
      ) : (
        <p>No upcoming renewals.</p>
      )}
    </div>
  )
}