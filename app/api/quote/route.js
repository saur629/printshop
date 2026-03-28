import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Product from '@/models/Product'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    await connectDB()
    const { productId, quantity, size, paper, finish, turnaround } = await request.json()

    const product = await Product.findById(productId)
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    let unitPrice = product.basePrice

    const sortedTiers = [...product.quantityTiers].sort((a, b) => b.quantity - a.quantity)
    for (const tier of sortedTiers) {
      if (quantity >= tier.quantity) {
        unitPrice = tier.price
        break
      }
    }

    if (size) {
      const sizeOpt = product.sizeOptions.find(s => s.label === size)
      if (sizeOpt) unitPrice += sizeOpt.priceModifier
    }

    if (paper) {
      const paperOpt = product.paperOptions.find(p => p.label === paper)
      if (paperOpt) unitPrice += paperOpt.priceModifier
    }

    if (finish) {
      const finishOpt = product.finishOptions.find(f => f.label === finish)
      if (finishOpt) unitPrice += finishOpt.priceModifier
    }

    let turnaroundDays = 7
    if (turnaround) {
      const turnaroundOpt = product.turnaroundOptions.find(t => t.label === turnaround)
      if (turnaroundOpt) {
        unitPrice += turnaroundOpt.priceModifier
        turnaroundDays = turnaroundOpt.days
      }
    }

    const subtotal = parseFloat((unitPrice * quantity).toFixed(2))
    const tax = parseFloat((subtotal * 0.18).toFixed(2))
    const shipping = subtotal > 5000 ? 0 : 199
    const total = parseFloat((subtotal + tax + shipping).toFixed(2))

    const estimatedDelivery = new Date()
    estimatedDelivery.setDate(estimatedDelivery.getDate() + turnaroundDays + 2)

    return NextResponse.json({
      unitPrice,
      quantity,
      subtotal,
      tax,
      shipping,
      total,
      estimatedDelivery,
      turnaroundDays,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}