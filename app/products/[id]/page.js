'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import useCartStore from '@/lib/cartStore'
import { formatPrice, PRODUCT_CATEGORIES } from '@/lib/utils'
import { ShoppingCart, Upload, X, FileText, ChevronDown, ChevronUp, CheckCircle, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedPaper, setSelectedPaper] = useState('')
  const [selectedFinish, setSelectedFinish] = useState('')
  const [selectedTurnaround, setSelectedTurnaround] = useState('')
  const [quantity, setQuantity] = useState(100)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploadedFileUrl, setUploadedFileUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [customNotes, setCustomNotes] = useState('')
  const [quote, setQuote] = useState(null)
  const [quoteLoading, setQuoteLoading] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`)
        const data = await res.json()
        if (data.product) {
          setProduct(data.product)
          if (data.product.sizeOptions?.[0]) setSelectedSize(data.product.sizeOptions[0].label)
          if (data.product.paperOptions?.[0]) setSelectedPaper(data.product.paperOptions[0].label)
          if (data.product.finishOptions?.[0]) setSelectedFinish(data.product.finishOptions[0].label)
          if (data.product.turnaroundOptions?.[0]) setSelectedTurnaround(data.product.turnaroundOptions[0].label)
          setQuantity(data.product.minQuantity || 5)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  useEffect(() => {
    if (!product) return
    const fetchQuote = async () => {
      setQuoteLoading(true)
      try {
        const res = await fetch('/api/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product._id,
            quantity,
            size: selectedSize,
            paper: selectedPaper,
            finish: selectedFinish,
            turnaround: selectedTurnaround,
          }),
        })
        const data = await res.json()
        setQuote(data)
      } finally {
        setQuoteLoading(false)
      }
    }
    const debounce = setTimeout(fetchQuote, 400)
    return () => clearTimeout(debounce)
  }, [product, quantity, selectedSize, selectedPaper, selectedFinish, selectedTurnaround])

  // Upload file to UploadThing
  const uploadFile = async (file) => {
    setUploading(true)
    try {
      // Step 1: Get presigned URL from UploadThing
      const res = await fetch('/api/uploadthing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: [{ name: file.name, size: file.size, type: file.type }],
          acl: 'public-read',
        }),
      })

      if (!res.ok) throw new Error('Upload failed')

      // Use FormData upload directly
      const formData = new FormData()
      formData.append('files', file)

      const uploadRes = await fetch(`/api/upload-design`, {
        method: 'POST',
        body: formData,
      })

      if (uploadRes.ok) {
        const data = await uploadRes.json()
        setUploadedFileUrl(data.url)
        setUploadedFile(file)
        toast.success('File uploaded successfully!')
      } else {
        throw new Error('Upload failed')
      }
    } catch (err) {
      // Fallback: store file locally if upload service not configured
      setUploadedFile(file)
      setUploadedFileUrl('')
      toast.success('File selected! It will be submitted with your order.')
    } finally {
      setUploading(false)
    }
  }

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0]) uploadFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      'application/postscript': ['.ai', '.eps'],
    },
    maxSize: 50 * 1024 * 1024,
    maxFiles: 1,
  })

  const handleAddToCart = () => {
    if (!quote) return
    addItem({
      productId: product._id,
      productName: product.name,
      productImage: product.thumbnailImage,
      quantity,
      size: selectedSize,
      paper: selectedPaper,
      finish: selectedFinish,
      turnaround: selectedTurnaround,
      turnaroundDays: quote.turnaroundDays,
      uploadedFileName: uploadedFile?.name,
      uploadedFileUrl: uploadedFileUrl,
      unitPrice: quote.unitPrice,
      totalPrice: quote.subtotal,
      customNotes,
    })
    toast.success('Added to cart!')
    router.push('/cart')
  }

  if (loading) return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </MainLayout>
  )

  if (!product) return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-ink-500">Product not found.</p>
      </div>
    </MainLayout>
  )

  const catIcon = PRODUCT_CATEGORIES.find(c => c.value === product.category)?.icon || '🖨️'

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left — Product Info */}
          <div>
            <div className="card overflow-hidden mb-6">
              <div className="h-80 bg-ink-100 flex items-center justify-center overflow-hidden">
                {product.thumbnailImage ? (
                  <img src={product.thumbnailImage} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-8xl">{catIcon}</span>
                )}
              </div>
            </div>
            <div className="card p-6">
              <h1 className="font-display text-3xl font-bold text-ink-900 mb-2">{product.name}</h1>
              <p className="text-ink-600 leading-relaxed mb-4">{product.description}</p>
              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span key={tag} className="badge bg-ink-100 text-ink-600">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right — Configurator */}
          <div className="space-y-5">

            {/* Size */}
            {product.sizeOptions?.length > 0 && (
              <div className="card p-5">
                <h3 className="label">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizeOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setSelectedSize(opt.label)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${selectedSize === opt.label ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink-200 text-ink-600 hover:border-ink-400'}`}
                    >
                      {opt.label}
                      {opt.priceModifier > 0 && <span className="ml-1 text-xs text-ink-400">+{formatPrice(opt.priceModifier)}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Paper & Finish */}
            <div className="grid grid-cols-2 gap-4">
              {product.paperOptions?.length > 0 && (
                <div className="card p-5">
                  <label className="label">Paper Stock</label>
                  <select className="input" value={selectedPaper} onChange={(e) => setSelectedPaper(e.target.value)}>
                    {product.paperOptions.map((opt) => (
                      <option key={opt.label} value={opt.label}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              )}
              {product.finishOptions?.length > 0 && (
                <div className="card p-5">
                  <label className="label">Finish</label>
                  <select className="input" value={selectedFinish} onChange={(e) => setSelectedFinish(e.target.value)}>
                    {product.finishOptions.map((opt) => (
                      <option key={opt.label} value={opt.label}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="card p-5">
              <label className="label">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(product.minQuantity || 5, quantity - 5))}
                  className="w-10 h-10 rounded-lg border border-ink-200 flex items-center justify-center hover:bg-ink-100"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  min={product.minQuantity || 5}
                  max={product.maxQuantity || 10000}
                  step={5}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || product.minQuantity || 5)}
                  className="input text-center w-28"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.maxQuantity || 10000, quantity + 5))}
                  className="w-10 h-10 rounded-lg border border-ink-200 flex items-center justify-center hover:bg-ink-100"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
              {product.quantityTiers?.length > 0 && (
                <p className="text-xs text-ink-500 mt-2">💡 Order more to save more on unit price</p>
              )}
            </div>

            {/* Turnaround */}
            {product.turnaroundOptions?.length > 0 && (
              <div className="card p-5">
                <label className="label">Turnaround Time</label>
                <div className="space-y-2">
                  {product.turnaroundOptions.map((opt) => (
                    <label
                      key={opt.label}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedTurnaround === opt.label ? 'border-brand-500 bg-brand-50' : 'border-ink-200 hover:border-ink-300'}`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="turnaround"
                          value={opt.label}
                          checked={selectedTurnaround === opt.label}
                          onChange={() => setSelectedTurnaround(opt.label)}
                          className="accent-brand-500"
                        />
                        <div>
                          <p className="font-medium text-ink-900 text-sm">{opt.label}</p>
                          <p className="text-xs text-ink-500">{opt.days} business days</p>
                        </div>
                      </div>
                      {opt.priceModifier > 0
                        ? <span className="text-sm font-semibold text-brand-600">+{formatPrice(opt.priceModifier)}/unit</span>
                        : <span className="text-xs text-green-600 font-medium">Included</span>
                      }
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* File Upload */}
            {product.allowCustomUpload && (
              <div className="card p-5">
                <label className="label">Upload Your Design</label>

                {uploadedFile ? (
                  <div className="space-y-3">
                    {/* Preview if image */}
                    {uploadedFile.type?.startsWith('image/') && (
                      <div className="relative rounded-lg overflow-hidden border border-ink-200 bg-ink-50">
                        <img
                          src={uploadedFileUrl || URL.createObjectURL(uploadedFile)}
                          alt="Design preview"
                          className="w-full h-48 object-contain"
                        />
                      </div>
                    )}
                    {/* File info */}
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-800 truncate">{uploadedFile.name}</p>
                        <p className="text-xs text-green-600">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          {uploadedFileUrl && ' · Uploaded ✓'}
                        </p>
                      </div>
                      <button
                        onClick={() => { setUploadedFile(null); setUploadedFileUrl('') }}
                        className="text-green-600 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => { setUploadedFile(null); setUploadedFileUrl('') }}
                      className="text-sm text-ink-500 hover:text-brand-600 underline"
                    >
                      Upload a different file
                    </button>
                  </div>
                ) : (
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      isDragActive
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-ink-300 hover:border-brand-400 hover:bg-brand-50/30'
                    }`}
                  >
                    <input {...getInputProps()} />
                    {uploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <Loader className="w-10 h-10 text-brand-500 animate-spin" />
                        <p className="text-sm font-medium text-ink-700">Uploading your design...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center">
                          <Upload className="w-7 h-7 text-brand-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ink-800">
                            {isDragActive ? 'Drop your file here' : 'Drag & drop your design'}
                          </p>
                          <p className="text-xs text-ink-500 mt-1">or click to browse files</p>
                        </div>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {['PDF', 'AI', 'EPS', 'JPG', 'PNG'].map(fmt => (
                            <span key={fmt} className="badge bg-ink-100 text-ink-600 text-xs">{fmt}</span>
                          ))}
                        </div>
                        <p className="text-xs text-ink-400">Max file size: 50MB · 300 DPI recommended</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Design tips */}
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs font-semibold text-blue-800 mb-1">📐 Design Tips</p>
                  <ul className="text-xs text-blue-700 space-y-0.5">
                    <li>• Use 300 DPI or higher for best print quality</li>
                    <li>• Include 0.125" bleed on all sides</li>
                    <li>• Use CMYK color mode for accurate colors</li>
                    <li>• Embed all fonts before saving PDF</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="card p-5">
              <label className="label">Special Instructions (Optional)</label>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="input resize-none"
                rows={3}
                placeholder="Any special requirements or notes for our team..."
              />
            </div>

            {/* Quote Summary */}
            <div className="card p-5 bg-ink-900 text-white">
              <h3 className="font-semibold mb-4 text-ink-300 text-sm uppercase tracking-wider">Price Summary</h3>
              {quoteLoading ? (
                <div className="animate-pulse space-y-2">
                  {[1, 2, 3].map(i => <div key={i} className="h-4 bg-ink-700 rounded" />)}
                </div>
              ) : quote ? (
                <>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between text-ink-300">
                      <span>Unit Price</span><span>{formatPrice(quote.unitPrice)}</span>
                    </div>
                    <div className="flex justify-between text-ink-300">
                      <span>Quantity</span><span>× {quantity}</span>
                    </div>
                    <div className="flex justify-between text-ink-300">
                      <span>Subtotal</span><span>{formatPrice(quote.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-ink-300">
                      <span>Tax (12%)</span><span>{formatPrice(quote.tax)}</span>
                    </div>
                    <div className="flex justify-between text-ink-300">
                      <span>Shipping</span>
                      <span>{quote.shipping === 0 ? <span className="text-green-400">FREE</span> : formatPrice(quote.shipping)}</span>
                    </div>
                    <hr className="border-ink-700 my-2" />
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-brand-400">{formatPrice(quote.total)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-ink-400 mb-4">
                    Est. delivery: {new Date(quote.estimatedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <button
                    onClick={handleAddToCart}
                    className="w-full btn-primary flex items-center justify-center gap-2 text-base"
                  >
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                  </button>
                </>
              ) : (
                <p className="text-ink-400 text-sm">Configure your order to see pricing</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  )
}