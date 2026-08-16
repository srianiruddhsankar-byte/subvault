import Link from 'next/link'
import { PiggyBank, Bell, TrendingDown } from 'lucide-react'

export default function EmptyDashboardState() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center rounded-xl border border-navy/10 bg-card px-10 py-16 text-center shadow-sm">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green/10">
        <PiggyBank className="h-10 w-10 text-green" />
      </div>

      <h2 className="text-2xl font-bold text-navy sm:text-3xl">
        See where your money&apos;s actually going
      </h2>
      <p className="mt-3 max-w-md text-base text-gray-500">
        Add your subscriptions and SubVault tracks the spending and renewal
        dates you&apos;re probably not keeping up with.
      </p>

      <Link
        href="/subscriptions/add"
        className="mt-8 rounded-md bg-navy px-8 py-3 text-base font-medium text-white hover:opacity-90"
      >
        Add your first subscription
      </Link>

      <div className="mt-10 grid w-full grid-cols-1 gap-4 border-t border-navy/10 pt-8 text-left sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <TrendingDown className="mt-0.5 h-5 w-5 shrink-0 text-green" />
          <p className="text-sm text-gray-500">
            See your total monthly and yearly spend at a glance
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Bell className="mt-0.5 h-5 w-5 shrink-0 text-green" />
          <p className="text-sm text-gray-500">
            Get reminded before a subscription renews
          </p>
        </div>
      </div>
    </div>
  )
}