export default function SubscriptionsLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="h-[60px] bg-navy" />
      <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      </div>
    </div>
  )
}