import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Wallet } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import {
  calculateMonthlySpending,
  calculateYearlySpending,
  getUpcomingRenewals,
} from '@/lib/subscription-utils'
import Footer from '@/components/Footer'

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
    <div className="flex min-h-screen flex-col bg-background">
      <nav className="bg-navy px-6 py-4 text-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            <span className="font-bold">SubVault</span>
          </Link>
          <div className="flex gap-6">
            <Link href="/dashboard" className="font-semibold underline">Dashboard</Link>
            <Link href="/subscriptions" className="hover:underline">Subscriptions</Link>
            <Link href="/profile" className="hover:underline">Profile</Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
        <p className="mb-6 text-sm text-gray-500">
          Track your subscriptions and see what you&apos;re spending. Head to{' '}
          <Link href="/subscriptions" className="text-navy underline">
            Subscriptions
          </Link>{' '}
          to add your first one.
        </p>

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

        {subs.length === 0 && (
          <div className="mb-8 rounded-lg border border-dashed border-navy/30 bg-card p-6 text-center">
            <p className="text-foreground">You haven&apos;t added any subscriptions yet.</p>
            <Link
              href="/subscriptions"
              className="mt-2 inline-block rounded-md bg-navy px-4 py-2 text-sm text-white hover:opacity-90"
            >
              Add your first subscription
            </Link>
          </div>
        )}

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
      <Footer />
    </div>
  )
}