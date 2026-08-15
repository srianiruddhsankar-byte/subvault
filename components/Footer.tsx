'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('brodaknows@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <footer className="border-t border-gray-100 px-6 py-6 text-center">
      <div className="mb-2 flex justify-center gap-4 text-xs text-gray-400">
        <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
        <Link href="/terms" className="hover:underline">Terms of Service</Link>
        <button onClick={handleCopyEmail} className="hover:underline">
          {copied ? 'Copied!' : 'Contact'}
        </button>
      </div>
      <p className="text-sm text-gray-400">© 2026 ForgeLabs</p>
    </footer>
  )
}