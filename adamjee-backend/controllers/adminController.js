import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import ChatSession from '../models/ChatSession.js';
import mongoose from 'mongoose';

// @desc    Get full admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  Database disconnected. Returning mock dashboard stats.');
      return res.json({
        success: true,
        stats: {
          users: { total: 12, newThisMonth: 3 },
          products: { total: 2, outOfStock: 0 },
          orders: {
            total: 5,
            thisMonth: 2,
            byStatus: { pending: 2, processing: 1, shipped: 1, delivered: 1 },
          },
          revenue: { total: 4800, growth: 22.5 },
          chatbot: { totalSessions: 15, escalated: 4 },
          recentOrders: [
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
          ],
        },
      });
    }

    const [
      totalUsers, newUsersThisMonth,
      totalProducts, outOfStock,
      totalOrders, ordersThisMonth,
      revenueResult, revenueLastMonth,
      pendingOrders, processingOrders, shippedOrders, deliveredOrders,
      totalChatSessions, escalatedChats,
      recentOrders,
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'customer', createdAt: { $gte: thisMonthStart } }),
      Product.countDocuments({ isPublished: true }),
      Product.countDocuments({ stock: 0, isPublished: true }),
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: thisMonthStart } }),
      Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.aggregate([{ $match: { paymentStatus: 'paid', createdAt: { $gte: lastMonthStart, $lt: thisMonthStart } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.countDocuments({ orderStatus: 'pending' }),
      Order.countDocuments({ orderStatus: 'processing' }),
      Order.countDocuments({ orderStatus: 'shipped' }),
      Order.countDocuments({ orderStatus: 'delivered' }),
      ChatSession.countDocuments(),
      ChatSession.countDocuments({ escalatedToHuman: true }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email').select('orderId total orderStatus paymentMethod createdAt'),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;
    const lastMonthRevenue = revenueLastMonth[0]?.total || 0;
    const revenueGrowth = lastMonthRevenue > 0
      ? (((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      stats: {
        users: { total: totalUsers, newThisMonth: newUsersThisMonth },
        products: { total: totalProducts, outOfStock },
        orders: {
          total: totalOrders, thisMonth: ordersThisMonth,
          byStatus: { pending: pendingOrders, processing: processingOrders, shipped: shippedOrders, delivered: deliveredOrders },
        },
        revenue: { total: totalRevenue, growth: revenueGrowth },
        chatbot: { totalSessions: totalChatSessions, escalated: escalatedChats },
        recentOrders,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  Database disconnected. Returning mock users list.');
      const mockUsers = [
        {
          _id: '555555555555555555555555',
          name: 'Adamjee Admin',
          email: 'admin@admin.gmail.com',
          role: 'admin',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          _id: '666666666666666666666666',
          name: 'Test User',
          email: 'testuser@gmail.com',
          role: 'customer',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ];
      return res.json({ success: true, users: mockUsers, total: mockUsers.length });
    }

    const query = search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {};

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).select('-password'),
      User.countDocuments(query),
    ]);

    res.json({ success: true, users, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Toggle user active status (Admin)
// @route   PUT /api/admin/users/:id/toggle
// @access  Admin
export const toggleUserStatus = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  Database disconnected. Returning mock user toggle response.');
      return res.json({
        success: true,
        message: 'User status toggled successfully (Mock mode)',
        user: { _id: req.params.id, name: 'Mock User', email: 'mock@gmail.com', role: 'customer', isActive: false }
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot deactivate admin accounts' });

    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get chat sessions for admin review
// @route   GET /api/admin/chats
// @access  Admin
export const getChatSessions = async (req, res) => {
  try {
    const { page = 1, limit = 20, escalated } = req.query;
    const query = escalated === 'true' ? { escalatedToHuman: true } : {};

    const [sessions, total] = await Promise.all([
      ChatSession.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).populate('user', 'name email'),
      ChatSession.countDocuments(query),
    ]);

    res.json({ success: true, sessions, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
