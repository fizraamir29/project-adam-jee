import Order from '../models/Order.js';
import mongoose from 'mongoose';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (supports guest checkout)
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, subtotal, shippingCost, discount, total, notes, guestEmail } = req.body;

    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  Database disconnected. Mocking order creation.');
      const mockOrder = {
        _id: '999999999999999999999999',
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
        createdAt: new Date().toISOString()
      };
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
      const mockOrders = [
        {
          _id: '888888888888888888888888',
          orderId: 'ORD-12345',
          total: 1500,
          orderStatus: 'pending',
          paymentMethod: 'cod',
          createdAt: new Date().toISOString(),
          items: []
        }
      ];
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
      return res.json({
        success: true,
        order: {
          _id: '888888888888888888888888',
          orderId: req.params.orderId,
          total: 1500,
          orderStatus: 'pending',
          paymentMethod: 'cod',
          createdAt: new Date().toISOString(),
          items: [],
          shippingAddress: { address: 'Mock St', city: 'Karachi', country: 'Pakistan' }
        }
      });
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
      const mockOrders = [
        {
          _id: '888888888888888888888888',
          orderId: 'ORD-12345',
          total: 1500,
          orderStatus: 'pending',
          paymentMethod: 'cod',
          createdAt: new Date().toISOString(),
          user: { name: 'Test User', email: 'testuser@gmail.com' }
        },
        {
          _id: '999999999999999999999999',
          orderId: 'ORD-67890',
          total: 1800,
          orderStatus: 'processing',
          paymentMethod: 'card',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          user: { name: 'Adamjee Admin', email: 'admin@admin.gmail.com' }
        }
      ];
      return res.json({ success: true, orders: mockOrders, total: mockOrders.length });
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
      return res.json({
        success: true,
        message: 'Order status updated! (Mock mode)',
        order: { orderId: req.params.orderId, orderStatus, trackingNumber }
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
