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
    slug: 'gaming-pc-extreme'
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
    slug: 'asus-rog-laptop'
  }
];

export let mockOrdersMemory = [
  {
    _id: '888888888888888888888888',
    orderId: 'ORD-12345',
    user: '666666666666666666666666',
    total: 1500,
    orderStatus: 'pending',
    paymentMethod: 'cod',
    createdAt: new Date().toISOString(),
    items: [],
    shippingAddress: { fullName: 'Test User', address: 'Mock St', city: 'Karachi', country: 'Pakistan' }
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
