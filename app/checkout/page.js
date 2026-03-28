'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import useCartStore from '@/lib/cartStore'
import { useSession } from 'next-auth/react'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Lock } from 'lucide-react'

// Dynamically import Stripe to prevent SSR issues
let stripePromise = null
const getStripe = () => {
  if (!stripePromise && typeof window !== 'undefined') {
    const { loadStripe } = require('@stripe/stripe-js')
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

function CheckoutForm({ total, onSuccess }) {
  const [processing, setProcessing] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardName, setCardName] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setProcessing(true)
    try {
      // Simulate payment for now - integrate real Stripe later
      await new Promise(resolve => setTimeout(resolve, 2000))
      await onSuccess('simulated_payment_' + Date.now())
    } catch (err) {
      toast.error('Payment failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Card Number</label>
        <input
          className="input"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())}
          required
        />
      </div>
      <div>
        <label className="label">Name on Card</label>
        <input
          className="input"
          placeholder="John Doe"
          value={cardName}
          onChange={e => setCardName(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Expiry Date</label>
          <input
            className="input"
            placeholder="MM/YY"
            value={expiry}
            onChange={e => {
              let val = e.target.value.replace(/\D/g, '').slice(0, 4)
              if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2)
              setExpiry(val)
            }}
            required
          />
        </div>
        <div>
          <label className="label">CVV</label>
          <input
            className="input"
            placeholder="123"
            value={cvv}
            onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
            required
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={processing}
        className="btn-primary w-full flex items-center justify-center gap-2 text-base mt-4"
      >
        <Lock className="w-4 h-4" />
        {processing ? 'Processing Payment...' : `Pay ${formatPrice(total)}`}
      </button>
      <p className="text-xs text-ink-400 text-center flex items-center gap-1 justify-center">
        <Lock className="w-3 h-3" /> Your payment is secured with 256-bit SSL encryption
      </p>
    </form>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, subtotal, tax, shipping, total, clearCart } = useCartStore()

  const [step, setStep] = useState(1)
  const [createdOrderId, setCreatedOrderId] = useState(null)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'IN',
  })

  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleContinueToPayment = async () => {
    if (!form.name || !form.email || !form.street || !form.city || !form.zip) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    try {
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            product: i.productId,
            productName: i.productName,
            productImage: i.productImage,
            quantity: i.quantity,
            size: i.size,
            paper: i.paper,
            finish: i.finish,
            turnaround: i.turnaround,
            turnaroundDays: i.turnaroundDays,
            uploadedFileName: i.uploadedFileName,
            unitPrice: i.unitPrice,
            totalPrice: i.totalPrice,
            customNotes: i.customNotes,
          })),
          subtotal,
          tax,
          shipping,
          total,
          shippingAddress: {
            name: form.name,
            street: form.street,
            city: form.city,
            state: form.state,
            zip: form.zip,
            country: form.country,
          },
          billingAddress: {
            name: form.name,
            street: form.street,
            city: form.city,
            state: form.state,
            zip: form.zip,
            country: form.country,
          },
          guestEmail: !session ? form.email : undefined,
        }),
      })
      const { order } = await orderRes.json()
      setCreatedOrderId(order._id)
      setStep(2)
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = async (paymentIntentId) => {
    // Update order payment status
    if (createdOrderId) {
      await fetch(`/api/orders/${createdOrderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'confirmed',
          message: 'Payment received successfully',
        }),
      })
    }
    clearCart()
    toast.success('Order placed successfully! 🎉')
    router.push(`/orders/${createdOrderId}?success=true`)
  }

  if (items.length === 0) {
    if (typeof window !== 'undefined') router.push('/cart')
    return null
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="section-title mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-8">
          {['Contact & Shipping', 'Payment'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-brand-500 text-white' : 'bg-ink-200 text-ink-500'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-sm font-medium ${step === i + 1 ? 'text-ink-900' : 'text-ink-400'}`}>{label}</span>
              {i === 0 && <div className="w-16 h-0.5 bg-ink-200 mx-2" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            {step === 1 && (
              <div className="card p-6 space-y-4">
                <h2 className="font-display text-xl font-bold text-ink-900">Contact & Shipping</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="label">Full Name *</label>
                    <input className="input" value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="Your full name" required />
                  </div>
                  <div>
                    <label className="label">Email *</label>
                    <input className="input" type="email" value={form.email} onChange={e => updateForm('email', e.target.value)} placeholder="you@example.com" required />
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input className="input" type="tel" value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="+91 98765 43210" />
                  </div>
                  <div className="col-span-2">
                    <label className="label">Street Address *</label>
                    <input className="input" value={form.street} onChange={e => updateForm('street', e.target.value)} placeholder="House no, Street, Area" required />
                  </div>
                  <div>
                    <label className="label">City *</label>
                    <input className="input" value={form.city} onChange={e => updateForm('city', e.target.value)} placeholder="Mumbai" required />
                  </div>
                  <div>
                    <label className="label">State</label>
                    <input className="input" value={form.state} onChange={e => updateForm('state', e.target.value)} placeholder="Maharashtra" />
                  </div>
                  <div>
                    <label className="label">PIN Code *</label>
                    <input className="input" value={form.zip} onChange={e => updateForm('zip', e.target.value)} placeholder="400001" required />
                  </div>
                  <div>
                    <label className="label">Country</label>
                    <select className="input" value={form.country} onChange={e => updateForm('country', e.target.value)}>
                      <option value="IN">India</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleContinueToPayment}
                  disabled={loading}
                  className="btn-primary w-full mt-4"
                >
                  {loading ? 'Processing...' : 'Continue to Payment'}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="card p-6">
                <h2 className="font-display text-xl font-bold text-ink-900 mb-6">Payment Details</h2>
                <CheckoutForm total={total} onSuccess={handlePaymentSuccess} />
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="card p-5 sticky top-24">
              <h3 className="font-semibold text-ink-900 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-ink-800">{item.productName}</p>
                      <p className="text-ink-500 text-xs">Qty: {item.quantity} {item.size ? `· ${item.size}` : ''}</p>
                    </div>
                    <span className="font-semibold">{formatPrice(item.totalPrice)}</span>
                  </div>
                ))}
              </div>
              <hr className="border-ink-100 mb-3" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-ink-600">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-ink-600">
                  <span>GST (18%)</span><span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-ink-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-600 font-medium">FREE</span> : formatPrice(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-ink-400 bg-ink-50 rounded p-2">
                    Add {formatPrice(5000 - subtotal)} more for free shipping!
                  </p>
                )}
                <hr className="border-ink-100" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-brand-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}