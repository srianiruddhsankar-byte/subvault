'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquarePlus } from 'lucide-react'

const HIDDEN_PATHS = ['/', '/login', '/signup']

export default function FeedbackButton() {
  const pathname = usePathname()

  if (HIDDEN_PATHS.includes(pathname)) {
    return null
  }

  return (
    <Link
      href="/feedback"
      className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white shadow-lg transition hover:scale-105 hover:opacity-90"
      aria-label="Send feedback"
    >
      <MessageSquarePlus className="h-6 w-6" />
    </Link>
  )
}