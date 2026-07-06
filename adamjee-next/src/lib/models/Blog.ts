import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Blog title is required'], trim: true },
  slug: { type: String, unique: true, lowercase: true },
  content: { type: String, required: [true, 'Blog content is required'] },
  author: { type: String, default: 'Admin' },
  image: { type: String, default: '' },
  category: { type: String, default: 'News' },
  excerpt: { type: String, default: '' },
  isPublished: { type: Boolean, default: true },
  publishedAt: { type: Date, default: Date.now },
}, { timestamps: true });

blogSchema.pre('save', function (this: any) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
});

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);
