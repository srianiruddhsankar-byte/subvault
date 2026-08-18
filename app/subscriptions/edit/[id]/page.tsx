import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Wallet } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import UserMenu from '@/components/UserMenu'
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
    <div className="min-h-screen bg-background">
      <nav className="relative flex items-center justify-between bg-navy px-6 py-4 text-white">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Wallet className="h-6 w-6" />
          <span className="text-lg font-bold">SubVault</span>
        </Link>
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-6">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/subscriptions" className="font-semibold underline">Subscriptions</Link>
        </div>
        <UserMenu email={user.email!} />
      </nav>

      <div className="mx-auto max-w-md px-6 py-10">
        <h1 className="mb-6 text-2xl font-bold text-navy">Edit Subscription</h1>
        <EditSubscriptionForm sub={sub} />
      </div>
    </div>
  )
}