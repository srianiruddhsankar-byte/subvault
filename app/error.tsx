'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-alert/10">
        <AlertTriangle className="h-7 w-7 text-alert" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-navy">Something went wrong</h1>
      <p className="mb-6 text-sm text-gray-500">
        An unexpected error occurred. You can try again, or head back to your dashboard.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-md border border-navy px-5 py-2.5 text-sm font-medium text-navy hover:bg-navy hover:text-white"
        >
          Try Again
        </button>
        <Link
          href="/dashboard"
          className="rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}