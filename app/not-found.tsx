import Link from 'next/link'
import { Wallet } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-navy/10">
        <Wallet className="h-7 w-7 text-navy" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-navy">Page not found</h1>
      <p className="mb-6 text-sm text-gray-500">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/dashboard"
        className="rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}