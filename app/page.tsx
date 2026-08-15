import { Wallet } from 'lucide-react'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-6">
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
      <div className="mt-10 flex gap-4">
        <a
          href="/signup"
          className="rounded-md bg-navy px-6 py-2.5 font-medium text-white shadow-sm transition hover:opacity-90 hover:shadow-md"
        >
          Sign Up
        </a>
        
        <a
          href="/login"
          className="rounded-md border border-navy px-6 py-2.5 font-medium text-navy transition hover:bg-navy hover:text-white"
        >
          Login
        </a>
      </div>
      <Footer />
    </div>
  )
}