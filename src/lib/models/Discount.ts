import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema({
  code: { type: String, required: [true, 'Discount code is required'], unique: true, uppercase: true, trim: true },
  type: { type: String, enum: ['percentage', 'fixed_amount', 'free_shipping'], required: true },
  value: { type: Number, required: true, min: 0 },
  minRequirement: { type: Number, default: 0 }, // Minimum cart total needed to apply
  usageLimit: { type: Number, default: null }, // Null means unlimited
  usageCount: { type: Number, default: 0 },
  startsAt: { type: Date, default: Date.now },
  endsAt: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Discount || mongoose.model('Discount', discountSchema);
