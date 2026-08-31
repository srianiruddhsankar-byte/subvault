'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function UserMenu({ email }: { email: string }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const initial = email.charAt(0).toUpperCase()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-green font-semibold text-white transition hover:opacity-90"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
          <div className="border-b border-gray-100 px-4 py-2 text-xs text-gray-500">
            {email}
          </div>
                    <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-foreground hover:bg-gray-50 sm:hidden"
          >
            Dashboard
          </Link>
          <Link
            href="/subscriptions"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-foreground hover:bg-gray-50 sm:hidden"
          >
            Subscriptions
          </Link>
          <Link
            href="/faq"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-foreground hover:bg-gray-50 sm:hidden"
          >
            FAQ
          </Link>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-foreground hover:bg-gray-50"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-left text-sm text-alert hover:bg-gray-50"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  )
}