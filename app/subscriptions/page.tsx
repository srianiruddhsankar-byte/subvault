import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import SubscriptionCard from './subscription-card'

export default async function SubscriptionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*')
    .order('renewal_date', { ascending: true })

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-navy px-6 py-4 text-white">
        <div className="mx-auto flex max-w-4xl gap-6">
          <a href="/dashboard" className="hover:underline">Dashboard</a>
          <a href="/subscriptions" className="font-semibold underline">Subscriptions</a>
          <a href="/profile" className="hover:underline">Profile</a>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-navy">Your Subscriptions</h1>
          
          <a
            href="/subscriptions/add"
            className="rounded-md bg-navy px-4 py-2 text-white hover:opacity-90"
          >
            Add Subscription
          </a>
        </div>

        {subscriptions && subscriptions.length > 0 ? (
          <div className="flex flex-col gap-3">
            {subscriptions.map((sub) => (
              <SubscriptionCard key={sub.id} sub={sub} />
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
    </div>
  )
}