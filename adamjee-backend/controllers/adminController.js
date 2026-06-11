import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import ChatSession from '../models/ChatSession.js';

// @desc    Get full admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

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
