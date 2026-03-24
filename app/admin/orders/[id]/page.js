'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { formatPrice, formatDate, ORDER_STATUS_COLORS, ORDER_STATUS_STEPS } from '@/lib/utils'
import { Save, Truck } from 'lucide-react'
import toast from 'react-hot-toast'
import { AdminSidebar } from '@/app/admin/page'

const STATUSES = ['pending', 'confirmed', 'in-production', 'quality-check', 'shipped', 'delivered', 'cancelled', 'refunded']

export default function AdminOrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ status: '', trackingNumber: '', trackingCarrier: '', adminNotes: '', message: '' })

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`)
        const data = await res.json()
        if (data.order) {
          setOrder(data.order)
          setForm({
            status: data.order.status,
            trackingNumber: data.order.trackingNumber || '',
            trackingCarrier: data.order.trackingCarrier || '',
            adminNotes: data.order.adminNotes || '',
            message: '',
          })
        }
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const data = await res.json()
        setOrder(data.order)
        toast.success('Order updated!')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex min-h-screen bg-ink-50">
      <AdminSidebar active="/admin/orders" />
      <div className="flex-1 flex items-center justify-center text-ink-400">Loading order...</div>
    </div>
  )

  if (!order) return (
    <div className="flex min-h-screen bg-ink-50">
      <AdminSidebar active="/admin/orders" />
      <div className="flex-1 flex items-center justify-center text-ink-500">Order not found.</div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-ink-50">
      <AdminSidebar active="/admin/orders" />
      <main className="flex-1 p-8 overflow-auto"/>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink-900">{order.orderNumber}</h1>
            <p className="text-ink-500 mt-1">Placed {formatDate(order.createdAt)}</p>
          </div>
          <span className={`badge text-sm px-3 py-1.5 ${ORDER_STATUS_COLORS[order.status]}`}>
            {order.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Items + Customer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="card p-6">
              <h2 className="font-semibold text-ink-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between gap-4 pb-4 border-b border-ink-100 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <p className="font-medium text-ink-900">{item.productName}</p>
                      <div className="text-xs text-ink-500 mt-1 grid grid-cols-2 gap-x-4 gap-y-0.5">
                        <span>Qty: <b>{item.quantity}</b></span>
                        {item.size && <span>Size: {item.size}</span>}
                        {item.paper && <span>Paper: {item.paper}</span>}
                        {item.finish && <span>Finish: {item.finish}</span>}
                        {item.turnaround && <span>Turnaround: {item.turnaround}</span>}
                        {item.uploadedFileName && <span className="text-green-600 col-span-2">📎 File: {item.uploadedFileName}</span>}
                      </div>
                      {item.customNotes && <p className="text-xs text-ink-500 mt-1 italic">Note: {item.customNotes}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-ink-900">{formatPrice(item.totalPrice)}</p>
                      <p className="text-xs text-ink-400">{formatPrice(item.unitPrice)}/unit</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-ink-100 space-y-1.5 text-sm">
                <div className="flex justify-between text-ink-600"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                <div className="flex justify-between text-ink-600"><span>Tax</span><span>{formatPrice(order.tax)}</span></div>
                <div className="flex justify-between text-ink-600"><span>Shipping</span><span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span></div>
                <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-brand-600">{formatPrice(order.total)}</span></div>
              </div>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-2 gap-5">
              <div className="card p-5">
                <h3 className="font-semibold text-ink-900 mb-3">Customer</h3>
                <div className="text-sm space-y-1 text-ink-600">
                  <p className="font-medium text-ink-900">{order.user?.name || 'Guest'}</p>
                  <p>{order.user?.email || order.guestEmail}</p>
                  {order.user?.phone && <p>{order.user.phone}</p>}
                </div>
              </div>
              <div className="card p-5">
                <h3 className="font-semibold text-ink-900 mb-3">Shipping Address</h3>
                <div className="text-sm space-y-0.5 text-ink-600">
                  <p className="font-medium text-ink-900">{order.shippingAddress?.name}</p>
                  <p>{order.shippingAddress?.street}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
                  <p>{order.shippingAddress?.country}</p>
                </div>
              </div>
            </div>

            {/* Status History */}
            <div className="card p-5">
              <h3 className="font-semibold text-ink-900 mb-4">Status History</h3>
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
          </div>

          {/* Right: Admin Controls */}
          <div className="space-y-5">
            <div className="card p-5">
              <h3 className="font-semibold text-ink-900 mb-4">Update Order</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Status</label>
                  <select className="input" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                    {STATUSES.map(s => <option key={s} value={s}>{s.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Status Message (optional)</label>
                  <input className="input" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="e.g. Your order is being printed" />
                </div>
                <div>
                  <label className="label flex items-center gap-1"><Truck className="w-4 h-4" /> Tracking Number</label>
                  <input className="input" value={form.trackingNumber} onChange={e => setForm(p => ({ ...p, trackingNumber: e.target.value }))} placeholder="1Z999AA10123456784" />
                </div>
                <div>
                  <label className="label">Carrier</label>
                  <select className="input" value={form.trackingCarrier} onChange={e => setForm(p => ({ ...p, trackingCarrier: e.target.value }))}>
                    <option value="">Select carrier</option>
                    {['UPS', 'FedEx', 'USPS', 'DHL', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Internal Notes</label>
                  <textarea className="input resize-none" rows={3} value={form.adminNotes} onChange={e => setForm(p => ({ ...p, adminNotes: e.target.value }))} placeholder="Internal notes (not visible to customer)" />
                </div>
                <button onClick={handleSave} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            {/* Payment */}
            <div className="card p-5">
              <h3 className="font-semibold text-ink-900 mb-3">Payment</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-500">Status</span>
                  <span className={`badge ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                {order.stripePaymentIntentId && (
                  <div>
                    <p className="text-ink-500 text-xs">Stripe Intent</p>
                    <p className="font-mono text-xs text-ink-700 break-all">{order.stripePaymentIntentId}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    
  )
}
