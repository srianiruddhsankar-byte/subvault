import Link from 'next/link'
import { PiggyBank, Bell, TrendingDown, Plus } from 'lucide-react'

export default function EmptyDashboardState() {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Hero */}
      <div className="flex flex-col items-center rounded-xl border border-navy/10 bg-gradient-to-b from-navy/5 to-card px-6 py-14 text-center shadow-sm sm:px-10">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-navy shadow-md">
          <PiggyBank className="h-10 w-10 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-navy sm:text-3xl">
          See where your money&apos;s actually going
        </h2>
        <p className="mt-3 max-w-md text-base text-gray-600">
          Add your subscriptions and SubVault tracks the spending and renewal
          dates you&apos;re probably not keeping up with.
        </p>

        <Link
          href="/subscriptions/add"
          className="mt-8 flex items-center gap-2 rounded-md bg-navy px-8 py-3 text-base font-medium text-white shadow-sm hover:opacity-90"
        >
          <Plus className="h-5 w-5" />
          Add your first subscription
        </Link>
      </div>

      {/* Feature cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-green/20 bg-green/5 p-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green/15">
            <TrendingDown className="h-5 w-5 text-green" />
          </div>
          <h3 className="text-sm font-semibold text-navy">Spending, at a glance</h3>
          <p className="mt-1 text-sm text-gray-600">
            See your total monthly and yearly spend across every subscription.
          </p>
        </div>

        <div className="rounded-xl border border-alert/20 bg-alert/5 p-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-alert/15">
            <Bell className="h-5 w-5 text-alert" />
          </div>
          <h3 className="text-sm font-semibold text-navy">Never miss a renewal</h3>
          <p className="mt-1 text-sm text-gray-600">
            Get reminded by email before a subscription renews — no surprises.
          </p>
        </div>

        <div className="rounded-xl border border-navy/15 bg-navy/5 p-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-navy/15">
            <PiggyBank className="h-5 w-5 text-navy" />
          </div>
          <h3 className="text-sm font-semibold text-navy">Find what you forgot</h3>
          <p className="mt-1 text-sm text-gray-600">
            Spot subscriptions you&apos;re still paying for but no longer use.
          </p>
        </div>
      </div>
    </div>
  )
}