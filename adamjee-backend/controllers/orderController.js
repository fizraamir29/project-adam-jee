import Order from '../models/Order.js';
import mongoose from 'mongoose';

// In-Memory mock orders storage for disconnected MERN stack simulation
let mockOrdersMemory = [
  {
    _id: '888888888888888888888888',
    orderId: 'ORD-12345',
    user: '666666666666666666666666', // linked to default mock customer Test User
    total: 1500,
    orderStatus: 'pending',
    paymentMethod: 'cod',
    createdAt: new Date().toISOString(),
    items: [],
    shippingAddress: { fullName: 'Test User', address: 'Mock St', city: 'Karachi', country: 'Pakistan' }
  }
];

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (supports guest checkout)
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, subtotal, shippingCost, discount, total, notes, guestEmail } = req.body;

    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  Database disconnected. Mocking order creation.');
      const newId = new mongoose.Types.ObjectId().toString();
      const mockOrder = {
        _id: newId,
        orderId: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
        items,
        shippingAddress,
        paymentMethod,
        subtotal,
        shippingCost: shippingCost || 15,
        discount: discount || 0,
        total,
        notes,
        orderStatus: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        user: req.user ? req.user.id : null,
        guestEmail: req.user ? null : guestEmail
      };
      mockOrdersMemory.unshift(mockOrder); // add to beginning
      return res.status(201).json({ success: true, message: 'Order placed successfully (Mock mode)!', order: mockOrder });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const orderData = {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost: shippingCost || 15,
      discount: discount || 0,
      total,
      notes,
    };

    if (req.user) orderData.user = req.user.id;
    else orderData.guestEmail = guestEmail;

    const order = await Order.create(orderData);

    res.status(201).json({ success: true, message: 'Order placed successfully!', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get my orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  Database disconnected. Returning mock user orders.');
      const mockOrders = mockOrdersMemory.filter(o => o.user === req.user.id);
      return res.json({ success: true, orders: mockOrders });
    }

    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images slug');
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single order by orderId
// @route   GET /api/orders/:orderId
// @access  Private
export const getOrder = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  Database disconnected. Returning mock order details.');
      const order = mockOrdersMemory.find(o => o.orderId === req.params.orderId);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      return res.json({ success: true, order });
    }

    const order = await Order.findOne({ orderId: req.params.orderId }).populate('items.product', 'name images slug');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Allow owner or admin to view
    if (order.user?.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Admin
export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  Database disconnected. Returning mock orders list.');
      let filtered = [...mockOrdersMemory];
      if (status) {
        filtered = filtered.filter(o => o.orderStatus === status.toLowerCase());
      }
      return res.json({ success: true, orders: filtered, total: filtered.length });
    }

    const query = status ? { orderStatus: status } : {};

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).populate('user', 'name email'),
      Order.countDocuments(query),
    ]);
    res.json({ success: true, orders, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:orderId/status
// @access  Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, trackingNumber } = req.body;

    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  Database disconnected. Mocking order status update.');
      const index = mockOrdersMemory.findIndex(o => o.orderId === req.params.orderId);
      if (index === -1) return res.status(404).json({ success: false, message: 'Order not found' });
      mockOrdersMemory[index].orderStatus = orderStatus;
      if (trackingNumber) mockOrdersMemory[index].trackingNumber = trackingNumber;
      return res.json({
        success: true,
        message: 'Order status updated! (Mock mode)',
        order: mockOrdersMemory[index]
      });
    }

    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.orderStatus = orderStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (orderStatus === 'delivered') order.deliveredAt = new Date();
    await order.save();

    res.json({ success: true, message: 'Order status updated!', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
