import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import connectDB from '@/lib/db'
import Order from '@/models/Order'
import User from '@/models/User'
import Product from '@/models/Product'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const [
      totalOrders,
      monthOrders,
      lastMonthOrders,
      totalRevenue,
      monthRevenue,
      totalCustomers,
      pendingOrders,
      inProductionOrders,
      totalProducts,
      recentOrders,
      revenueByDay,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.aggregate([{ $match: { createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'in-production' }),
      Product.countDocuments({ active: true }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
      Order.aggregate([
        { $match: { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } } },
        { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }},
        { $sort: { _id: 1 } }
      ]),
    ])

    return NextResponse.json({
      stats: {
        totalOrders,
        monthOrders,
        lastMonthOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthRevenue: monthRevenue[0]?.total || 0,
        totalCustomers,
        pendingOrders,
        inProductionOrders,
        totalProducts,
      },
      recentOrders,
      revenueByDay,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}