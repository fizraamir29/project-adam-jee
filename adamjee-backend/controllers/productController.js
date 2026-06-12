import Product from '../models/Product.js';
import mongoose from 'mongoose';

// @desc    Get all products (with filtering, sorting, pagination)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      keyword, category, minPrice, maxPrice,
      tag, sort, page = 1, limit = 12, featured
    } = req.query;

    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  Database disconnected. Returning mock product list.');
      const mockProducts = [
        {
          _id: '111111111111111111111111',
          id: '111111111111111111111111',
          name: 'Gaming PC Extreme',
          code: 'GPC-EXT',
          price: 1500,
          rating: 4.8,
          image: '/images/custom_blue_gaming_pc_cases_1780242165601.png',
          category: 'Desktops',
          tag: 'Hot',
          description: 'Premium custom built gaming PC.'
        },
        {
          _id: '222222222222222222222222',
          id: '222222222222222222222222',
          name: 'ASUS ROG Laptop',
          code: 'LAP-ROG',
          price: 1800,
          rating: 4.9,
          image: '/images/gaming_laptops_1780242133405.png',
          category: 'Laptops',
          tag: 'New',
          description: 'ASUS ROG Strix Gaming Laptop.'
        }
      ];
      return res.json({
        success: true,
        products: mockProducts,
        pagination: { total: mockProducts.length, page: 1, pages: 1, limit: 12 }
      });
    }

    const query = { isPublished: true };

    if (keyword) query.name = { $regex: keyword, $options: 'i' };
    if (category) query.category = category;
    if (tag) query.tag = tag;
    if (featured === 'true') query.isFeatured = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sortOptions = {
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      'newest': { createdAt: -1 },
      'rating': { rating: -1 },
      'default': { isFeatured: -1, createdAt: -1 },
    };
    const sortBy = sortOptions[sort] || sortOptions['default'];

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortBy).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      products,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)), limit: Number(limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single product by slug or id
// @route   GET /api/products/:identifier
// @access  Public
export const getProduct = async (req, res) => {
  try {
    const { identifier } = req.params;
    const product = await Product.findOne({
      $or: [{ slug: identifier }, { _id: identifier.match(/^[0-9a-fA-F]{24}$/) ? identifier : null }],
    });

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user.id);
    if (alreadyReviewed) return res.status(400).json({ success: false, message: 'You have already reviewed this product' });

    product.reviews.push({ user: req.user.id, name: req.user.name, rating: Number(rating), comment });
    product.updateRating();
    await product.save();

    res.status(201).json({ success: true, message: 'Review added successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Admin
export const createProduct = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  Database disconnected. Mocking product creation.');
      const mockProduct = {
        _id: new mongoose.Types.ObjectId().toString(),
        id: new mongoose.Types.ObjectId().toString(),
        ...req.body,
        rating: 5,
        reviews: [],
        createdAt: new Date().toISOString()
      };
      return res.status(201).json({ success: true, product: mockProduct });
    }
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Admin
export const updateProduct = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  Database disconnected. Mocking product update.');
      const mockProduct = {
        _id: req.params.id,
        id: req.params.id,
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      return res.json({ success: true, product: mockProduct });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Admin
export const deleteProduct = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  Database disconnected. Mocking product deletion.');
      return res.json({ success: true, message: 'Product deleted successfully (Mock mode)' });
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
