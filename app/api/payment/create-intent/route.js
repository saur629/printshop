import { NextResponse } from 'next/server'
import Stripe from 'stripe'
export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  try {
    const { amount, metadata = {} } = await request.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // paise (INR smallest unit)
      currency: 'inr',                  // Changed to INR
      metadata,
      automatic_payment_methods: { enabled: true },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}