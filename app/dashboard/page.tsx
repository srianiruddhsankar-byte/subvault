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
    <div className="min-h-screen bg-background">
      <nav className="bg-navy px-6 py-4 text-white">
        <div className="mx-auto flex max-w-4xl gap-6">
          <a href="/dashboard" className="font-semibold underline">Dashboard</a>
          <a href="/subscriptions" className="hover:underline">Subscriptions</a>
          <a href="/profile" className="hover:underline">Profile</a>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="mb-6 text-2xl font-bold text-navy">Dashboard</h1>

        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-card p-4 shadow-sm">
            <p className="text-sm text-gray-500">Monthly Spending</p>
            <p className="text-xl font-bold text-navy">₹{monthlySpending.toFixed(2)}</p>
          </div>
          <div className="rounded-lg bg-card p-4 shadow-sm">
            <p className="text-sm text-gray-500">Yearly Spending</p>
            <p className="text-xl font-bold text-navy">₹{yearlySpending.toFixed(2)}</p>
          </div>
          <div className="rounded-lg bg-card p-4 shadow-sm">
            <p className="text-sm text-gray-500">Active Subscriptions</p>
            <p className="text-xl font-bold text-green">{activeCount}</p>
          </div>
          <div className="rounded-lg bg-card p-4 shadow-sm">
            <p className="text-sm text-gray-500">Upcoming Renewals</p>
            <p className="text-xl font-bold text-navy">{upcoming.length}</p>
          </div>
        </div>

        <h2 className="mb-4 text-lg font-semibold text-navy">Upcoming Renewals</h2>
        {upcoming.length > 0 ? (
          <div className="flex flex-col gap-2">
            {upcoming.map((sub) => (
              <div
                key={sub.id}
                className="flex justify-between rounded-lg bg-card p-4 shadow-sm"
              >
                <span className="text-foreground">{sub.service_name}</span>
                <span className="text-sm text-gray-500">{sub.renewal_date}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No upcoming renewals.</p>
        )}
      </div>
    </div>
  )
}