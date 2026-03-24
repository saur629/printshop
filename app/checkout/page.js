'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import useCartStore from '@/lib/cartStore'
import { useSession } from 'next-auth/react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Lock } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

function CheckoutForm({ orderData, total, onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setProcessing(true)
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      })
      if (error) {
        toast.error(error.message)
      } else if (paymentIntent.status === 'succeeded') {
        await onSuccess(paymentIntent.id)
      }
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button type="submit" disabled={!stripe || processing} className="btn-primary w-full flex items-center justify-center gap-2 text-base mt-4">
        <Lock className="w-4 h-4" />
        {processing ? 'Processing...' : `Pay ${formatPrice(total)}`}
      </button>
    </form>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, subtotal, tax, shipping, total, clearCart } = useCartStore()

  const [step, setStep] = useState(1) // 1=info, 2=payment
  const [clientSecret, setClientSecret] = useState(null)
  const [createdOrderId, setCreatedOrderId] = useState(null)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    street: '', city: '', state: '', zip: '', country: 'US',
  })

  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleContinueToPayment = async () => {
    setLoading(true)
    try {
      // Create order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            product: i.productId,
            productName: i.productName,
            productImage: i.productImage,
            quantity: i.quantity,
            size: i.size, paper: i.paper, finish: i.finish, turnaround: i.turnaround,
            turnaroundDays: i.turnaroundDays,
            uploadedFileName: i.uploadedFileName,
            unitPrice: i.unitPrice, totalPrice: i.totalPrice,
            customNotes: i.customNotes,
          })),
          subtotal, tax, shipping, total,
          shippingAddress: { name: form.name, street: form.street, city: form.city, state: form.state, zip: form.zip, country: form.country },
          billingAddress: { name: form.name, street: form.street, city: form.city, state: form.state, zip: form.zip, country: form.country },
          guestEmail: !session ? form.email : undefined,
        }),
      })
      const { order } = await orderRes.json()
      setCreatedOrderId(order._id)

      // Create Stripe payment intent
      const piRes = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total, metadata: { orderId: order._id } }),
      })
      const { clientSecret } = await piRes.json()
      setClientSecret(clientSecret)
      setStep(2)
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = async (paymentIntentId) => {
    clearCart()
    toast.success('Order placed successfully! 🎉')
    router.push(`/orders/${createdOrderId}?success=true`)
  }

  if (items.length === 0) {
    router.push('/cart')
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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-brand-500 text-white' : 'bg-ink-200 text-ink-500'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-sm font-medium ${step === i + 1 ? 'text-ink-900' : 'text-ink-400'}`}>{label}</span>
              {i === 0 && <div className="w-16 h-0.5 bg-ink-200" />}
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
                    <label className="label">Full Name</label>
                    <input className="input" value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="John Doe" required />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input className="input" type="email" value={form.email} onChange={e => updateForm('email', e.target.value)} placeholder="john@example.com" required />
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input className="input" type="tel" value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="+1 555 000 0000" />
                  </div>
                  <div className="col-span-2">
                    <label className="label">Street Address</label>
                    <input className="input" value={form.street} onChange={e => updateForm('street', e.target.value)} placeholder="123 Main St" required />
                  </div>
                  <div>
                    <label className="label">City</label>
                    <input className="input" value={form.city} onChange={e => updateForm('city', e.target.value)} placeholder="New York" required />
                  </div>
                  <div>
                    <label className="label">State</label>
                    <input className="input" value={form.state} onChange={e => updateForm('state', e.target.value)} placeholder="NY" required />
                  </div>
                  <div>
                    <label className="label">ZIP Code</label>
                    <input className="input" value={form.zip} onChange={e => updateForm('zip', e.target.value)} placeholder="10001" required />
                  </div>
                  <div>
                    <label className="label">Country</label>
                    <select className="input" value={form.country} onChange={e => updateForm('country', e.target.value)}>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                    </select>
                  </div>
                </div>
                <button onClick={handleContinueToPayment} disabled={loading || !form.name || !form.email || !form.street} className="btn-primary w-full mt-4">
                  {loading ? 'Processing...' : 'Continue to Payment'}
                </button>
              </div>
            )}

            {step === 2 && clientSecret && (
              <div className="card p-6">
                <h2 className="font-display text-xl font-bold text-ink-900 mb-6">Payment</h2>
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                  <CheckoutForm orderData={form} total={total} onSuccess={handlePaymentSuccess} />
                </Elements>
                <p className="text-xs text-ink-400 mt-4 flex items-center gap-1 justify-center">
                  <Lock className="w-3 h-3" /> Secured by Stripe. Your payment info is never stored on our servers.
                </p>
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
                      <p className="text-ink-500 text-xs">Qty: {item.quantity} · {item.size}</p>
                    </div>
                    <span className="font-semibold">{formatPrice(item.totalPrice)}</span>
                  </div>
                ))}
              </div>
              <hr className="border-ink-100 mb-3" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-ink-600"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-ink-600"><span>Tax</span><span>{formatPrice(tax)}</span></div>
                <div className="flex justify-between text-ink-600"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
                <hr className="border-ink-100" />
                <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-brand-600">{formatPrice(total)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
