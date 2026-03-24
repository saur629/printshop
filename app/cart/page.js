'use client'
import MainLayout from '@/components/layout/MainLayout'
import useCartStore from '@/lib/cartStore'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, tax, shipping, total } = useCartStore()

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-ink-300" />
          <h1 className="font-display text-3xl font-bold text-ink-900 mb-3">Your cart is empty</h1>
          <p className="text-ink-500 mb-8">Looks like you haven't added any products yet.</p>
          <Link href="/products" className="btn-primary text-base">Browse Products</Link>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="section-title mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="card p-5">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-ink-100 rounded-lg flex items-center justify-center text-3xl shrink-0">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover rounded-lg" />
                    ) : '🖨️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-ink-900 mb-1 truncate">{item.productName}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500 mb-3">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.paper && <span>Paper: {item.paper}</span>}
                      {item.finish && <span>Finish: {item.finish}</span>}
                      {item.turnaround && <span>Turnaround: {item.turnaround}</span>}
                      {item.uploadedFileName && <span className="text-green-600">✓ {item.uploadedFileName}</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 25))}
                          className="w-8 h-8 rounded-md border border-ink-200 flex items-center justify-center hover:bg-ink-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-12 text-center font-medium text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 25)}
                          className="w-8 h-8 rounded-md border border-ink-200 flex items-center justify-center hover:bg-ink-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-ink-900">{formatPrice(item.totalPrice)}</span>
                        <button onClick={() => removeItem(item.id)} className="text-ink-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold text-ink-900 mb-5">Order Summary</h2>
              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between text-ink-600">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-ink-600">
                  <span>Tax (8%)</span><span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-ink-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-600 font-medium">FREE</span> : formatPrice(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-ink-400 bg-ink-50 rounded-lg p-2">
                    Add {formatPrice(100 - subtotal)} more for free shipping!
                  </p>
                )}
                <hr className="border-ink-100" />
                <div className="flex justify-between text-lg font-bold text-ink-900">
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>
              <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-2 text-base">
                Checkout <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/products" className="block text-center text-sm text-ink-500 hover:text-ink-700 mt-3">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
