import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const mockProducts = [
  {
    name: 'Asus ROG Strix G16 (2024)',
    code: 'LAP-ASUS-G16',
    price: 1899,
    comparePrice: 2099,
    category: 'Laptops',
    description: '16" 165Hz FHD Display, Intel Core i7-13650HX, NVIDIA GeForce RTX 4060, 16GB DDR5, 512GB PCIe SSD, Wi-Fi 6E, Windows 11',
    stock: 12,
    tag: 'Best Seller',
    isPublished: true,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'NVIDIA GeForce RTX 4090 24GB',
    code: 'GPU-NV-4090',
    price: 1599,
    comparePrice: 0,
    category: 'Components',
    description: 'NVIDIA Ada Lovelace Architecture, 24GB G6X, 384-bit, 21 Gbps, PCIe 4.0',
    stock: 5,
    tag: 'Hot',
    isPublished: true,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Razer DeathAdder V3 Pro',
    code: 'PER-RAZER-DV3',
    price: 149,
    comparePrice: 169,
    category: 'Peripherals',
    description: 'Ultra-lightweight Wireless Ergonomic Esports Mouse - 63g - Focus Pro 30K Optical Sensor - Fast Optical Switches Gen-3',
    stock: 25,
    tag: 'Sale',
    isPublished: true,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1527814050087-37938154799f?auto=format&fit=crop&w=800&q=80',
  }
];

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected!');

    console.log('Clearing database...');
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 12);
    await User.create({
      name: 'Admin User',
      email: 'admin@adamjee.com',
      password: adminPassword,
      role: 'admin'
    });

    console.log('Seeding products...');
    for (const p of mockProducts) {
      await Product.create(p);
    }

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
