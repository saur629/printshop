import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Product from '@/models/Product'
import mongoose from 'mongoose'

export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  try {
    const db = await connectDB()

    // If DB not connected return error
    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 })
    }

    const { id } = await params

    console.log('Looking for product with id:', id)

    // Search by both _id and slug
    const query = mongoose.Types.ObjectId.isValid(id)
      ? { $or: [{ _id: new mongoose.Types.ObjectId(id) }, { slug: id }] }
      : { slug: id }

    console.log('Query:', JSON.stringify(query))

    // First try WITH active filter
    let product = await Product.findOne({ ...query, active: true })

    // If not found try WITHOUT active filter
    if (!product) {
      console.log('Not found with active:true, trying without...')
      product = await Product.findOne(query)
    }

    console.log('Found product:', product ? product.name : 'null')

    if (!product) {
      // List all products for debugging
      const allProducts = await Product.find({}).select('name slug _id active')
      console.log('All products in DB:', JSON.stringify(allProducts))
      return NextResponse.json({
        error: 'Product not found',
        searchedFor: id,
        productsInDB: allProducts,
      }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
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