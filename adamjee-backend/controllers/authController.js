import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

// Generate JWT Token
const generateToken = (userId, email) => {
  return jwt.sign({ id: userId, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  Database disconnected. Returning mock register response.');
      const mockId = '666666666666666666666666';
      const token = generateToken(mockId, email);
      return res.status(201).json({
        success: true,
        message: 'Account created successfully (Mock mode)!',
        token,
        _id: mockId,
        name,
        email,
        role: 'customer',
        user: { id: mockId, name, email, role: 'customer' },
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered. Please login instead.' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id, user.email);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  Database disconnected. Returning mock login response.');
      const mockId = email === 'admin@admin.gmail.com' ? '555555555555555555555555' : '666666666666666666666666';
      const mockRole = email === 'admin@admin.gmail.com' ? 'admin' : 'customer';
      const token = generateToken(mockId, email);
      return res.json({
        success: true,
        message: 'Login successful (Mock mode)!',
        token,
        _id: mockId,
        name: email === 'admin@admin.gmail.com' ? 'Adamjee Admin' : 'Test User',
        email,
        role: mockRole,
        user: { id: mockId, name: email === 'admin@admin.gmail.com' ? 'Adamjee Admin' : 'Test User', email, role: mockRole },
      });
    }

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact support.' });
    }

    const token = generateToken(user._id, user.email);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        user: {
          id: req.user.id,
          name: req.user.id === '555555555555555555555555' ? 'Adamjee Admin' : 'Test User',
          email: req.user.email,
          role: req.user.id === '555555555555555555555555' ? 'admin' : 'customer',
          isActive: true
        }
      });
    }

    const user = await User.findById(req.user.id).populate('wishlist', 'name images price');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true, runValidators: true }
    );
    res.json({ success: true, message: 'Profile updated successfully!', user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
