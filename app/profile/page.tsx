import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Wallet } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import UserMenu from '@/components/UserMenu'
import LogoutButton from './logout-button'
import CurrencySelector from './currency-selector'
import ResetPasswordForm from './reset-password-form'
import DeleteAccountButton from './delete-account-button'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const currentCurrency = user.user_metadata?.currency || 'INR'

  return (
    <div className="min-h-screen bg-background">
            <nav className="relative flex items-center justify-between bg-navy px-4 py-4 text-white sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Wallet className="h-6 w-6" />
          <span className="hidden text-lg font-bold sm:inline">SubVault</span>
        </Link>
        <div className="hidden items-center gap-6 sm:absolute sm:left-1/2 sm:flex sm:-translate-x-1/2">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/subscriptions" className="hover:underline">Subscriptions</Link>
          <Link href="/faq" className="hover:underline">FAQ</Link>
        </div>
        <UserMenu email={user.email!} />
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="max-w-sm rounded-lg bg-card p-8 shadow-sm">
          <h1 className="mb-4 text-2xl font-bold text-navy">Profile</h1>
          <p className="mb-6 text-foreground">{user.email}</p>

          <CurrencySelector currentCurrency={currentCurrency} />

          <div className="mt-8 border-t border-gray-100 pt-6">
            <h2 className="mb-3 text-sm font-semibold text-navy">Change Password</h2>
            <ResetPasswordForm />
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <LogoutButton />
          </div>

          <div className="mt-6 border-t border-gray-100 pt-6">
            <h2 className="mb-3 text-sm font-semibold text-navy">Danger Zone</h2>
            <DeleteAccountButton />
          </div>
        </div>
      </div>
    </div>
  )
}