import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import AddSubscriptionForm from './add-subscription-form'

export default async function AddSubscriptionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-navy px-6 py-4 text-white">
        <div className="mx-auto flex max-w-4xl gap-6">
          <a href="/dashboard" className="hover:underline">Dashboard</a>
          <a href="/subscriptions" className="hover:underline">Subscriptions</a>
          <a href="/profile" className="hover:underline">Profile</a>
        </div>
      </nav>

      <div className="mx-auto max-w-md px-6 py-10">
        <h1 className="mb-6 text-2xl font-bold text-navy">Add Subscription</h1>
        <AddSubscriptionForm />
      </div>
    </div>
  )
}