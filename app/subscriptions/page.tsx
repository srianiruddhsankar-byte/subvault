import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Wallet } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import SubscriptionCard from './subscription-card'
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
      <nav className="bg-navy px-6 py-4 text-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            <span className="font-bold">SubVault</span>
          </Link>
          <div className="flex gap-6">
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <Link href="/subscriptions" className="font-semibold underline">Subscriptions</Link>
            <Link href="/profile" className="hover:underline">Profile</Link>
          </div>
        </div>
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
          <div className="flex flex-col gap-3">
            {subscriptions.map((sub) => (
              <SubscriptionCard key={sub.id} sub={sub} currency={currency} />
            ))}
          </div>
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