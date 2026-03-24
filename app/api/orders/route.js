import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/db'
import Order from '@/models/Order'

export async function GET(request) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    
    let query = {}
    
    // Admin can see all; customer sees only their own
    if (!session || session.user.role !== 'admin') {
      if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      query.user = session.user.id
    }

    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (status) query.status = status

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email')
        .populate('items.product', 'name images')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Order.countDocuments(query),
    ])

    return NextResponse.json({ orders, total, page, pages: Math.ceil(total / limit) })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    const body = await request.json()

    const orderData = {
      ...body,
      user: session?.user?.id || null,
      statusHistory: [{ status: 'pending', message: 'Order placed successfully' }],
    }

    const order = await Order.create(orderData)
    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
