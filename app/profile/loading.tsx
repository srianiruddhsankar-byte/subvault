export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-[60px] bg-navy" />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="max-w-sm rounded-lg bg-card p-8 shadow-sm">
          <div className="mb-4 h-8 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mb-6 h-5 w-48 animate-pulse rounded bg-gray-200" />
          <div className="h-16 w-full animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  )
}