import Link from 'next/link'
import { Wallet } from 'lucide-react'
import Footer from '@/components/Footer'
import LandingSlideshow from '@/components/LandingSlideshow'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero */}
      <section className="flex flex-col items-center px-6 pt-20 pb-16 text-center">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-navy p-3">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-navy">SubVault</h1>
        </div>
        <p className="mt-4 text-lg text-foreground">The home for your subscriptions</p>
        <p className="mt-1 text-sm text-gray-500">Track spending. Never miss a renewal.</p>
        <p className="mt-2 text-xs font-medium text-green">
          Free to use — no credit card required
        </p>

        <div className="mt-8 flex gap-4">
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
      </section>

      {/* About / trust slideshow */}
      <section className="border-t border-navy/10 bg-navy/5 px-6 py-16">
        <h2 className="mb-2 text-center text-2xl font-bold text-navy">What SubVault does</h2>
        <p className="mb-10 text-center text-sm text-gray-600">
          A quick look at what you get, before you sign up.
        </p>
        <LandingSlideshow />
      </section>

      {/* Spreadsheet objection */}
      <section className="flex flex-col items-center px-6 py-16 text-center">
        <div className="max-w-md">
          <h2 className="mb-2 text-base font-semibold text-navy">
            Why not just use a spreadsheet?
          </h2>
          <p className="text-sm leading-relaxed text-gray-600">
            You can — but SubVault autofills known services, flags overdue renewals,
            and shows you what you&apos;re actually spending without you touching a formula.
          </p>
        </div>
      </section>

      {/* About the builder */}
      <section className="border-t border-navy/10 px-6 py-12 text-center">
        <p className="mx-auto max-w-md text-sm text-gray-600">
          Built by a solo developer, currently in early testing. Feedback shapes
          what gets built next — reach out anytime at{' '}
          <a href="mailto:brodaknows@gmail.com" className="font-medium text-navy underline">
            brodaknows@gmail.com
          </a>
          .
        </p>
      </section>

      <Footer />
    </div>
  )
}