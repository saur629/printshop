'use client'
import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { formatPrice, formatDate, ORDER_STATUS_STEPS, ORDER_STATUS_COLORS } from '@/lib/utils'
import { CheckCircle, Circle, Package, Truck, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

function OrderDetailContent() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const isSuccess = searchParams.get('success') === 'true'
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`)
        const data = await res.json()
        setOrder(data.order)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-ink-400">Loading...</div>
  if (!order) return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-ink-500">Order not found.</div>

  const currentStepIndex = ORDER_STATUS_STEPS.findIndex(s => s.key === order.status)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 flex items-start gap-4">
          <CheckCircle className="w-8 h-8 text-green-500 shrink-0 mt-0.5" />
          <div>
            <h2 className="font-bold text-green-900 text-xl mb-1">Order Placed Successfully! 🎉</h2>
            <p className="text-green-700">Thank you for your order. We'll send you a confirmation email shortly and keep you updated on the progress.</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-900">{order.orderNumber}</h1>
          <p className="text-ink-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <span className={`badge text-sm px-3 py-1 ${ORDER_STATUS_COLORS[order.status]}`}>
          {order.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
      </div>

      {/* Progress Tracker */}
      {order.status !== 'cancelled' && order.status !== 'refunded' && (
        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-ink-900 mb-6">Order Progress</h2>
          <div className="flex items-start justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-ink-200 z-0" />
            {ORDER_STATUS_STEPS.map((step, i) => {
              const isDone = i <= currentStepIndex
              const isCurrent = i === currentStepIndex
              return (
                <div key={step.key} className="flex flex-col items-center text-center z-10 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mb-2 transition-colors ${isDone ? 'bg-brand-500 text-white' : 'bg-ink-200 text-ink-400'} ${isCurrent ? 'ring-4 ring-brand-100' : ''}`}>
                    {isDone ? '✓' : step.icon}
                  </div>
                  <p className={`text-xs font-medium leading-tight hidden sm:block ${isCurrent ? 'text-brand-600' : isDone ? 'text-ink-700' : 'text-ink-400'}`}>
                    {step.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Items */}
        <div className="card p-5">
          <h2 className="font-semibold text-ink-900 mb-4 flex items-center gap-2"><Package className="w-4 h-4" /> Items Ordered</h2>
          <div className="space-y-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between gap-4 pb-4 border-b border-ink-100 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-ink-900 text-sm">{item.productName}</p>
                  <div className="text-xs text-ink-500 mt-1 space-y-0.5">
                    <p>Qty: {item.quantity} · Size: {item.size}</p>
                    {item.paper && <p>Paper: {item.paper} · Finish: {item.finish}</p>}
                    {item.turnaround && <p>Turnaround: {item.turnaround}</p>}
                    {item.uploadedFileName && <p className="text-green-600">✓ File: {item.uploadedFileName}</p>}
                  </div>
                </div>
                <span className="font-semibold text-ink-900 shrink-0">{formatPrice(item.totalPrice)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary & Shipping */}
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-semibold text-ink-900 mb-4">Payment Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-ink-600"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between text-ink-600"><span>Tax</span><span>{formatPrice(order.tax)}</span></div>
              <div className="flex justify-between text-ink-600"><span>Shipping</span><span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span></div>
              <hr className="border-ink-100" />
              <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-brand-600">{formatPrice(order.total)}</span></div>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-semibold text-ink-900 mb-3 flex items-center gap-2"><MapPin className="w-4 h-4" /> Shipping Address</h2>
            <div className="text-sm text-ink-600 space-y-0.5">
              <p className="font-medium text-ink-900">{order.shippingAddress?.name}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
              <p>{order.shippingAddress?.country}</p>
            </div>
            {order.trackingNumber && (
              <div className="mt-3 pt-3 border-t border-ink-100">
                <p className="text-xs text-ink-500 mb-1 flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Tracking</p>
                <p className="font-mono text-sm text-brand-600">{order.trackingNumber}</p>
                {order.trackingCarrier && <p className="text-xs text-ink-500">{order.trackingCarrier}</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status History */}
      {order.statusHistory?.length > 0 && (
        <div className="card p-5">
          <h2 className="font-semibold text-ink-900 mb-4">Order Updates</h2>
          <div className="space-y-3">
            {[...order.statusHistory].reverse().map((entry, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-ink-900">{entry.message}</p>
                  <p className="text-xs text-ink-400">{formatDate(entry.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <Link href="/orders" className="btn-outline text-sm">← All Orders</Link>
        <Link href="/products" className="btn-primary text-sm">Order Again</Link>
      </div>
    </div>
  )
}

export default function OrderDetailPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-20 text-center text-ink-400">Loading...</div>}>
        <OrderDetailContent />
      </Suspense>
    </MainLayout>
  )
}
