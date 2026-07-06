import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema({
  productId: { type: String, default: '' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  cost: { type: Number, default: 0 },
  quantity: { type: Number, required: true, min: 1 },
});

const invoiceSchema = new mongoose.Schema({
  invoiceId: { type: String, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, default: '' },
  customerPhone: { type: String, default: '' },
  items: [invoiceItemSchema],
  discountType: { type: String, enum: ['fixed', 'percentage'], default: 'fixed' },
  discountValue: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  taxRate: { type: Number, default: 0 }, // GST %
  taxAmount: { type: Number, default: 0 },
  subtotal: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, default: 'Cash' },
  notes: { type: String, default: '' },
}, { timestamps: true });

invoiceSchema.pre('save', async function (next) {
  if (!this.invoiceId) {
    try {
      const count = await mongoose.model('Invoice').countDocuments();
      this.invoiceId = `INV-${String(count + 1).padStart(4, '0')}`;
    } catch (err) {
      this.invoiceId = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    }
  }
  next();
});

export default mongoose.model('Invoice', invoiceSchema);
