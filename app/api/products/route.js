import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Product from '@/models/Product'
export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    let query = { active: true }

    if (category && category !== 'all') query.category = category
    if (featured === 'true') query.featured = true
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ]
    }

    const [products, total] = await Promise.all([
      Product.find(query).sort({ featured: -1, createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(query),
    ])

    return NextResponse.json({
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()

    // Generate slug from name
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    
    const product = await Product.create({ ...body, slug })
    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
