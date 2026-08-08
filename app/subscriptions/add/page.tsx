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
    <div>
      <h1>Add Subscription</h1>
      <AddSubscriptionForm />
    </div>
  )
}