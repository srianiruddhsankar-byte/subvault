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
    <div>
      <h1>Your Subscriptions</h1>
      <a href="/subscriptions/add">Add Subscription</a>
      {subscriptions && subscriptions.length > 0 ? (
        subscriptions.map((sub) => <SubscriptionCard key={sub.id} sub={sub} />)
      ) : (
        <p>No subscriptions yet.</p>
      )}
    </div>
  )
}