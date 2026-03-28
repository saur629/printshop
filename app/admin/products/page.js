'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatPrice, PRODUCT_CATEGORIES } from '@/lib/utils'
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, Upload, X, Image as ImageIcon, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import { AdminSidebar } from '@/app/admin/page'

const EMPTY_PRODUCT = {
  name: '', description: '', shortDescription: '', category: 'business-cards',
  basePrice: '', minQuantity: 25, maxQuantity: 10000,
  thumbnailImage: '',
  images: [],
  featured: false, allowCustomUpload: true,
  sizeOptions: [{ label: '3.5 x 2 in', priceModifier: 0 }],
  paperOptions: [{ label: '14pt Cardstock', priceModifier: 0 }, { label: '16pt Cardstock', priceModifier: 0.01 }],
  finishOptions: [{ label: 'Matte', priceModifier: 0 }, { label: 'Glossy', priceModifier: 0.005 }],
  turnaroundOptions: [
    { label: 'Standard (5-7 days)', days: 7, priceModifier: 0 },
    { label: 'Rush (2-3 days)', days: 3, priceModifier: 0.02 },
  ],
  quantityTiers: [
    { quantity: 100, price: 350 },
    { quantity: 250, price: 280 },
    { quantity: 500, price: 200 },
    { quantity: 1000, price: 150 },
  ],
  tags: [],
}

// Image Upload Component
function ImageUploader({ value, onChange, label = 'Product Image' }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || '')

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        setPreview(data.url)
        onChange(data.url)
        toast.success('Image uploaded!')
      } else {
        throw new Error('Upload failed')
      }
    } catch (err) {
      toast.error('Upload failed. Try again.')
      setPreview(value || '')
    } finally {
      setUploading(false)
    }
  }, [value, onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 1,
  })

  const handleRemove = () => {
    setPreview('')
    onChange('')
  }

  return (
    <div>
      <label className="label">{label}</label>

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border-2 border-ink-200 group">
          <img
            src={preview}
            alt="Product"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <button
                type="button"
                className="bg-white text-ink-900 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-ink-100"
              >
                <Upload className="w-4 h-4" /> Change
              </button>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-red-600"
            >
              <X className="w-4 h-4" /> Remove
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Loader className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-brand-500 bg-brand-50'
              : 'border-ink-300 hover:border-brand-400 hover:bg-brand-50/30'
          }`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader className="w-8 h-8 text-brand-500 animate-spin" />
              <p className="text-sm text-ink-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-ink-100 rounded-full flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-ink-400" />
              </div>
              <p className="text-sm font-medium text-ink-700">
                {isDragActive ? 'Drop image here' : 'Click or drag image here'}
              </p>
              <p className="text-xs text-ink-400">JPG, PNG, WebP — Max 5MB</p>
            </div>
          )}
        </div>
      )}

      {/* Or paste URL */}
      <div className="mt-2">
        <p className="text-xs text-ink-400 mb-1">Or paste an image URL:</p>
        <input
          type="text"
          className="input text-sm"
          placeholder="https://example.com/image.jpg"
          value={preview.startsWith('/uploads/') || preview === '' ? '' : preview}
          onChange={(e) => {
            setPreview(e.target.value)
            onChange(e.target.value)
          }}
        />
      </div>
    </div>
  )
}

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product || EMPTY_PRODUCT)
  const [saving, setSaving] = useState(false)
  const [tagInput, setTagInput] = useState('')

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))
  const addArrayItem = (field, item) => setForm(prev => ({ ...prev, [field]: [...(prev[field] || []), item] }))
  const removeArrayItem = (field, index) => setForm(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }))
  const updateArrayItem = (field, index, key, value) => {
    const arr = [...form[field]]
    arr[index] = { ...arr[index], [key]: value }
    setForm(prev => ({ ...prev, [field]: arr }))
  }

  const handleSave = async () => {
    if (!form.name || !form.basePrice || !form.description) {
      toast.error('Name, description and base price are required')
      return
    }
    setSaving(true)
    try {
      const url = product?._id ? `/api/products/${product._id}` : '/api/products'
      const method = product?._id ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, basePrice: parseFloat(form.basePrice) }),
      })
      if (res.ok) {
        toast.success(product?._id ? 'Product updated!' : 'Product created!')
        onSave()
        onClose()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to save')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-ink-100">
          <h2 className="font-display text-2xl font-bold text-ink-900">
            {product?._id ? 'Edit Product' : 'New Product'}
          </h2>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-700 text-2xl leading-none">×</button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* IMAGE UPLOAD SECTION */}
          <section>
            <h3 className="font-semibold text-ink-700 mb-4 text-sm uppercase tracking-wider">Product Image</h3>
            <ImageUploader
              value={form.thumbnailImage || ''}
              onChange={(url) => update('thumbnailImage', url)}
              label="Main Product Photo"
            />
          </section>

          {/* BASIC INFO */}
          <section>
            <h3 className="font-semibold text-ink-700 mb-3 text-sm uppercase tracking-wider">Basic Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Product Name *</label>
                <input className="input" value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Premium Business Cards" />
              </div>
              <div>
                <label className="label">Category *</label>
                <select className="input" value={form.category} onChange={e => update('category', e.target.value)}>
                  {PRODUCT_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Base Price (₹ per unit) *</label>
                <input className="input" type="number" step="1" value={form.basePrice} onChange={e => update('basePrice', e.target.value)} placeholder="350" />
              </div>
              <div>
                <label className="label">Min Quantity</label>
                <input className="input" type="number" value={form.minQuantity} onChange={e => update('minQuantity', parseInt(e.target.value))} />
              </div>
              <div>
                <label className="label">Max Quantity</label>
                <input className="input" type="number" value={form.maxQuantity} onChange={e => update('maxQuantity', parseInt(e.target.value))} />
              </div>
              <div className="col-span-2">
                <label className="label">Short Description</label>
                <input className="input" value={form.shortDescription} onChange={e => update('shortDescription', e.target.value)} placeholder="Brief one-liner shown on product cards" />
              </div>
              <div className="col-span-2">
                <label className="label">Full Description *</label>
                <textarea className="input resize-none" rows={3} value={form.description} onChange={e => update('description', e.target.value)} placeholder="Detailed product description..." />
              </div>
              <div className="col-span-2 flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => update('featured', e.target.checked)} className="accent-brand-500 w-4 h-4" />
                  <span className="text-sm font-medium text-ink-700">Featured product</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.allowCustomUpload} onChange={e => update('allowCustomUpload', e.target.checked)} className="accent-brand-500 w-4 h-4" />
                  <span className="text-sm font-medium text-ink-700">Allow file upload</span>
                </label>
              </div>
            </div>
          </section>

          {/* SIZE OPTIONS */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-ink-700 text-sm uppercase tracking-wider">Size Options</h3>
              <button onClick={() => addArrayItem('sizeOptions', { label: '', priceModifier: 0 })} className="text-xs text-brand-600 font-medium">+ Add Size</button>
            </div>
            <div className="space-y-2">
              {form.sizeOptions?.map((opt, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input className="input flex-1" placeholder="e.g. A4" value={opt.label} onChange={e => updateArrayItem('sizeOptions', i, 'label', e.target.value)} />
                  <input className="input w-28" type="number" step="1" placeholder="₹ modifier" value={opt.priceModifier} onChange={e => updateArrayItem('sizeOptions', i, 'priceModifier', parseFloat(e.target.value) || 0)} />
                  <button onClick={() => removeArrayItem('sizeOptions', i)} className="text-red-400 hover:text-red-600 p-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </section>

          {/* PAPER OPTIONS */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-ink-700 text-sm uppercase tracking-wider">Paper Options</h3>
              <button onClick={() => addArrayItem('paperOptions', { label: '', priceModifier: 0 })} className="text-xs text-brand-600 font-medium">+ Add Paper</button>
            </div>
            <div className="space-y-2">
              {form.paperOptions?.map((opt, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input className="input flex-1" placeholder="e.g. 130gsm Gloss" value={opt.label} onChange={e => updateArrayItem('paperOptions', i, 'label', e.target.value)} />
                  <input className="input w-28" type="number" step="1" placeholder="₹ modifier" value={opt.priceModifier} onChange={e => updateArrayItem('paperOptions', i, 'priceModifier', parseFloat(e.target.value) || 0)} />
                  <button onClick={() => removeArrayItem('paperOptions', i)} className="text-red-400 hover:text-red-600 p-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </section>

          {/* FINISH OPTIONS */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-ink-700 text-sm uppercase tracking-wider">Finish Options</h3>
              <button onClick={() => addArrayItem('finishOptions', { label: '', priceModifier: 0 })} className="text-xs text-brand-600 font-medium">+ Add Finish</button>
            </div>
            <div className="space-y-2">
              {form.finishOptions?.map((opt, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input className="input flex-1" placeholder="e.g. Matte" value={opt.label} onChange={e => updateArrayItem('finishOptions', i, 'label', e.target.value)} />
                  <input className="input w-28" type="number" step="1" placeholder="₹ modifier" value={opt.priceModifier} onChange={e => updateArrayItem('finishOptions', i, 'priceModifier', parseFloat(e.target.value) || 0)} />
                  <button onClick={() => removeArrayItem('finishOptions', i)} className="text-red-400 hover:text-red-600 p-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </section>

          {/* TURNAROUND OPTIONS */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-ink-700 text-sm uppercase tracking-wider">Turnaround Options</h3>
              <button onClick={() => addArrayItem('turnaroundOptions', { label: '', days: 7, priceModifier: 0 })} className="text-xs text-brand-600 font-medium">+ Add Option</button>
            </div>
            <div className="space-y-2">
              {form.turnaroundOptions?.map((opt, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input className="input flex-1" placeholder="e.g. Standard (5-7 days)" value={opt.label} onChange={e => updateArrayItem('turnaroundOptions', i, 'label', e.target.value)} />
                  <input className="input w-20" type="number" placeholder="days" value={opt.days} onChange={e => updateArrayItem('turnaroundOptions', i, 'days', parseInt(e.target.value) || 7)} />
                  <input className="input w-28" type="number" step="1" placeholder="₹ modifier" value={opt.priceModifier} onChange={e => updateArrayItem('turnaroundOptions', i, 'priceModifier', parseFloat(e.target.value) || 0)} />
                  <button onClick={() => removeArrayItem('turnaroundOptions', i)} className="text-red-400 hover:text-red-600 p-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </section>

          {/* QUANTITY TIERS */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-ink-700 text-sm uppercase tracking-wider">Quantity Price Tiers (₹)</h3>
              <button onClick={() => addArrayItem('quantityTiers', { quantity: 100, price: 350 })} className="text-xs text-brand-600 font-medium">+ Add Tier</button>
            </div>
            <div className="space-y-2">
              {form.quantityTiers?.map((tier, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <div className="flex-1 flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-ink-400">Min Qty</label>
                      <input className="input" type="number" value={tier.quantity} onChange={e => updateArrayItem('quantityTiers', i, 'quantity', parseInt(e.target.value))} />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-ink-400">Price/unit (₹)</label>
                      <input className="input" type="number" step="1" value={tier.price} onChange={e => updateArrayItem('quantityTiers', i, 'price', parseFloat(e.target.value))} />
                    </div>
                  </div>
                  <button onClick={() => removeArrayItem('quantityTiers', i)} className="text-red-400 hover:text-red-600 p-2 mt-4"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </section>

          {/* TAGS */}
          <section>
            <h3 className="font-semibold text-ink-700 text-sm uppercase tracking-wider mb-3">Tags</h3>
            <div className="flex gap-2 mb-2">
              <input
                className="input flex-1"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    if (tagInput.trim()) { addArrayItem('tags', tagInput.trim()); setTagInput('') }
                  }
                }}
                placeholder="Type tag and press Enter"
              />
              <button
                onClick={() => { if (tagInput.trim()) { addArrayItem('tags', tagInput.trim()); setTagInput('') } }}
                className="btn-outline !py-3 !px-4 text-sm"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags?.map((tag, i) => (
                <span key={i} className="badge bg-brand-100 text-brand-700 flex items-center gap-1">
                  {tag}
                  <button onClick={() => removeArrayItem('tags', i)} className="ml-1 text-brand-500 hover:text-red-500">×</button>
                </span>
              ))}
            </div>
          </section>
        </div>

        <div className="flex gap-3 p-6 border-t border-ink-100">
          <button onClick={onClose} className="btn-outline flex-1">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
            {saving ? 'Saving...' : product?._id ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalProduct, setModalProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'admin') router.push('/')
  }, [status, session])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products?limit=100')
      const data = await res.json()
      setProducts(data.products || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (status === 'authenticated') fetchProducts() }, [status])

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Product deleted'); fetchProducts() }
  }

  const handleToggleActive = async (product) => {
    const res = await fetch(`/api/products/${product._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !product.active }),
    })
    if (res.ok) { toast.success('Product updated'); fetchProducts() }
  }

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-ink-50">
      <AdminSidebar active="/admin/products" />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold text-ink-900">Products</h1>
          <button
            onClick={() => { setModalProduct(null); setShowModal(true) }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        <div className="flex gap-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="input pl-9 w-64"
            />
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 border-b border-ink-200">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-ink-600">Product</th>
                  <th className="text-left px-5 py-3 font-semibold text-ink-600">Category</th>
                  <th className="text-left px-5 py-3 font-semibold text-ink-600">Base Price</th>
                  <th className="text-left px-5 py-3 font-semibold text-ink-600">Status</th>
                  <th className="text-right px-5 py-3 font-semibold text-ink-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-12 text-ink-400">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-ink-400">
                      No products yet.{' '}
                      <button onClick={() => setShowModal(true)} className="text-brand-600 underline">
                        Add your first one.
                      </button>
                    </td>
                  </tr>
                ) : filtered.map((product) => (
                  <tr key={product._id} className="border-b border-ink-100 hover:bg-ink-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {/* Product thumbnail */}
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-ink-100 shrink-0">
                          {product.thumbnailImage ? (
                            <img
                              src={product.thumbnailImage}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">
                              {PRODUCT_CATEGORIES.find(c => c.value === product.category)?.icon || '🖨️'}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-ink-900">{product.name}</p>
                          {product.featured && <span className="text-xs text-brand-600 font-medium">⭐ Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-ink-600 capitalize">{product.category.replace('-', ' ')}</td>
                    <td className="px-5 py-4 font-medium">{formatPrice(product.basePrice)}/unit</td>
                    <td className="px-5 py-4">
                      <span className={`badge ${product.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className="p-1.5 rounded-lg hover:bg-ink-100 text-ink-500"
                          title={product.active ? 'Deactivate' : 'Activate'}
                        >
                          {product.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => { setModalProduct(product); setShowModal(true) }}
                          className="p-1.5 rounded-lg hover:bg-ink-100 text-ink-500"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <ProductModal
            product={modalProduct}
            onClose={() => { setShowModal(false); setModalProduct(null) }}
            onSave={fetchProducts}
          />
        )}
      </main>
    </div>
  )
}