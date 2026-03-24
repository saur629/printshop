export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="h-10 bg-ink-100 rounded w-48 mb-2 animate-pulse" />
      <div className="h-4 bg-ink-100 rounded w-64 mb-8 animate-pulse" />
      <div className="flex gap-8">
        <div className="w-56 shrink-0">
          <div className="card p-4 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-9 bg-ink-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-ink-100" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-ink-100 rounded w-3/4" />
                <div className="h-3 bg-ink-100 rounded w-full" />
                <div className="h-3 bg-ink-100 rounded w-2/3" />
                <div className="h-6 bg-ink-100 rounded w-1/3 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
