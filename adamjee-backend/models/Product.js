import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const variationSchema = new mongoose.Schema({
  label: String, // e.g., "RAM", "Storage"
  options: [{ value: String, priceModifier: Number }],
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Product name is required'], trim: true },
  slug: { type: String, unique: true, lowercase: true },
  code: { type: String, required: true },
  description: { type: String, default: '' },
  shortDescription: { type: String, default: '' },
  price: { type: Number, required: [true, 'Price is required'], min: 0 },
  comparePrice: { type: Number, default: 0 }, // Original price for discounts
  tag: { type: String, enum: ['New', 'Hot', 'Sale', 'Best Seller', ''], default: '' },
  category: {
    type: String,
    required: true,
    enum: ['Desktops', 'Laptops', 'Components', 'Peripherals', 'Accessories', 'Monitors', 'Networking', 'Headphones', 'Earphones', 'Speakers'],
  },
  images: [String],
  variations: [variationSchema],
  specifications: [{ label: String, value: String }],
  stock: { type: Number, default: 0 },
  costPerItem: { type: Number, default: 0 },
  barcode: { type: String, default: '' },
  vendor: { type: String, default: '' },
  productType: { type: String, default: '' },
  trackQuantity: { type: Boolean, default: true },
  continueSellingOutOfStock: { type: Boolean, default: false },
  weight: { type: Number, default: 0 },
  weightUnit: { type: String, default: 'kg' },
  chargeTax: { type: Boolean, default: true },
  isPublished: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  tags: [String],
}, { timestamps: true });

// Auto-generate slug from name
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

// Update average rating when reviews change
productSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) { this.rating = 0; this.numReviews = 0; return; }
  const avg = this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length;
  this.rating = Math.round(avg * 10) / 10;
  this.numReviews = this.reviews.length;
};

export default mongoose.model('Product', productSchema);
