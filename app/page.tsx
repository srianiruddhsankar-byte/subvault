import Link from 'next/link'
import { Wallet } from 'lucide-react'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-navy p-3">
          <Wallet className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-navy">SubVault</h1>
      </div>
      <p className="mt-3 text-lg text-foreground">
        The home for your subscriptions
      </p>
      <p className="mt-1 text-sm text-gray-500">
        Track spending. Never miss a renewal.
      </p>
      <p className="mt-2 text-xs font-medium text-green">
        Free to use — no credit card required
      </p>
      <div className="mt-10 flex gap-4">
        <Link
          href="/signup"
          className="rounded-md bg-navy px-6 py-2.5 font-medium text-white shadow-sm transition hover:opacity-90 hover:shadow-md"
        >
          Sign Up
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-navy px-6 py-2.5 font-medium text-navy transition hover:bg-navy hover:text-white"
        >
          Login
        </Link>
      </div>
      <div className="mt-16 max-w-md text-center">
        <h2 className="mb-2 text-base font-semibold text-navy">
          Why not just use a spreadsheet?
        </h2>
        <p className="text-sm leading-relaxed text-gray-600">
          You can — but SubVault autofills known services, flags overdue renewals,
          and shows you what you&apos;re actually spending without you touching a formula.
        </p>
      </div>

      <div className="mt-8 max-w-md text-center">
        <p className="text-sm text-gray-600">
          Built by a solo developer, currently in early testing. Feedback shapes
          what gets built next — reach out anytime at{' '}
          <a href="mailto:brodaknows@gmail.com" className="font-medium text-navy underline">
            brodaknows@gmail.com
          </a>
          .
        </p>
      </div>

      <Footer />
    </div>
  )
}