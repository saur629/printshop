import mongoose from 'mongoose'

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: String,
  productImage: String,
  quantity: { type: Number, required: true },
  size: String,
  paper: String,
  finish: String,
  turnaround: String,
  turnaroundDays: Number,
  uploadedFileUrl: String,
  uploadedFileName: String,
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  customNotes: String,
})

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestEmail: String,
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-production', 'quality-check', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
  }],
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  billingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  paymentMethod: String,
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  stripePaymentIntentId: String,
  stripeChargeId: String,
  estimatedDelivery: Date,
  trackingNumber: String,
  trackingCarrier: String,
  notes: String,
  adminNotes: String,
  proofApproved: { type: Boolean, default: false },
  proofUrl: String,
}, { timestamps: true })

// Auto-generate order number
OrderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments()
    this.orderNumber = `PS-${String(count + 1001).padStart(5, '0')}`
  }
  next()
})

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)
