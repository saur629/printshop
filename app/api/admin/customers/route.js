import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import connectDB from '@/lib/db'
import User from '@/models/User'
import Order from '@/models/Order'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const users = await User.find({ role: 'customer' }).sort({ createdAt: -1 }).select('-password')

    const stats = await Order.aggregate([
      { $group: { _id: '$user', orderCount: { $sum: 1 }, totalSpent: { $sum: '$total' } } }
    ])

    const statsMap = {}
    stats.forEach(s => { if (s._id) statsMap[s._id.toString()] = s })

    const customers = users.map(u => ({
      ...u.toObject(),
      orderCount: statsMap[u._id.toString()]?.orderCount || 0,
      totalSpent: statsMap[u._id.toString()]?.totalSpent || 0,
    }))

    return NextResponse.json({ customers })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}