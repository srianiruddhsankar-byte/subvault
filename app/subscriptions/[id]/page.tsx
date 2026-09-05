import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Wallet, ArrowLeft, Pencil, Tag, Calendar, RefreshCw, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import UserMenu from '@/components/UserMenu'
import Footer from '@/components/Footer'
import { formatAmount } from '@/lib/currencies'
import { formatDate, isOverdue } from '@/lib/subscription-utils'
import knownServices from '@/lib/known-services.json'

export default async function SubscriptionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const currency = user.user_metadata?.currency || 'INR'

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('id', id)
    .single()

  if (!sub) {
    notFound()
  }

  const overdue = isOverdue(sub)

  const knownEntry = (knownServices as { name: string; color: string; initial: string }[]).find(
    (s) => s.name.toLowerCase() === sub.service_name.toLowerCase()
  )
  const avatarColor = knownEntry?.color ?? '#1E3A5F'
  const avatarInitial = knownEntry?.initial ?? sub.service_name.charAt(0).toUpperCase()

  const CYCLE_MONTHS: Record<string, number> = {
    Monthly: 1,
    Quarterly: 3,
    'Half-Yearly': 6,
    '9-Monthly': 9,
    Yearly: 12,
  }
  const months = CYCLE_MONTHS[sub.billing_cycle] ?? 1
  const monthlyEquivalent = sub.price / months
  const yearlyCost = monthlyEquivalent * 12

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <nav className="relative flex items-center justify-between bg-navy px-4 py-4 text-white sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Wallet className="h-6 w-6" />
          <span className="hidden text-lg font-bold sm:inline">SubVault</span>
        </Link>
        <div className="hidden items-center gap-1 sm:absolute sm:left-1/2 sm:flex sm:-translate-x-1/2">
          <Link href="/dashboard" className="rounded-md px-3 py-1.5 text-base text-white/80 transition hover:bg-white/15 hover:text-white">Dashboard</Link>
          <Link href="/subscriptions" className="rounded-md bg-white/25 px-3 py-1.5 text-base font-semibold text-white">Subscriptions</Link>
          <Link href="/faq" className="rounded-md px-3 py-1.5 text-base text-white/80 transition hover:bg-white/15 hover:text-white">FAQ</Link>
        </div>
        <UserMenu email={user.email!} />
      </nav>

      <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <Link
          href="/subscriptions"
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-navy"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Subscriptions
        </Link>

        {/* Header — colored banner background using the service's brand color */}
        <div
          className="mb-6 flex items-center justify-between rounded-lg p-6 shadow-sm"
          style={{ backgroundColor: `${avatarColor}15` }}
        >
          <div className="flex items-center gap-4">
            <span
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white shadow-md"
              style={{ backgroundColor: avatarColor }}
            >
              {avatarInitial}
            </span>
            <div>
              <h1 className="text-2xl font-bold text-navy">{sub.service_name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    sub.status === 'Active' ? 'bg-green/15 text-green' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {sub.status}
                </span>
                {overdue && (
                  <span className="rounded-full bg-alert/15 px-2 py-0.5 text-xs font-medium text-alert">
                    Overdue
                  </span>
                )}
              </div>
            </div>
          </div>
          <Link
            href={`/subscriptions/edit/${sub.id}`}
            className="flex items-center gap-1.5 rounded-md bg-navy px-3 py-1.5 text-sm text-white shadow-sm hover:opacity-90"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Link>
        </div>

        {/* Cost breakdown — colored tiles instead of plain text list */}
        <div className="mb-6 rounded-lg bg-card p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-navy">
            <TrendingUp className="h-4 w-4" />
            Cost Breakdown
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-navy/5 p-4">
              <p className="text-xs text-gray-500">Current Price</p>
              <p className="mt-1 text-lg font-bold text-navy">{formatAmount(sub.price, currency)}</p>
            </div>
            <div className="rounded-lg bg-navy/5 p-4">
              <p className="text-xs text-gray-500">Billing Frequency</p>
              <p className="mt-1 text-lg font-bold text-navy">{sub.billing_cycle}</p>
            </div>
            <div className="rounded-lg bg-green/10 p-4">
              <p className="text-xs text-gray-500">Monthly Equivalent</p>
              <p className="mt-1 text-lg font-bold text-green">{formatAmount(monthlyEquivalent, currency)}</p>
            </div>
            <div className="rounded-lg bg-green/10 p-4">
              <p className="text-xs text-gray-500">Yearly Cost</p>
              <p className="mt-1 text-lg font-bold text-green">{formatAmount(yearlyCost, currency)}</p>
            </div>
            <div className={`rounded-lg p-4 ${sub.status === 'Active' ? 'bg-[#F59E0B]/10' : 'bg-gray-100'}`}>
              <p className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                {sub.status === 'Active' ? 'Next Payment' : 'Cancelled — would have renewed'}
              </p>
              <p className={`mt-1 text-lg font-bold ${sub.status === 'Active' ? 'text-[#F59E0B]' : 'text-gray-500'}`}>
                {formatDate(sub.renewal_date)}
              </p>
            </div>
            <div className="rounded-lg bg-navy/5 p-4">
              <p className="flex items-center gap-1 text-xs text-gray-500">
                <Tag className="h-3 w-3" />
                Category
              </p>
              <p className="mt-1 text-lg font-bold text-navy">{sub.category || 'Other'}</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-lg bg-card p-6 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-navy">
            <RefreshCw className="h-4 w-4" />
            Notes
          </h2>
          {sub.notes ? (
            <p className="whitespace-pre-wrap rounded-lg bg-navy/5 p-4 text-sm text-foreground">
              {sub.notes}
            </p>
          ) : (
            <p className="text-sm text-gray-400">
              No notes yet.{' '}
              <Link href={`/subscriptions/edit/${sub.id}`} className="text-navy underline">
                Add one
              </Link>
              .
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}