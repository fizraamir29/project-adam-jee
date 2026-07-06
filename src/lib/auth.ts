import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { mockUsersMemory } from './mockDb';
import User from './models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export async function getAuthenticatedUser(req: Request): Promise<AuthUser | null> {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || !decoded.id) return null;

    // Database fallback checks
    if (mongoose.connection.readyState !== 1) {
      const mockUser = mockUsersMemory.find(u => u._id === decoded.id);
      if (mockUser) {
        return {
          id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
          isActive: mockUser.isActive
        };
      }
      return {
        id: decoded.id,
        name: decoded.id === '555555555555555555555555' ? 'Adamjee Admin' : 'Test User',
        email: decoded.email || (decoded.id === '555555555555555555555555' ? 'admin@admin.gmail.com' : 'testuser@gmail.com'),
        role: decoded.id === '555555555555555555555555' ? 'admin' : 'customer',
        isActive: true
      };
    }

    // Connected Mode
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    };
  } catch (err) {
    return null;
  }
}

export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === 'admin';
}
