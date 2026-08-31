import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Wallet } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import UserMenu from '@/components/UserMenu'
import Footer from '@/components/Footer'

export default async function FAQPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <nav className="relative flex items-center justify-between bg-navy px-4 py-4 text-white sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Wallet className="h-6 w-6" />
          <span className="hidden text-lg font-bold sm:inline">SubVault</span>
        </Link>
        <div className="hidden items-center gap-1 sm:absolute sm:left-1/2 sm:flex sm:-translate-x-1/2">
          <Link href="/dashboard" className="rounded-md px-3 py-1.5 text-base text-white/80 transition hover:bg-white/15 hover:text-white">Dashboard</Link>
          <Link href="/subscriptions" className="rounded-md px-3 py-1.5 text-base text-white/80 transition hover:bg-white/15 hover:text-white">Subscriptions</Link>
          <Link href="/faq" className="rounded-md bg-white/25 px-3 py-1.5 text-base font-semibold text-white">FAQ</Link>
        </div>
        <UserMenu email={user.email!} />
      </nav>

      <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <h1 className="mb-8 text-2xl font-bold text-navy">Frequently Asked Questions</h1>

        <div className="flex flex-col gap-6 text-foreground">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-navy">Is SubVault free?</h2>
            <p className="text-sm leading-relaxed">
              Yes, SubVault is currently free to use with no limits, while we&apos;re in
              early testing and gathering feedback.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-navy">Is my data safe?</h2>
            <p className="text-sm leading-relaxed">
              Your data is stored securely with Supabase and never sold or shared with
              third parties. See our{' '}
              <Link href="/privacy" className="text-navy underline">
                Privacy Policy
              </Link>{' '}
              for full details.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-navy">
              What&apos;s the difference between cancelling and deleting a subscription?
            </h2>
            <p className="text-sm leading-relaxed">
              Cancelling (via Edit → Status) keeps the subscription in your history so
              you can track what you&apos;ve saved by cancelling it. Deleting permanently
              removes it entirely — this cannot be undone.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-navy">
              Will I get reminded before a subscription renews?
            </h2>
            <p className="text-sm leading-relaxed">
              Email reminders are coming soon. In the meantime, your dashboard shows
              what&apos;s renewing this week and month, and flags anything overdue with a
              one-click renew option.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-navy">
              Is SubVault affiliated with Netflix, Spotify, or other services I add?
            </h2>
            <p className="text-sm leading-relaxed">
              No. SubVault is an independent tool for tracking your own subscriptions.
              Service names and colors are shown for identification only — we&apos;re not
              affiliated with or endorsed by any of them.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-navy">
              How do I delete my account?
            </h2>
            <p className="text-sm leading-relaxed">
              You can delete your subscription data directly from your{' '}
              <Link href="/profile" className="text-navy underline">
                Profile
              </Link>{' '}
              page. For full account removal, contact us at{' '}
              <a href="mailto:brodaknows@gmail.com" className="text-navy underline">
                brodaknows@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-navy">
              Something&apos;s not working — who do I tell?
            </h2>
            <p className="text-sm leading-relaxed">
              SubVault is in active testing, so bugs are expected. Reach out at{' '}
              <a href="mailto:brodaknows@gmail.com" className="text-navy underline">
                brodaknows@gmail.com
              </a>{' '}
              — feedback directly shapes what gets built next.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}