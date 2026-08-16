import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import LogoutButton from './logout-button'
import CurrencySelector from './currency-selector'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const currentCurrency = user.user_metadata?.currency || 'INR'

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-navy px-6 py-4 text-white">
        <div className="mx-auto flex max-w-4xl gap-6">
          <a href="/dashboard" className="hover:underline">Dashboard</a>
          <a href="/subscriptions" className="hover:underline">Subscriptions</a>
          <a href="/profile" className="font-semibold underline">Profile</a>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="max-w-sm rounded-lg bg-card p-8 shadow-sm">
          <h1 className="mb-4 text-2xl font-bold text-navy">Profile</h1>
          <p className="mb-6 text-foreground">{user.email}</p>
          <CurrencySelector currentCurrency={currentCurrency} />
          <div className="mt-6">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  )
}