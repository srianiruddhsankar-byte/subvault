'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-md bg-alert px-4 py-2 text-white hover:opacity-90"
    >
      Logout
    </button>
  )
}