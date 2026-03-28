import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Product from '@/models/Product'
import mongoose from 'mongoose'
export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  try {
    await connectDB()

    const { id } = params

    // Check if id is a valid MongoDB ObjectId
    const isObjectId = mongoose.Types.ObjectId.isValid(id)

    const product = await Product.findOne({
      $or: [
        ...(isObjectId ? [{ _id: id }] : []),
        { slug: id },
      ],
      active: true,
    })

    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    return NextResponse.json({ product })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB()
    const body = await request.json()
    const product = await Product.findByIdAndUpdate(params.id, body, { new: true })
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    return NextResponse.json({ product })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB()
    await Product.findByIdAndUpdate(params.id, { active: false })
    return NextResponse.json({ message: 'Product deleted' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}