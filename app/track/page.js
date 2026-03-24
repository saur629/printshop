'use client'
import { useState } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { formatPrice, formatDate, ORDER_STATUS_STEPS, ORDER_STATUS_COLORS } from '@/lib/utils'
import { Search, Package } from 'lucide-react'

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e) => {
    e.preventDefault()
    if (!orderNumber.trim()) return
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const res = await fetch(`/api/orders/${orderNumber.trim()}`)
      if (!res.ok) { setError('Order not found. Please check your order number.'); return }
      const data = await res.json()
      setOrder(data.order)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentStepIndex = order ? ORDER_STATUS_STEPS.findIndex(s => s.key === order.status) : -1

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <Package className="w-14 h-14 mx-auto mb-4 text-brand-500" />
          <h1 className="section-title">Track Your Order</h1>
          <p className="section-subtitle mx-auto mt-2">Enter your order number to see real-time status updates</p>
        </div>

        <form onSubmit={handleTrack} className="flex gap-3 mb-10">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g. PS-01023"
            className="input flex-1 text-base"
          />
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            <Search className="w-4 h-4" /> {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm mb-6">{error}</div>
        )}

        {order && (
          <div className="space-y-6 animate-fade-up">
            {/* Status */}
            <div className="card p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-ink-900">{order.orderNumber}</h2>
                  <p className="text-ink-500 mt-1">Placed {formatDate(order.createdAt)}</p>
                </div>
                <span className={`badge text-sm px-3 py-1 ${ORDER_STATUS_COLORS[order.status]}`}>
                  {order.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>

              {order.status !== 'cancelled' && (
                <div className="flex items-start justify-between relative">
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-ink-200 z-0" />
                  {ORDER_STATUS_STEPS.map((step, i) => {
                    const isDone = i <= currentStepIndex
                    const isCurrent = i === currentStepIndex
                    return (
                      <div key={step.key} className="flex flex-col items-center text-center z-10 flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors ${isDone ? 'bg-brand-500 text-white' : 'bg-ink-200 text-ink-400'} ${isCurrent ? 'ring-4 ring-brand-100' : ''}`}>
                          {isDone ? '✓' : step.icon}
                        </div>
                        <p className={`text-xs font-medium hidden sm:block ${isCurrent ? 'text-brand-600' : isDone ? 'text-ink-700' : 'text-ink-400'}`}>
                          {step.label}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Items preview */}
            <div className="card p-5">
              <h3 className="font-semibold text-ink-900 mb-3">Items in this order</h3>
              <div className="space-y-2">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-ink-700">{item.productName} <span className="text-ink-400">× {item.quantity}</span></span>
                    <span className="font-medium">{formatPrice(item.totalPrice)}</span>
                  </div>
                ))}
                <hr className="border-ink-100 my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span><span className="text-brand-600">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Tracking */}
            {order.trackingNumber && (
              <div className="card p-5">
                <h3 className="font-semibold text-ink-900 mb-2">Shipment Tracking</h3>
                <p className="text-sm text-ink-500">Carrier: {order.trackingCarrier || 'N/A'}</p>
                <p className="font-mono text-brand-600 text-lg mt-1">{order.trackingNumber}</p>
              </div>
            )}

            {/* Status history */}
            <div className="card p-5">
              <h3 className="font-semibold text-ink-900 mb-4">Order Updates</h3>
              <div className="space-y-3">
                {[...order.statusHistory].reverse().map((entry, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-400 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-sm text-ink-800">{entry.message}</p>
                      <p className="text-xs text-ink-400">{formatDate(entry.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
