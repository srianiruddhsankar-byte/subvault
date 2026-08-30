import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Wallet } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import UserMenu from '@/components/UserMenu'
import AddSubscriptionForm from './add-subscription-form'

export default async function AddSubscriptionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="relative flex items-center justify-between bg-navy px-4 py-4 text-white sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Wallet className="h-6 w-6" />
          <span className="hidden text-lg font-bold sm:inline">SubVault</span>
        </Link>
        <div className="hidden items-center gap-6 sm:absolute sm:left-1/2 sm:flex sm:-translate-x-1/2">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/subscriptions" className="font-semibold underline">Subscriptions</Link>
          <Link href="/faq" className="hover:underline">FAQ</Link>
        </div>
        <UserMenu email={user.email!} />
      </nav>

      <div className="mx-auto max-w-md px-6 py-10">
        <h1 className="mb-6 text-2xl font-bold text-navy">Add Subscription</h1>
        <AddSubscriptionForm />
      </div>
    </div>
  )
}