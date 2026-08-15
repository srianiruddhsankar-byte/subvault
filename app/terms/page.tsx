import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <h1 className="mb-2 text-2xl font-bold text-navy">Terms of Service</h1>
        <p className="mb-8 text-sm text-gray-500">Last updated: August 2026</p>

        <div className="flex flex-col gap-6 text-foreground">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-navy">Using SubVault</h2>
            <p className="text-sm leading-relaxed">
              SubVault is an early-stage product currently in testing. By creating an
              account, you agree to use it for its intended purpose — tracking your
              own subscriptions — and not to misuse or attempt to disrupt the service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-navy">No warranty</h2>
            <p className="text-sm leading-relaxed">
              SubVault is provided as-is, without warranty of any kind. As an
              early-stage product, features may change, and occasional bugs or
              downtime may occur.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-navy">Your data</h2>
            <p className="text-sm leading-relaxed">
              You retain ownership of the subscription data you enter. See our{' '}
              <a href="/privacy" className="text-navy underline">
                Privacy Policy
              </a>{' '}
              for details on how it&apos;s handled.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-navy">Changes</h2>
            <p className="text-sm leading-relaxed">
              These terms may be updated as SubVault develops. Continued use after
              changes means you accept the updated terms.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-navy">Contact</h2>
            <p className="text-sm leading-relaxed">
              Questions:{' '}
              <a href="mailto:brodaknows@gmail.com" className="text-navy underline">
                brodaknows@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}