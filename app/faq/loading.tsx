export default function FAQLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="h-[60px] bg-navy" />
      <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <div className="mb-8 h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="flex flex-col gap-6">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i}>
              <div className="mb-2 h-5 w-56 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}