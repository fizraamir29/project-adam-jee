import { ALL_PRODUCTS, NEW_ARRIVALS, BUNDLE_PRODUCTS } from '../data';
import mongoose from 'mongoose';

export let mockUsersMemory = [
  {
    _id: '555555555555555555555555',
    name: 'Adamjee Admin',
    email: 'admin@admin.gmail.com',
    password: 'admin@admin.gmail.com',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: '666666666666666666666666',
    name: 'Test User',
    email: 'testuser@gmail.com',
    password: 'Password123!',
    role: 'customer',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

export let mockProductsMemory = [
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
    description: 'Premium custom built gaming PC.',
    isPublished: true,
    isFeatured: true,
    slug: 'gaming-pc-extreme',
    stock: 12,
    costPerItem: 950,
    barcode: '400123456789',
    vendor: 'ASUS',
    productType: 'Gaming PC',
    trackQuantity: true,
    continueSellingOutOfStock: false,
    weight: 12.5,
    weightUnit: 'kg',
    chargeTax: true
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
    description: 'ASUS ROG Strix Gaming Laptop.',
    isPublished: true,
    isFeatured: true,
    slug: 'asus-rog-laptop',
    stock: 8,
    costPerItem: 1200,
    barcode: '400987654321',
    vendor: 'ASUS',
    productType: 'Gaming Laptop',
    trackQuantity: true,
    continueSellingOutOfStock: false,
    weight: 2.8,
    weightUnit: 'kg',
    chargeTax: true
  },
  ...[
    ...NEW_ARRIVALS,
    ...ALL_PRODUCTS.filter(p => !NEW_ARRIVALS.find(n => n.id === p.id)),
    ...BUNDLE_PRODUCTS.filter(b => !ALL_PRODUCTS.find(p => p.id === b.id) && !NEW_ARRIVALS.find(p => p.id === b.id))
  ].map((p, idx) => ({
    ...p,
    _id: p.id,
    isPublished: true,
    isFeatured: p.tag === 'Hot' || p.tag === 'New',
    slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    stock: 10 + (idx % 15),
    costPerItem: Math.round(p.price * 0.65),
    barcode: `88012345${1000 + idx}`,
    vendor: p.name.split(' ')[0] || 'Generic',
    productType: p.category || 'Electronics',
    trackQuantity: true,
    continueSellingOutOfStock: false,
    weight: 1.5,
    weightUnit: 'kg',
    chargeTax: true
  }))
];

export let mockOrdersMemory = [
  {
    _id: '888888888888888888888888',
    orderId: 'ORD-0001',
    user: '666666666666666666666666',
    total: 1500,
    orderStatus: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'cod',
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(), // 3 days ago
    items: [
      { product: 'na1', name: 'Dell UltraSharp 29" UltraWide LED Monitor', price: 500.00, quantity: 3 }
    ],
    subtotal: 1500,
    shippingCost: 0,
    discount: 0,
    shippingAddress: { fullName: 'Test User', address: 'Mock St', city: 'Karachi', country: 'Pakistan' }
  },
  {
    _id: '999999999999999999999999',
    orderId: 'ORD-0002',
    user: '666666666666666666666666',
    total: 999,
    orderStatus: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
    items: [
      { product: 'na3', name: 'ASUS RTX 4080 Gaming Graphics Card', price: 999.00, quantity: 1 }
    ],
    subtotal: 999,
    shippingCost: 0,
    discount: 0,
    shippingAddress: { fullName: 'Test User', address: 'DHA Phase 6', city: 'Karachi', country: 'Pakistan' }
  }
];

export let mockInvoicesMemory = [
  {
    _id: 'inv11111111111111111111111',
    invoiceId: 'INV-0001',
    customerName: 'Ahmad Khan',
    customerEmail: 'ahmad@example.com',
    customerPhone: '0300-1234567',
    items: [
      { productId: 'na3', name: 'ASUS RTX 4080 Gaming Graphics Card', price: 999.00, cost: 650.00, quantity: 1 }
    ],
    discountType: 'fixed',
    discountValue: 50,
    discountAmount: 50,
    taxRate: 18,
    taxAmount: 170.82,
    subtotal: 999.00,
    total: 1119.82,
    paymentMethod: 'Cash',
    notes: 'Sold at store physically.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString() // 2 days ago
  },
  {
    _id: 'inv22222222222222222222222',
    invoiceId: 'INV-0002',
    customerName: 'Siddique Ahmed',
    customerEmail: 'siddique@example.com',
    customerPhone: '0321-7654321',
    items: [
      { productId: 'na2', name: 'Aftershock Oden Mechanical Gaming Keyboard', price: 500.00, cost: 325.00, quantity: 2 }
    ],
    discountType: 'percentage',
    discountValue: 10,
    discountAmount: 100,
    taxRate: 18,
    taxAmount: 162.00,
    subtotal: 1000.00,
    total: 1062.00,
    paymentMethod: 'Bank Transfer',
    notes: 'Walk-in customer.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString() // 1 day ago
  }
];

export let mockContactsMemory = [
  {
    _id: '777777777777777777777777',
    name: 'John Contact',
    email: 'john.contact@gmail.com',
    phone: '+92 300 1234567',
    subject: 'General Inquiry',
    message: 'Hello, this is a test message to verify database persistence!',
    read: false,
    createdAt: new Date().toISOString()
  }
];

export let mockBlogsMemory = [
  {
    _id: 'blog111111111111111111111',
    id: 'blog111111111111111111111',
    title: 'Top 5 Graphics Cards for Gaming in 2026',
    slug: 'top-5-graphics-cards-for-gaming-in-2026',
    content: 'Choosing the right graphics card is essential for any PC gamer. In this article, we look at the top 5 GPUs available today at Adamjee Computers. From NVIDIA RTX 5080 to AMD Radeon RX 8900, we cover pricing, benchmarks, and performance stats.',
    author: 'Admin',
    image: '',
    category: 'Hardware',
    excerpt: 'We review the top gaming GPUs for 2026.',
    isPublished: true,
    publishedAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
  },
  {
    _id: 'blog222222222222222222222',
    id: 'blog222222222222222222222',
    title: 'Intel vs AMD: Which Processor is Right for You?',
    slug: 'intel-vs-amd-which-processor-is-right-for-you',
    content: 'The CPU war heats up! We break down the performance of the latest Intel Core Ultra 9 and AMD Ryzen 9 chips to help you decide which one to buy for gaming, streaming, or office productivity work.',
    author: 'Admin',
    image: '',
    category: 'Guides',
    excerpt: 'An in-depth processor comparison guide.',
    isPublished: true,
    publishedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  }
];

export let mockDiscountsMemory = [
  {
    _id: 'disc111111111111111111111',
    id: 'disc111111111111111111111',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minRequirement: 100,
    usageLimit: 50,
    usageCount: 15,
    startsAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
    endsAt: null,
    isActive: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString()
  },
  {
    _id: 'disc222222222222222222222',
    id: 'disc222222222222222222222',
    code: 'FREESHIP',
    type: 'free_shipping',
    value: 0,
    minRequirement: 500,
    usageLimit: null,
    usageCount: 8,
    startsAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
    endsAt: null,
    isActive: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString()
  }
];
