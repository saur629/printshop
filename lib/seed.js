// Run with: node lib/seed.js
require('dotenv').config({ path: '.env.local' })
const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1) }

const ProductSchema = new mongoose.Schema({
  name: String, slug: String, description: String, shortDescription: String, category: String,
  images: [String], thumbnailImage: String, basePrice: Number,
  sizeOptions: [{ label: String, priceModifier: Number }],
  quantityTiers: [{ quantity: Number, price: Number }],
  paperOptions: [{ label: String, priceModifier: Number }],
  finishOptions: [{ label: String, priceModifier: Number }],
  turnaroundOptions: [{ label: String, days: Number, priceModifier: Number }],
  allowCustomUpload: Boolean, minQuantity: Number, maxQuantity: Number,
  featured: Boolean, active: Boolean, tags: [String],
  rating: Number, reviewCount: Number,
}, { timestamps: true })

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)

const PRODUCTS = [
  {
    name: 'Premium Business Cards',
    slug: 'premium-business-cards',
    category: 'business-cards',
    shortDescription: 'Thick, luxurious business cards that leave a lasting impression',
    description: 'Make a powerful first impression with our premium business cards. Printed on thick 16pt cardstock with vibrant CMYK colors.',
    basePrice: 350,
    minQuantity: 100,
    maxQuantity: 5000,
    featured: true, active: true,
    tags: ['business', 'networking', 'professional'],
    rating: 4.9, reviewCount: 847,
    sizeOptions: [
      { label: '3.5 x 2 in (Standard)', priceModifier: 0 },
      { label: '3.5 x 2.5 in (Tall)', priceModifier: 20 },
      { label: '2 x 2 in (Square)', priceModifier: 30 },
    ],
    paperOptions: [
      { label: '14pt Cardstock', priceModifier: 0 },
      { label: '16pt Cardstock', priceModifier: 20 },
      { label: '32pt Ultra Thick', priceModifier: 80 },
    ],
    finishOptions: [
      { label: 'Matte', priceModifier: 0 },
      { label: 'Glossy', priceModifier: 15 },
      { label: 'UV Coated', priceModifier: 30 },
    ],
    turnaroundOptions: [
      { label: 'Standard (5-7 days)', days: 7, priceModifier: 0 },
      { label: 'Rush (2-3 days)', days: 3, priceModifier: 100 },
      { label: 'Same Day', days: 1, priceModifier: 250 },
    ],
    quantityTiers: [
      { quantity: 100,  price: 350 },
      { quantity: 250,  price: 280 },
      { quantity: 500,  price: 200 },
      { quantity: 1000, price: 150 },
      { quantity: 2500, price: 100 },
    ],
  },
  {
    name: 'Full Color Flyers',
    slug: 'full-color-flyers',
    category: 'flyers',
    shortDescription: 'Eye-catching flyers for promotions, events, and marketing',
    description: 'High-impact flyers printed in full color on both sides. Perfect for promotions, events, menus, and marketing campaigns.',
    basePrice: 180,
    minQuantity: 100,
    maxQuantity: 10000,
    featured: true, active: true,
    tags: ['marketing', 'promotion', 'events'],
    rating: 4.8, reviewCount: 512,
    sizeOptions: [
      { label: 'A6 (10x15 cm)', priceModifier: 0 },
      { label: 'A5 (15x21 cm)', priceModifier: 40 },
      { label: 'A4 (21x29.7 cm)', priceModifier: 100 },
    ],
    paperOptions: [
      { label: '130gsm Gloss', priceModifier: 0 },
      { label: '170gsm Matte', priceModifier: 20 },
    ],
    finishOptions: [
      { label: 'Glossy', priceModifier: 0 },
      { label: 'Matte', priceModifier: 15 },
    ],
    turnaroundOptions: [
      { label: 'Standard (5-7 days)', days: 7, priceModifier: 0 },
      { label: 'Rush (2-3 days)', days: 3, priceModifier: 80 },
    ],
    quantityTiers: [
      { quantity: 100,  price: 180 },
      { quantity: 250,  price: 130 },
      { quantity: 500,  price: 100 },
      { quantity: 1000, price: 80 },
      { quantity: 5000, price: 60 },
    ],
  },
  {
    name: 'Vinyl Banners',
    slug: 'vinyl-banners',
    category: 'banners',
    shortDescription: 'Durable outdoor vinyl banners with grommets included',
    description: 'Professional-grade vinyl banners for indoor and outdoor use. UV-resistant inks, reinforced edges, and grommets included.',
    basePrice: 899,
    minQuantity: 1,
    maxQuantity: 100,
    featured: true, active: true,
    tags: ['outdoor', 'events', 'signage'],
    rating: 4.9, reviewCount: 334,
    sizeOptions: [
      { label: '2 x 4 ft', priceModifier: 0 },
      { label: '2 x 6 ft', priceModifier: 600 },
      { label: '3 x 6 ft', priceModifier: 1200 },
      { label: '4 x 8 ft', priceModifier: 2200 },
    ],
    paperOptions: [
      { label: '280gsm Vinyl (Standard)', priceModifier: 0 },
      { label: '440gsm Vinyl (Heavy Duty)', priceModifier: 400 },
    ],
    finishOptions: [
      { label: 'Matte', priceModifier: 0 },
      { label: 'Glossy', priceModifier: 150 },
    ],
    turnaroundOptions: [
      { label: 'Standard (5-7 days)', days: 7, priceModifier: 0 },
      { label: 'Rush (2-3 days)', days: 3, priceModifier: 999 },
    ],
    quantityTiers: [
      { quantity: 1,  price: 899 },
      { quantity: 5,  price: 799 },
      { quantity: 10, price: 699 },
    ],
  },
  {
    name: 'Trifold Brochures',
    slug: 'trifold-brochures',
    category: 'brochures',
    shortDescription: 'Professional trifold brochures for your business',
    description: 'Professionally printed trifold brochures ideal for showcasing products, services, or events.',
    basePrice: 450,
    minQuantity: 50,
    maxQuantity: 5000,
    featured: false, active: true,
    tags: ['marketing', 'sales'],
    rating: 4.7, reviewCount: 203,
    sizeOptions: [
      { label: 'A4 Trifold', priceModifier: 0 },
      { label: 'A3 Trifold', priceModifier: 150 },
    ],
    paperOptions: [
      { label: '130gsm Gloss', priceModifier: 0 },
      { label: '170gsm Matte', priceModifier: 30 },
    ],
    finishOptions: [
      { label: 'Glossy', priceModifier: 0 },
      { label: 'Matte', priceModifier: 20 },
    ],
    turnaroundOptions: [
      { label: 'Standard (5-7 days)', days: 7, priceModifier: 0 },
      { label: 'Rush (2-3 days)', days: 3, priceModifier: 150 },
    ],
    quantityTiers: [
      { quantity: 50,   price: 450 },
      { quantity: 100,  price: 380 },
      { quantity: 250,  price: 300 },
      { quantity: 500,  price: 240 },
      { quantity: 1000, price: 180 },
    ],
  },
  {
    name: 'Custom Posters',
    slug: 'custom-posters',
    category: 'posters',
    shortDescription: 'Bold, vibrant posters for any space or occasion',
    description: 'Make a statement with our custom posters. Printed on heavy poster stock with vivid, long-lasting inks.',
    basePrice: 199,
    minQuantity: 10,
    maxQuantity: 1000,
    featured: false, active: true,
    tags: ['decorative', 'marketing', 'events'],
    rating: 4.8, reviewCount: 156,
    sizeOptions: [
      { label: 'A3 (29.7x42 cm)', priceModifier: 0 },
      { label: 'A2 (42x59.4 cm)', priceModifier: 200 },
      { label: 'A1 (59.4x84.1 cm)', priceModifier: 500 },
    ],
    paperOptions: [
      { label: '200gsm Gloss', priceModifier: 0 },
      { label: '250gsm Matte', priceModifier: 30 },
    ],
    finishOptions: [
      { label: 'Glossy', priceModifier: 0 },
      { label: 'Matte', priceModifier: 25 },
    ],
    turnaroundOptions: [
      { label: 'Standard (5-7 days)', days: 7, priceModifier: 0 },
      { label: 'Rush (2-3 days)', days: 3, priceModifier: 120 },
    ],
    quantityTiers: [
      { quantity: 10,  price: 199 },
      { quantity: 25,  price: 169 },
      { quantity: 50,  price: 139 },
      { quantity: 100, price: 109 },
    ],
  },
  {
    name: 'Die-Cut Stickers',
    slug: 'die-cut-stickers',
    category: 'stickers',
    shortDescription: 'Waterproof, cut-to-shape custom stickers',
    description: 'High-quality die-cut stickers cut precisely to your design shape. Waterproof and UV-resistant.',
    basePrice: 199,
    minQuantity: 50,
    maxQuantity: 5000,
    featured: false, active: true,
    tags: ['branding', 'packaging', 'promotional'],
    rating: 4.9, reviewCount: 421,
    sizeOptions: [
      { label: 'Up to 5x5 cm', priceModifier: 0 },
      { label: 'Up to 8x8 cm', priceModifier: 40 },
      { label: 'Up to 10x10 cm', priceModifier: 80 },
    ],
    paperOptions: [
      { label: 'Gloss White Vinyl', priceModifier: 0 },
      { label: 'Matte White Vinyl', priceModifier: 20 },
      { label: 'Clear Vinyl', priceModifier: 40 },
    ],
    finishOptions: [
      { label: 'Standard', priceModifier: 0 },
      { label: 'Laminated (Extra Durable)', priceModifier: 50 },
    ],
    turnaroundOptions: [
      { label: 'Standard (5-7 days)', days: 7, priceModifier: 0 },
      { label: 'Rush (2-3 days)', days: 3, priceModifier: 80 },
    ],
    quantityTiers: [
      { quantity: 50,   price: 199 },
      { quantity: 100,  price: 160 },
      { quantity: 250,  price: 120 },
      { quantity: 500,  price: 90 },
      { quantity: 1000, price: 70 },
    ],
  },
]

async function seed() {
  console.log('🌱 Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected!')
  await Product.deleteMany({})
  console.log('🗑️  Cleared existing products')
  for (const product of PRODUCTS) {
    await Product.create({ ...product, allowCustomUpload: true })
    console.log(`✅ Created: ${product.name}`)
  }
  console.log(`\n🎉 Seeded ${PRODUCTS.length} products with INR pricing!`)
  await mongoose.disconnect()
  process.exit(0)
}

seed().catch(err => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})