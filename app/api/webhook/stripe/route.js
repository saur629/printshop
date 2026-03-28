import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Order from '@/models/Order'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    await connectDB()

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object
        const orderId = paymentIntent.metadata.orderId
        if (orderId) {
          const order = await Order.findById(orderId)
          if (order) {
            order.paymentStatus = 'paid'
            order.stripePaymentIntentId = paymentIntent.id
            order.status = 'confirmed'
            order.statusHistory.push({
              status: 'confirmed',
              message: 'Payment received. Your order is confirmed!',
            })
            await order.save()
          }
        }
        break
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        const orderId = paymentIntent.metadata.orderId
        if (orderId) {
          await Order.findByIdAndUpdate(orderId, { paymentStatus: 'failed' })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}