export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-ink-500 text-sm font-medium">Loading...</p>
      </div>
    </div>
  )
}
