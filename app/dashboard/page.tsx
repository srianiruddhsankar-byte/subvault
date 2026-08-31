import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Wallet } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import InsightsGrid from '@/components/InsightsGrid'
import RenewalCalendar from '@/components/RenewalCalendar'
import UserMenu from '@/components/UserMenu'
import {
  calculateMonthlySpending,
  calculateYearlySpending,
  getUpcomingRenewals,
  getSpendingBreakdown,
  getCategoryBreakdown,
  formatDate,
} from '@/lib/subscription-utils'
import CategoryChart from '@/components/CategoryChart'
import { formatAmount } from '@/lib/currencies'
import Footer from '@/components/Footer'
import SpendingChart from '@/components/SpendingChart'
import EmptyDashboardState from '@/components/EmptyDashboardState'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const currency = user.user_metadata?.currency || 'INR'

  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*')

  const subs = subscriptions || []
  const monthlySpending = calculateMonthlySpending(subs)
  const yearlySpending = calculateYearlySpending(subs)
  const activeCount = subs.filter((s) => s.status === 'Active').length
  const upcoming = getUpcomingRenewals(subs)
  const spendingBreakdown = getSpendingBreakdown(subs)
  const categoryBreakdown = getCategoryBreakdown(subs)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <nav className="relative flex items-center justify-between bg-navy px-4 py-4 text-white sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Wallet className="h-6 w-6" />
          <span className="hidden text-lg font-bold sm:inline">SubVault</span>
        </Link>
        <div className="hidden items-center gap-1 sm:absolute sm:left-1/2 sm:flex sm:-translate-x-1/2">
          <Link href="/dashboard" className="rounded-md bg-white/25 px-3 py-1.5 text-base font-semibold text-white">Dashboard</Link>
          <Link href="/subscriptions" className="rounded-md px-3 py-1.5 text-base text-white/80 transition hover:bg-white/15 hover:text-white">Subscriptions</Link>
          <Link href="/faq" className="rounded-md px-3 py-1.5 text-base text-white/80 transition hover:bg-white/15 hover:text-white">FAQ</Link>
        </div>
        <UserMenu email={user.email!} />
      </nav>

      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
        {subs.length === 0 && (
          <p className="mb-6 text-sm text-gray-500">
            Track your subscriptions and see what you&apos;re spending. Head to{' '}
            <Link href="/subscriptions" className="text-navy underline">
              Subscriptions
            </Link>{' '}
            to add your first one.
          </p>
        )}

        {subs.length === 0 ? (
          <EmptyDashboardState />
        ) : (
          <>
            {/* Stats strip */}
            <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-lg bg-card p-4 shadow-sm">
                <p className="text-sm text-gray-500">Monthly Spending</p>
                <p className="text-xl font-bold text-navy">{formatAmount(monthlySpending, currency)}</p>
              </div>
              <div className="rounded-lg bg-card p-4 shadow-sm">
                <p className="text-sm text-gray-500">Yearly Spending</p>
                <p className="text-xl font-bold text-navy">{formatAmount(yearlySpending, currency)}</p>
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

            {/* Left column: Bar chart + Category chart stacked. Right column: Calendar */}
            <div className="mb-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
              <div className="flex flex-col gap-6">
                {spendingBreakdown.length > 0 && (
                  <SpendingChart data={spendingBreakdown} currency={currency} />
                )}
                {categoryBreakdown.length > 0 && (
                  <CategoryChart data={categoryBreakdown} currency={currency} />
                )}
              </div>
              <RenewalCalendar subs={subs} />
            </div>

            {/* Insights */}
            <InsightsGrid subs={subs} currency={currency} />

            {/* Upcoming Renewals */}
            <h2 className="mb-4 text-lg font-semibold text-navy">Upcoming Renewals</h2>
            {upcoming.length > 0 ? (
              <div className="flex flex-col gap-2">
                {upcoming.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex justify-between rounded-lg bg-card p-4 shadow-sm"
                  >
                    <span className="text-base font-semibold text-navy">{sub.service_name}</span>
                    <span className="text-sm text-gray-400">{formatDate(sub.renewal_date)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-navy/20 bg-card p-6 text-center">
                <p className="text-sm text-gray-500">
                  Nothing renewing soon — you&apos;re all caught up.
                </p>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}