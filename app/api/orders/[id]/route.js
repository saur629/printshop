import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import connectDB from '@/lib/db'
import Order from '@/models/Order'

export async function GET(request, { params }) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    const order = await Order.findOne({
      $or: [{ _id: params.id }, { orderNumber: params.id }]
    })
      .populate('user', 'name email phone')
      .populate('items.product', 'name images slug')

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    const isOwner = session?.user?.id === order.user?._id?.toString()
    const isAdmin = session?.user?.role === 'admin'
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status, message, trackingNumber, trackingCarrier, adminNotes } = body

    const order = await Order.findById(params.id)
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    if (status && status !== order.status) {
      order.statusHistory.push({ status, message: message || `Status updated to ${status}` })
      order.status = status
    }

    if (trackingNumber) order.trackingNumber = trackingNumber
    if (trackingCarrier) order.trackingCarrier = trackingCarrier
    if (adminNotes) order.adminNotes = adminNotes

    await order.save()
    return NextResponse.json({ order })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}