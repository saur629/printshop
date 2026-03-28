import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import connectDB from '@/lib/db'
import User from '@/models/User'
export const dynamic = 'force-dynamic'

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const { name, phone, street, city, state, zip, country } = await request.json()

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { name, phone, address: { street, city, state, zip, country } },
      { new: true }
    ).select('-password')

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const user = await User.findById(session.user.id).select('-password')
    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}