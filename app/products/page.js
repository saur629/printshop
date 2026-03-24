'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import Link from 'next/link'
import Image from 'next/image'
import { Search, SlidersHorizontal, Star } from 'lucide-react'
import { PRODUCT_CATEGORIES, formatPrice } from '@/lib/utils'

function ProductCard({ product }) {
  return (
    <Link href={`/products/${product._id}`} className="card group hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      <div className="relative h-48 bg-ink-100 overflow-hidden">
        {product.thumbnailImage ? (
          <Image src={product.thumbnailImage} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {PRODUCT_CATEGORIES.find(c => c.value === product.category)?.icon || '🖨️'}
          </div>
        )}
        {product.featured && (
          <span className="absolute top-3 left-3 badge bg-brand-500 text-white">Featured</span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-ink-900 group-hover:text-brand-600 transition-colors leading-tight">{product.name}</h3>
        </div>
        <p className="text-sm text-ink-500 mb-3 line-clamp-2">{product.shortDescription || product.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-ink-400">From</span>
            <p className="font-bold text-brand-600 text-lg">{formatPrice(product.basePrice)}</p>
          </div>
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-1 text-sm text-ink-500">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span>{product.rating?.toFixed(1)}</span>
              <span className="text-ink-400">({product.reviewCount})</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [pagination, setPagination] = useState({})

  const fetchProducts = async (cat, q, page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 12 })
      if (cat && cat !== 'all') params.set('category', cat)
      if (q) params.set('search', q)
      const res = await fetch(`/api/products?${params}`)
      const data = await res.json()
      setProducts(data.products || [])
      setPagination(data.pagination || {})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(selectedCategory, search)
  }, [selectedCategory])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts(selectedCategory, search)
  }

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat)
    router.push(cat === 'all' ? '/products' : `/products?category=${cat}`, { shallow: true })
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title mb-2">All Products</h1>
          <p className="text-ink-500">High-quality printing for every need</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-56 shrink-0">
            <div className="card p-4 sticky top-24">
              <h3 className="font-semibold text-ink-900 mb-3 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Categories
              </h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === 'all' ? 'bg-brand-500 text-white font-medium' : 'text-ink-600 hover:bg-ink-100'}`}
                  >
                    All Products
                  </button>
                </li>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <li key={cat.value}>
                    <button
                      onClick={() => handleCategoryChange(cat.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${selectedCategory === cat.value ? 'bg-brand-500 text-white font-medium' : 'text-ink-600 hover:bg-ink-100'}`}
                    >
                      <span>{cat.icon}</span> {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="input pl-10"
                />
              </div>
              <button type="submit" className="btn-primary !py-3">Search</button>
            </form>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-48 bg-ink-100" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-ink-100 rounded w-3/4" />
                      <div className="h-3 bg-ink-100 rounded w-full" />
                      <div className="h-3 bg-ink-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-ink-500">
                <div className="text-5xl mb-4">🔍</div>
                <p className="font-semibold text-xl mb-2">No products found</p>
                <p>Try a different search or category</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-ink-500 mb-4">{pagination.total} products found</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-ink-400">Loading...</div></div>}>
      <ProductsContent />
    </Suspense>
  )
}
