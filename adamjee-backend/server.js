import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

// Route Imports
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import chatbotRoutes from './routes/chatbot.js';
import contactRoutes from './routes/contact.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/upload.js';
import User from './models/User.js';

// Config

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Make uploads folder static
import path from 'path';
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Seed admin user helper
const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@admin.gmail.com';
    const adminPassword = 'admin@admin.gmail.com';

    // 1. Remove any other admin users to ensure there is exactly one admin
    await User.deleteMany({ role: 'admin', email: { $ne: adminEmail } });

    // 2. Check if the primary admin user already exists
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      // Create admin user
      admin = new User({
        name: 'Adamjee Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isActive: true,
      });
      await admin.save();
      console.log('✅ Default Admin User created: admin@admin.gmail.com / admin@admin.gmail.com');
    } else {
      // If it exists, update its password to ensure it matches admin@admin.gmail.com
      // and ensure role & isActive are correct
      admin.password = adminPassword;
      admin.role = 'admin';
      admin.isActive = true;
      await admin.save();
      console.log('✅ Admin User password updated/verified in MongoDB: admin@admin.gmail.com / admin@admin.gmail.com');
    }
  } catch (err) {
    console.error('❌ Error seeding admin user:', err.message);
  }
};

// ─── Database Connection ──────────────────────────────────────
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
})
  .then(async () => {
    console.log('✅ MongoDB Connected');
    await seedAdmin();
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.warn('⚠️  Warning: Mongoose connection failed. Running server in local fallback mode.');
  });

// ─── API Routes ───────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// ─── Health Check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Adamjee Computers Backend API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ─── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ─── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║   ADAMJEE COMPUTERS BACKEND API       ║
  ║   Server running on port ${PORT}         ║
  ║   http://localhost:${PORT}/api           ║
  ╚═══════════════════════════════════════╝
  `);
});
