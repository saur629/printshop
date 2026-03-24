import mongoose from "mongoose";

const SizeOptionSchema = new mongoose.Schema({
  label: { type: String, required: true }, // e.g., "3.5 x 2 in"
  width: Number,
  height: Number,
  unit: { type: String, default: "in" },
  priceModifier: { type: Number, default: 0 }, // added to base price
});

const QuantityTierSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // price per unit
});

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    category: {
      type: String,
      enum: [
        "business-cards",
        "flyers",
        "banners",
        "brochures",
        "posters",
        "stickers",
        "envelopes",
        "notebooks",
        "other",
      ],
      required: true,
    },
    images: [{ type: String }],
    thumbnailImage: { type: String },
    basePrice: { type: Number, required: true },
    sizeOptions: [SizeOptionSchema],
    quantityTiers: [QuantityTierSchema],
    paperOptions: [
      {
        label: String,
        priceModifier: { type: Number, default: 0 },
      },
    ],
    finishOptions: [
      {
        label: String, // Matte, Glossy, UV Coated
        priceModifier: { type: Number, default: 0 },
      },
    ],
    turnaroundOptions: [
      {
        label: String, // Standard (5-7 days), Rush (2-3 days), Same Day
        days: Number,
        priceModifier: { type: Number, default: 0 },
      },
    ],
    allowCustomUpload: { type: Boolean, default: true },
    allowCustomSize: { type: Boolean, default: false },
    minQuantity: { type: Number, default: 25 },
    maxQuantity: { type: Number, default: 10000 },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    tags: [String],
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
