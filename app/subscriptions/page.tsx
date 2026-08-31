import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Wallet } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import UserMenu from '@/components/UserMenu'
import SubscriptionList from './subscription-list'
import Footer from '@/components/Footer'

export default async function SubscriptionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const currency = user.user_metadata?.currency || 'INR'

  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*')
    .order('renewal_date', { ascending: true })

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

      <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-navy">Your Subscriptions</h1>
          <Link
            href="/subscriptions/add"
            className="rounded-md bg-navy px-4 py-2 text-white hover:opacity-90"
          >
            Add Subscription
          </Link>
        </div>

                {subscriptions && subscriptions.length > 0 ? (
          <SubscriptionList subscriptions={subscriptions} currency={currency} />
        ) : (
          <div className="rounded-lg bg-card p-8 text-center shadow-sm">
            <p className="text-gray-500">No subscriptions yet.</p>
            <p className="mt-2 text-sm text-gray-400">
              Add your subscriptions and we&apos;ll email you before they renew.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}