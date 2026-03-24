import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/models/User'

export async function POST(request) {
  try {
    await connectDB()
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const exists = await User.findOne({ email })
    if (exists) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const user = await User.create({ name, email, password })

    return NextResponse.json({
      message: 'Account created successfully',
      user: { id: user._id, name: user.name, email: user.email }
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
