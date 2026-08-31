import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase-server'

export default async function PrivacyPolicyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header loggedIn={!!user} />
      <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <h1 className="mb-2 text-2xl font-bold text-navy">Privacy Policy</h1>
        <p className="mb-8 text-sm text-gray-500">Last updated: August 2026</p>

        <div className="flex flex-col gap-6 text-foreground">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-navy">What we collect</h2>
            <p className="text-sm leading-relaxed">
              When you sign up for SubVault, we collect your email address and the
              subscription details you choose to enter (service name, price, billing
              cycle, and renewal date). We use basic analytics (Vercel Analytics) to
              understand how the site is used.
               <p className="mt-2 text-sm leading-relaxed">
              We use Vercel Analytics to understand aggregate site usage (like page
              views), which does not use tracking cookies or collect personally
              identifiable information.
            </p>
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-navy">How we use it</h2>
            <p className="text-sm leading-relaxed">
              Your email is used to log you in and, in the future, to send renewal
              reminders. Your subscription data is only used to power your personal
              dashboard. We do not sell or share your data with third parties.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-navy">Data storage</h2>
            <p className="text-sm leading-relaxed">
              Your data is stored securely with Supabase, our authentication and
              database provider.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-navy">Your rights</h2>
            <p className="text-sm leading-relaxed">
              You can request deletion of your account and all associated data at any
              time by contacting us below.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-navy">Contact</h2>
            <p className="text-sm leading-relaxed">
              Questions or data deletion requests:{' '}
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