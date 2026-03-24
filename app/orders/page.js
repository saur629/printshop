'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import Link from 'next/link'
import { formatPrice, formatDate, ORDER_STATUS_COLORS } from '@/lib/utils'
import { Package, Eye } from 'lucide-react'

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login?callbackUrl=/orders')
  }, [status])

  useEffect(() => {
    if (status !== 'authenticated') return
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders')
        const data = await res.json()
        setOrders(data.orders || [])
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [status])

  if (status === 'loading' || loading) return (
    <MainLayout><div className="max-w-4xl mx-auto px-4 py-20 text-center text-ink-400">Loading...</div></MainLayout>
  )

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="section-title mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 mx-auto mb-4 text-ink-300" />
            <h2 className="font-display text-2xl font-bold text-ink-900 mb-2">No orders yet</h2>
            <p className="text-ink-500 mb-6">When you place an order, it will appear here.</p>
            <Link href="/products" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-ink-900">{order.orderNumber}</span>
                      <span className={`badge ${ORDER_STATUS_COLORS[order.status]}`}>
                        {order.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                    <p className="text-sm text-ink-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-ink-900">{formatPrice(order.total)}</p>
                    <p className="text-sm text-ink-500">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {order.items?.slice(0, 3).map((item, i) => (
                    <div key={i} className="bg-ink-50 rounded-lg px-3 py-1.5 text-xs text-ink-600">
                      <span className="font-medium">{item.productName}</span>
                      <span className="text-ink-400 ml-1">× {item.quantity}</span>
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <div className="bg-ink-50 rounded-lg px-3 py-1.5 text-xs text-ink-400">
                      +{order.items.length - 3} more
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Link href={`/orders/${order._id}`} className="btn-outline !py-2 !px-4 text-sm flex items-center gap-1.5">
                    <Eye className="w-4 h-4" /> View Details
                  </Link>
                  {order.trackingNumber && (
                    <div className="text-sm text-ink-500 flex items-center gap-1">
                      Tracking: <span className="font-mono text-ink-700">{order.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
