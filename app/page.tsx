export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <h1 className="text-4xl font-bold text-navy">SubVault</h1>
      <p className="mt-2 text-lg text-foreground">The home for your subscriptions</p>
      <div className="mt-8 flex gap-4">
        <a
          href="/signup"
          className="rounded-md bg-navy px-5 py-2 text-white hover:opacity-90"
        >
          Sign Up
        </a>
        <a
          href="/login"
          className="rounded-md border border-navy px-5 py-2 text-navy hover:bg-navy hover:text-white"
        >
          Login
        </a>
      </div>
    </div>
  )
}