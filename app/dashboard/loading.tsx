export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="h-[60px] bg-navy" />
      <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
        <div className="h-48 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  )
}