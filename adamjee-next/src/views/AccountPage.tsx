'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { LogOut, Package, Heart, MapPin, User, ChevronRight, Bell, LayoutDashboard, Clock, Mail, ShieldCheck, ShoppingCart, Trash2, X, AlertCircle } from 'lucide-react';
import { getProducts, getWishlist, toggleWishlist } from '../utils/storage';

import { Product } from '../types';

interface AccountPageProps {
  handleAddToCart: (product: Product) => void;
  formatPrice: (usdAmount: number) => string;
}

type Tab = 'dashboard' | 'orders' | 'wishlist' | 'addresses' | 'notifications';

export default function AccountPage({ handleAddToCart, formatPrice }: AccountPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [notifications, setNotifications] = useState<any[]>([
    {
      id: 'global-1',
      title: 'Welcome to Adamjee Computers!',
      message: 'Thank you for creating an account with us. Build your custom dream PC and explore our shop!',
      date: new Date().toLocaleDateString(),
      read: false,
      type: 'info'
    },
    {
      id: 'global-2',
      title: 'Active Season Sale 🌟',
      message: 'Get up to 20% discount on all gaming headsets and gaming accessories. Use promo code: ADAMJEE20.',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString(),
      read: false,
      type: 'promo'
    }
  ]);

  // Fetch initial profile & orders
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const [userRes, ordersRes] = await Promise.all([
          fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/orders/my', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (!userRes.ok) throw new Error('Failed to fetch user');
        const userData = await userRes.json();
        setUser(userData.user || userData.data);

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          // Correct key returned by controller is 'orders', not 'data'
          setOrders(ordersData.orders || []);
        }
      } catch (error) {
        console.error('Error fetching account data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Load wishlist products
  useEffect(() => {
    const list = getWishlist();
    const allProds = getProducts();
    const filtered = allProds.filter(p => list.includes(p.id || p._id || ''));
    setWishlistItems(filtered);
  }, [activeTab]);

  // Dynamically populate order notifications
  useEffect(() => {
    if (orders.length > 0) {
      const orderNotifications = orders.map((order) => ({
        id: `order-notif-${order._id}`,
        title: `Order Update: ${order.orderId}`,
        message: `Your order containing ${order.items?.length || 0} item(s) is in "${order.orderStatus.toUpperCase()}" status. Delivery is estimated in 3-5 business days.`,
        date: new Date(order.createdAt).toLocaleDateString(),
        read: false,
        type: 'order'
      }));

      setNotifications(prev => {
        const cleanPrev = prev.filter(n => typeof n.id !== 'string' || !n.id.startsWith('order-notif-'));
        return [...cleanPrev, ...orderNotifications];
      });
    }
  }, [orders]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleRemoveFromWishlist = (productId: string) => {
    toggleWishlist(productId);
    setWishlistItems(prev => prev.filter(p => (p.id || p._id) !== productId));
  };

  const handleMarkAsRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#fafbfc] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#164475] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getOrderStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-50 text-green-700 border border-green-200';
      case 'processing': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'shipped': return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border border-red-200';
      default: return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* Top Welcome Banner */}
            <div className="bg-gradient-to-r from-[#0a1b2d] to-[#164475] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center text-3xl font-black">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">Hello, {user?.name}!</h2>
                    <p className="text-white/60 text-xs mt-1">Account Level: Standard Customer</p>
                    <p className="text-white/80 text-sm mt-0.5">{user?.email}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-white/10 transition-colors">
                  <LogOut className="w-4.5 h-4.5" /> Logout
                </button>
              </div>
            </div>

            {/* Statistics Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <button onClick={() => setActiveTab('orders')} className="bg-white p-6 rounded-3xl border border-gray-150 flex items-center gap-4 hover:shadow-lg transition-all text-left">
                <div className="w-12 h-12 rounded-2xl bg-[#164475]/10 text-[#164475] flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-2xl text-[#0a1b2d] leading-none mb-1">{orders.length}</h3>
                  <p className="text-xs text-[#64748b] font-semibold">Total Orders</p>
                </div>
              </button>

              <button onClick={() => setActiveTab('wishlist')} className="bg-white p-6 rounded-3xl border border-gray-150 flex items-center gap-4 hover:shadow-lg transition-all text-left">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-2xl text-[#0a1b2d] leading-none mb-1">{wishlistItems.length}</h3>
                  <p className="text-xs text-[#64748b] font-semibold">Items in Wishlist</p>
                </div>
              </button>

              <button onClick={() => setActiveTab('notifications')} className="bg-white p-6 rounded-3xl border border-gray-150 flex items-center gap-4 hover:shadow-lg transition-all text-left">
                <div className="w-12 h-12 rounded-2xl bg-blue-55/10 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-2xl text-[#0a1b2d] leading-none mb-1">{notifications.filter(n => !n.read).length}</h3>
                  <p className="text-xs text-[#64748b] font-semibold">Unread Notifications</p>
                </div>
              </button>

            </div>

            {/* Recent Order & Recent Updates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Recent Orders Overview */}
              <div className="bg-[#fafbfc] border border-gray-150 rounded-3xl p-6">
                <h3 className="font-black text-[#0a1b2d] text-lg mb-4 flex items-center justify-between">
                  <span>Recent Order</span>
                  <button onClick={() => setActiveTab('orders')} className="text-[#164475] text-xs font-bold hover:underline flex items-center gap-1">All Orders <ChevronRight className="w-3.5 h-3.5" /></button>
                </h3>

                {orders.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                    <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm font-medium">No orders placed yet.</p>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-[#0a1b2d] text-sm">{orders[0].orderId}</p>
                        <p className="text-xs text-[#64748b] font-medium mt-0.5">{new Date(orders[0].createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${getOrderStatusColor(orders[0].orderStatus)}`}>
                        {orders[0].orderStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 border-t border-b border-gray-100 py-3">
                      <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl p-1 flex-shrink-0 flex items-center justify-center">
                        <img src={orders[0].items[0]?.image} alt={orders[0].items[0]?.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#0a1b2d] truncate">{orders[0].items[0]?.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {orders[0].items.length > 1 ? `and ${orders[0].items.length - 1} other item(s)` : `Qty: ${orders[0].items[0]?.quantity}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total amount</p>
                        <p className="font-extrabold text-[#164475] text-base">{formatPrice(orders[0].total)}</p>
                      </div>
                      <button onClick={() => setSelectedOrder(orders[0])} className="bg-[#0a1b2d] hover:bg-[#164475] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Announcements / Notifications Block */}
              <div className="bg-[#fafbfc] border border-gray-150 rounded-3xl p-6">
                <h3 className="font-black text-[#0a1b2d] text-lg mb-4 flex items-center justify-between">
                  <span>Announcements</span>
                  <button onClick={() => setActiveTab('notifications')} className="text-[#164475] text-xs font-bold hover:underline flex items-center gap-1">All Notices <ChevronRight className="w-3.5 h-3.5" /></button>
                </h3>

                <div className="space-y-3">
                  {notifications.slice(0, 2).map((notif) => (
                    <div key={notif.id} className={`bg-white border rounded-2xl p-4 shadow-sm relative transition-all ${!notif.read ? 'border-blue-150 bg-blue-50/5' : 'border-gray-150'}`}>
                      {!notif.read && <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />}
                      <h4 className="text-xs font-bold text-[#0a1b2d] pr-4">{notif.title}</h4>
                      <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">{notif.message}</p>
                      <p className="text-[9px] text-gray-400 font-bold mt-2">{notif.date}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        );
      case 'orders':
        return (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-black text-[#0a1b2d]">Order History</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-20 text-gray-400 bg-[#fafbfc] rounded-3xl border border-dashed border-gray-250">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-bold text-[#0a1b2d] mb-1">No Orders Found</p>
                <p className="text-sm max-w-sm mx-auto mb-6">Looks like you haven't placed any orders yet. Visit our shop to explore custom setups!</p>
                <Link href="/" className="inline-flex items-center gap-2 bg-[#164475] hover:bg-[#0a1b2d] text-white font-bold px-6 py-3 rounded-full text-xs transition-all shadow-md">
                  Browse Shop
                </Link>
              </div>
            ) : (
              <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#f8fafc] text-[#64748b] text-xs font-bold tracking-wider uppercase border-b border-gray-150">
                      <tr>
                        <th className="p-5">Order ID</th>
                        <th className="p-5">Date</th>
                        <th className="p-5">Status</th>
                        <th className="p-5">Total</th>
                        <th className="p-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 text-[#0a1b2d] text-sm font-medium">
                      {orders.map((order: any) => (
                        <tr key={order._id} className="hover:bg-[#fafbfc] transition-colors">
                          <td className="p-5 font-mono text-[#0a1b2d] font-bold">{order.orderId}</td>
                          <td className="p-5 text-gray-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="p-5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${getOrderStatusColor(order.orderStatus)}`}>
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="p-5 font-extrabold text-[#164475]">{formatPrice(order.total)}</td>
                          <td className="p-5 text-right">
                            <button onClick={() => setSelectedOrder(order)} className="text-[#164475] hover:text-[#0d2a52] font-black text-xs">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      case 'wishlist':
        return (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-black text-[#0a1b2d]">My Wishlist</h2>
            
            {wishlistItems.length === 0 ? (
              <div className="text-center py-20 text-gray-400 bg-[#fafbfc] rounded-3xl border border-dashed border-gray-250">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-bold text-[#0a1b2d] mb-1">Your Wishlist is Empty</p>
                <p className="text-sm max-w-sm mx-auto mb-6">Explore our catalog and click the heart icon on your favorite setups to save them here.</p>
                <Link href="/" className="inline-flex items-center gap-2 bg-[#164475] hover:bg-[#0a1b2d] text-white font-bold px-6 py-3 rounded-full text-xs transition-all shadow-md">
                  Explore Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {wishlistItems.map(item => (
                  <div key={item.id || item._id} className="flex gap-4 p-5 border border-gray-150 rounded-3xl items-center bg-white shadow-sm hover:shadow-md transition-shadow relative group">
                    
                    <button 
                      onClick={() => handleRemoveFromWishlist(item.id || item._id || '')}
                      className="absolute top-4 right-4 w-7 h-7 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-2xl p-2 flex-shrink-0 flex items-center justify-center">
                      <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{item.category}</span>
                      <h4 className="font-extrabold text-[#0a1b2d] text-sm truncate leading-snug mt-0.5">{item.name}</h4>
                      <p className="text-[#164475] font-extrabold text-sm mt-1">{formatPrice(item.price)}</p>
                    </div>

                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="bg-[#164475] text-[#03152a] font-bold p-3 rounded-2xl hover:bg-[#164475]/90 flex items-center justify-center flex-shrink-0"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'addresses':
        return (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-black text-[#0a1b2d]">Saved Addresses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-6 border-2 border-[#164475] rounded-3xl bg-[#f8fafc] relative shadow-sm">
                <span className="absolute top-6 right-6 bg-[#164475] text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Default</span>
                <h4 className="font-extrabold text-[#0a1b2d] mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#164475]" /> Home Address
                </h4>
                <div className="text-gray-500 text-sm leading-relaxed space-y-1">
                  <p className="font-bold text-[#0a1b2d]">{user?.name}</p>
                  <p>{user?.email}</p>
                  <p>DHA Phase 6, Street 4, House 12A</p>
                  <p>Karachi, Pakistan</p>
                </div>
                <div className="mt-6 flex gap-4 text-xs font-bold border-t border-gray-150 pt-4">
                  <button className="text-[#164475] hover:underline">Edit Address</button>
                  <button className="text-[#0a1b2d] hover:underline">Delete</button>
                </div>
              </div>

              <button className="p-6 border-2 border-dashed border-gray-250 rounded-3xl flex flex-col items-center justify-center text-[#64748b] hover:border-[#164475] hover:text-[#164475] transition-all min-h-[200px] bg-white group">
                <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">+</span>
                <span className="font-extrabold text-xs uppercase tracking-wider">Add New Address</span>
              </button>

            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-black text-[#0a1b2d]">Company Announcements</h2>
            
            <div className="space-y-4">
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  onClick={() => handleMarkAsRead(notif.id)}
                  className={`p-6 border rounded-3xl shadow-sm relative transition-all cursor-pointer flex gap-4 items-start ${
                    !notif.read 
                      ? 'border-blue-150 bg-blue-50/5' 
                      : 'border-gray-150 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    notif.type === 'promo' ? 'bg-purple-50 text-purple-700' :
                    notif.type === 'order' ? 'bg-[#164475]/10 text-[#164475]' : 'bg-blue-50 text-blue-700'
                  }`}>
                    <Bell className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-[#0a1b2d] leading-snug">{notif.title}</h4>
                      {!notif.read && (
                        <span className="bg-blue-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">New</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed font-medium">{notif.message}</p>
                    <p className="text-[10px] text-gray-400 font-extrabold mt-3 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {notif.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#fafbfc] font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-black text-[#0a1b2d] tracking-tight mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Side navigation panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-150 overflow-hidden sticky top-32 shadow-sm">
              <nav className="flex flex-col">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'orders', label: 'Order History', icon: Package },
                  { id: 'wishlist', label: 'My Wishlist', icon: Heart },
                  { id: 'addresses', label: 'Address Book', icon: MapPin },
                  { id: 'notifications', label: 'Notifications', icon: Bell }
                ].map(item => {
                  const Icon = item.icon;
                  const isNotification = item.id === 'notifications';
                  const unreadCount = notifications.filter(n => !n.read).length;
                  return (
                    <button 
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`px-6 py-4.5 text-left font-bold text-xs uppercase tracking-wider flex items-center gap-3 transition-colors border-l-4 ${
                        activeTab === item.id 
                          ? 'bg-[#f8fafc] border-[#164475] text-[#164475]' 
                          : 'border-transparent text-gray-400 hover:bg-gray-50 hover:text-[#0a1b2d]'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {isNotification && unreadCount > 0 && (
                        <span className="bg-[#164475] text-[#03152a] text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center">{unreadCount}</span>
                      )}
                    </button>
                  );
                })}
                <button 
                  onClick={handleLogout}
                  className="px-6 py-4.5 text-left font-bold text-xs uppercase tracking-wider flex items-center gap-3 text-red-500 hover:bg-red-50 transition-colors border-l-4 border-transparent mt-4 border-t border-gray-100"
                >
                  <LogOut className="w-4.5 h-4.5" /> Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Account details render area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-gray-150 p-6 lg:p-10 shadow-sm min-h-[500px]">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Order Details View Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 animate-zoom-in">
            
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-black text-[#0a1b2d]">Order Details</h2>
                <p className="text-xs text-gray-400 mt-0.5">ID: <span className="font-mono text-[#164475] font-extrabold">{selectedOrder.orderId}</span></p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Order Status & Payment details summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold capitalize ${getOrderStatusColor(selectedOrder.orderStatus)}`}>
                    {selectedOrder.orderStatus}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Date</span>
                  <span className="text-xs font-bold text-[#0a1b2d]">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Payment</span>
                  <span className="text-xs font-bold text-[#0a1b2d] capitalize">{selectedOrder.paymentMethod}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Total Paid</span>
                  <span className="text-xs font-extrabold text-[#164475]">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-[#0a1b2d] uppercase tracking-wider">Ordered Items</h4>
                <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 divide-y divide-gray-100">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 py-3 first:pt-0 last:pb-0 items-center">
                      <div className="w-12 h-12 bg-white border border-gray-150 rounded-xl p-1.5 flex-shrink-0 flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-[#0a1b2d] truncate">{item.name}</h5>
                        <p className="text-[10px] text-gray-400 mt-0.5">Quantity: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-extrabold text-[#164475]">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-[#0a1b2d] uppercase tracking-wider">Shipping Destination</h4>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-sm text-gray-600 space-y-2">
                  <p className="font-extrabold text-[#0a1b2d] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#164475]" /> {selectedOrder.shippingAddress?.fullName}
                  </p>
                  <p className="flex items-center gap-2 text-xs">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode || 'Pakistan'}
                  </p>
                  <p className="flex items-center gap-2 text-xs">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {selectedOrder.guestEmail || user?.email}
                  </p>
                  {selectedOrder.shippingAddress?.phone && (
                    <p className="flex items-center gap-2 text-xs">
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      Ph: {selectedOrder.shippingAddress.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Cost Summary Breakdown */}
              <div className="border-t border-gray-100 pt-5 space-y-2 text-xs font-semibold text-gray-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#0a1b2d]">{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Cost</span>
                  <span className="text-[#0a1b2d]">{formatPrice(selectedOrder.shippingCost || 15)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount Applied</span>
                    <span>-{formatPrice(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-100 pt-3 text-sm font-extrabold text-[#0a1b2d] mt-2">
                  <span>Final Total</span>
                  <span className="text-base text-[#164475]">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
