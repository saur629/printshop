'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-ink-50">
      <p className="text-6xl mb-4">⚠️</p>
      <h1 className="font-display text-3xl font-bold text-ink-900 mb-3">Something went wrong</h1>
      <p className="text-ink-500 max-w-md mb-8">
        An unexpected error occurred. Please try again or contact support if the issue persists.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <button onClick={reset} className="btn-primary">Try Again</button>
        <Link href="/" className="btn-outline">Go Home</Link>
      </div>
    </div>
  )
}
