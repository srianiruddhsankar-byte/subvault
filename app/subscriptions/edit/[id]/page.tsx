import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import EditSubscriptionForm from './edit-subscription-form'

export default async function EditSubscriptionPage({
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

  const { data: sub, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !sub) {
    notFound()
  }

  return (
    <div>
      <h1>Edit Subscription</h1>
      <EditSubscriptionForm sub={sub} />
    </div>
  )
}