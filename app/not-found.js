import Link from 'next/link'
import MainLayout from '@/components/layout/MainLayout'

export default function NotFound() {
  return (
    <MainLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-8xl font-display font-bold text-ink-200 mb-4">404</p>
        <h1 className="font-display text-3xl font-bold text-ink-900 mb-3">Page Not Found</h1>
        <p className="text-ink-500 max-w-md mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/products" className="btn-outline">Browse Products</Link>
        </div>
      </div>
    </MainLayout>
  )
}
