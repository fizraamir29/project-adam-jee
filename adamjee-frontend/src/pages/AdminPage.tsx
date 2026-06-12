import React, { useState, useEffect } from 'react';
import { useSEO } from '../hooks/useSEO';
import {
  LayoutDashboard, ShoppingBag, Package, Users, MessageSquare,
  BarChart3, Settings, Plus, Pencil, Trash2, Search, Eye,
  TrendingUp, TrendingDown, X, Upload, ChevronDown, LogOut,
  Star, CheckCircle, Clock, Truck, AlertCircle
} from 'lucide-react';
import { Product } from '../types';
import { saveProducts } from '../utils/storage';

const statusColors: Record<string,string> = {
  delivered:  'bg-[#164475]/10 text-[#164475]',
  shipped:    'bg-[#164475]/10 text-[#164475]',
  processing: 'bg-[#164475]/10 text-[#164475]',
  pending:    'bg-[#164475]/10 text-[#164475]',
  cancelled:  'bg-[#0a1b2d]/10 text-[#0a1b2d]',
  active:     'bg-[#164475]/10 text-[#164475]',
  inactive:   'bg-gray-100 text-gray-500',
};

const StatusBadge = ({ s }: { s: string }) => (
  <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusColors[s] ?? 'bg-gray-100 text-gray-500'}`}>{s}</span>
);

/* ─── PRODUCT FORM MODAL ─────────────────────── */
interface ProductFormProps { 
  product?: Partial<Product> & { category?: string; stock?: number; description?: string; _id?: string }; 
  onClose: () => void; 
  onSave: (p: any) => void; 
}

function ProductFormModal({ product, onClose, onSave }: ProductFormProps) {
  const [form, setForm] = useState({
    name: product?.name ?? '',
    code: product?.code ?? '',
    price: product?.price ?? 0,
    comparePrice: (product as any)?.comparePrice ?? 0,
    category: (product as any)?.category ?? 'Peripherals',
    tag: product?.tag ?? '',
    stock: (product as any)?.stock ?? 0,
    description: (product as any)?.description ?? '',
    image: product?.image ?? '',
    additionalImages: product?.additionalImages ?? [],
  });

  const categories = ['Desktops','Laptops','Components','Peripherals','Accessories','Monitors','Networking','Headphones','Earphones','Speakers'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#e2e8f0]">
          <h2 className="text-xl font-bold text-[#0a1b2d]">{product?._id ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#e2e8f0] transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Image Upload */}
          <div className="col-span-2">
            <label className="block text-sm font-bold text-[#0a1b2d] mb-2">Product Images (Upload Multiple)</label>
            <div className="flex items-center gap-3 w-full">
              <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#cbd5e1] rounded-xl py-6 bg-[#f8fafc] hover:bg-[#f1f5f9] cursor-pointer transition-colors">
                <Upload className="w-6 h-6 text-[#64748b] mb-2" />
                <span className="text-sm font-semibold text-[#64748b]">Click to upload from system</span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    files.forEach(file => {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64 = reader.result as string;
                        setForm(prev => {
                          if (!prev.image) return { ...prev, image: base64 };
                          return { ...prev, additionalImages: [...prev.additionalImages, base64] };
                        });
                      };
                      reader.readAsDataURL(file);
                    });
                  }} 
                />
              </label>
            </div>
            
            {/* Image Preview Area */}
            {(form.image || form.additionalImages.length > 0) && (
              <div className="flex flex-wrap gap-3 mt-4">
                {[...(form.image ? [form.image] : []), ...form.additionalImages].map((img, idx) => (
                  <div key={idx} className="relative group w-20 h-20 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] overflow-hidden flex-shrink-0">
                    <img src={img} alt="Preview" className="w-full h-full object-contain" />
                    <button 
                      onClick={() => {
                        if (idx === 0) {
                          const newAdditional = [...form.additionalImages];
                          const newMain = newAdditional.length > 0 ? newAdditional.shift() : '';
                          setForm({ ...form, image: newMain || '', additionalImages: newAdditional });
                        } else {
                          const newAdditional = form.additionalImages.filter((_, i) => i !== idx - 1);
                          setForm({ ...form, additionalImages: newAdditional });
                        }
                      }}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold shadow-md"
                    >
                      ✕
                    </button>
                    {idx === 0 && <span className="absolute bottom-0 left-0 right-0 bg-[#164475] text-white text-[9px] font-bold text-center py-0.5">MAIN</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#0a1b2d] mb-2">Product Name *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full px-4 py-3 border border-[#e2e8f0] rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none" placeholder="ASUS ROG Gaming Mouse..." />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0a1b2d] mb-2">SKU / Code *</label>
              <input value={form.code} onChange={e => setForm({...form, code: e.target.value})}
                className="w-full px-4 py-3 border border-[#e2e8f0] rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none" placeholder="Code ABC-001" />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0a1b2d] mb-2">Category *</label>
              <div className="relative">
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                  className="w-full appearance-none px-4 py-3 border border-[#e2e8f0] rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none bg-white">
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0a1b2d] mb-2">Price (USD) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] font-bold">$</span>
                <input type="number" value={form.price} onChange={e => setForm({...form, price: +e.target.value})}
                  className="w-full pl-7 pr-4 py-3 border border-[#e2e8f0] rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0a1b2d] mb-2">Badge / Tag</label>
              <div className="relative">
                <select value={form.tag} onChange={e => setForm({...form, tag: e.target.value})}
                  className="w-full appearance-none px-4 py-3 border border-[#e2e8f0] rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none bg-white">
                  <option value="">None</option>
                  {['New','Hot','Sale','Best Seller'].map(t => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#0a1b2d] mb-2">Product Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                rows={3} className="w-full px-4 py-3 border border-[#e2e8f0] rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none resize-none"
                placeholder="Describe this product..." />
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-[#e2e8f0]">
          <button onClick={onClose} className="flex-1 py-3 border border-[#e2e8f0] rounded-xl text-sm font-bold text-[#64748b] hover:bg-[#f8fafc] transition-colors">Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }}
            className="flex-1 py-3 bg-[#164475] hover:bg-[#0a1b2d] text-white rounded-xl text-sm font-bold transition-colors">
            {product?._id ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN ADMIN PAGE ────────────────────────── */
const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'products',  icon: ShoppingBag,     label: 'Products' },
  { id: 'orders',    icon: Package,         label: 'Orders' },
  { id: 'messages',  icon: MessageSquare,   label: 'Contact Messages' },
  { id: 'users',     icon: Users,           label: 'Customers' },
];

export default function AdminPage() {
  useSEO({
    title: "Admin Control Panel | Adamjee Computers",
    description: "Secure administrative dashboard for managing products, categories, customer orders, contacts, and users at Adamjee Computers Pakistan.",
    keywords: "admin control, admin panel, dashboard, product management, order management"
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchQ, setSearchQ] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      const user = JSON.parse(userStr);
      if (user.role === 'admin') {
        setIsAuthenticated(true);
        loadData(token);
      }
    }
  }, []);

  const loadData = async (token: string) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const [statsRes, prodRes, ordRes, msgRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/products'),
        fetch('/api/orders', { headers }),
        fetch('/api/contact', { headers }),
        fetch('/api/admin/users', { headers })
      ]);

      const statsData = statsRes.ok ? await statsRes.json() : {};
      const prodData = prodRes.ok ? await prodRes.json() : {};
      const ordData = ordRes.ok ? await ordRes.json() : {};
      const msgData = msgRes.ok ? await msgRes.json() : {};
      const usersData = usersRes.ok ? await usersRes.json() : {};

      setStats(statsData.stats || null);
      setProducts(prodData.products || prodData.data || []);
      setOrders(ordData.orders || ordData.data || []);
      setMessages(msgData.messages || msgData.data || []);
      setUsers(usersData.users || usersData.data || []);

      if (prodRes.ok) {
        saveProducts(prodData.products || prodData.data || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });
      const data = await res.json();
      if (res.ok && data.role === 'admin') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          _id: data._id, name: data.name, email: data.email, role: data.role
        }));
        setIsAuthenticated(true);
        loadData(data.token);
      } else {
        setLoginError(data.message || 'Access denied. Admins only.');
      }
    } catch (err) {
      setLoginError('An error occurred during login.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Delete this product?')) {
      const token = localStorage.getItem('token');
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      loadData(token!);
    }
  };

  const handleSaveProduct = async (form: any) => {
    const token = localStorage.getItem('token');
    if (editingProduct?._id) {
      await fetch(`/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
    } else {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
    }
    setEditingProduct(null);
    loadData(token!);
  };

  const handleMarkMessageRead = async (id: string) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/contact/${id}/read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    loadData(token!);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
          <div className="flex items-center justify-center mx-auto mb-6">
            <div className="bg-[#0a1b2d] p-4 rounded-2xl flex items-center justify-center">
              <img src="/images/Mask group.png" alt="Adamjee Computers" className="h-12 w-auto object-contain" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-[#0a1b2d] mb-2">Admin Login</h2>
          <p className="text-sm text-[#64748b] mb-8">Please sign in to access the control panel</p>
          
          {loginError && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-[#64748b] uppercase tracking-widest mb-2">Email Address</label>
              <input type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required
                className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#164475]"
                placeholder="admin@adamjee.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#64748b] uppercase tracking-widest mb-2">Password</label>
              <input type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required
                className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#164475]"
                placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full py-3.5 bg-[#164475] text-white rounded-xl font-bold hover:bg-[#0a1b2d] transition-colors mt-6">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(o => orderStatusFilter === 'All' || o.orderStatus === orderStatusFilter.toLowerCase());
  const filteredProducts = products.filter(p => !searchQ || p.name.toLowerCase().includes(searchQ.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a1b2d] flex flex-col fixed top-0 left-0 h-full z-40 shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/images/Mask group.png" alt="Adamjee Computers" className="w-10 object-contain" />
            <div>
              <p className="text-white font-bold text-sm leading-tight">Adamjee<br/>Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${
                activeTab === item.id
                  ? 'bg-[#164475] text-white shadow-lg shadow-[#164475]/30'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
              {item.id === 'orders' && orders.filter(o => o.orderStatus === 'pending').length > 0 && <span className="ml-auto bg-[#164475] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center justify-center">{orders.filter(o => o.orderStatus === 'pending').length}</span>}
              {item.id === 'messages' && messages.filter(m => !m.read).length > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center justify-center">{messages.filter(m => !m.read).length}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/60 hover:bg-white/10 hover:text-white transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0a1b2d] capitalize">{activeTab}</h1>
            <p className="text-[#64748b] text-sm mt-0.5">Welcome back, Admin 👋</p>
          </div>
        </div>

        {/* ═══ DASHBOARD ═══ */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-[#64748b]">Total Revenue</span>
                  <div className={`w-10 h-10 bg-[#164475]/5 rounded-xl flex items-center justify-center`}>
                    <TrendingUp className={`w-5 h-5 text-[#164475]`} />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#0a1b2d]">${stats.revenue?.total?.toLocaleString()}</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-[#64748b]">Total Orders</span>
                  <div className={`w-10 h-10 bg-[#f8fafc] rounded-xl flex items-center justify-center`}>
                    <Package className={`w-5 h-5 text-[#164475]`} />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#0a1b2d]">{stats.orders?.total}</div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-[#64748b]">Products</span>
                  <div className={`w-10 h-10 bg-[#164475]/5 rounded-xl flex items-center justify-center`}>
                    <ShoppingBag className={`w-5 h-5 text-[#164475]`} />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#0a1b2d]">{stats.products?.total}</div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-[#64748b]">New Messages</span>
                  <div className={`w-10 h-10 bg-[#164475]/5 rounded-xl flex items-center justify-center`}>
                    <MessageSquare className={`w-5 h-5 text-[#164475]`} />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#0a1b2d]">{messages.filter(m => !m.read).length}</div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-[#0a1b2d]">Recent Orders</h2>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-[#164475] font-semibold hover:underline">View all</button>
                </div>
                {stats.recentOrders?.length === 0 ? (
                  <p className="text-gray-500 text-sm">No orders yet.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentOrders?.map((o: any) => (
                      <div key={o._id} className="flex items-center justify-between py-2 border-b border-[#f1f5f9] last:border-0">
                        <div>
                          <p className="font-bold text-[#0a1b2d] text-sm">{o.orderId}</p>
                          <p className="text-xs text-[#64748b]">{o.user?.name || 'Guest'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#0a1b2d] text-sm">${o.total?.toLocaleString()}</p>
                          <StatusBadge s={o.orderStatus} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══ PRODUCTS ═══ */}
        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none bg-white" />
              </div>
              <button onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
                className="flex items-center gap-2 bg-[#164475] hover:bg-[#0a1b2d] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-[#164475]/20">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                    <tr>{['Product','Code','Price','Tag','Actions'].map(h => (
                      <th key={h} className="text-left text-xs font-bold text-[#64748b] uppercase tracking-widest px-5 py-4">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                    {filteredProducts.map(p => (
                      <tr key={p._id} className="hover:bg-[#fafbfc] transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt={p.name} className="w-12 h-12 object-contain bg-[#f8fafc] rounded-xl border border-[#e2e8f0] p-1" />
                            <p className="font-semibold text-[#0a1b2d] text-sm line-clamp-2 max-w-[200px]">{p.name}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-[#64748b] font-mono">{p.code}</td>
                        <td className="px-5 py-4">
                          <span className="font-extrabold text-[#0a1b2d]">${p.price}</span>
                        </td>
                        <td className="px-5 py-4">
                          {p.tag && <StatusBadge s={p.tag.toLowerCase()} />}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => { setEditingProduct(p); setShowProductForm(true); }}
                              className="w-8 h-8 rounded-lg bg-[#f8fafc] text-[#164475] flex items-center justify-center hover:bg-[#164475] hover:text-white transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteProduct(p._id)}
                              className="w-8 h-8 rounded-lg bg-gray-100 text-[#0a1b2d] flex items-center justify-center hover:bg-[#0a1b2d] hover:text-white transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══ ORDERS ═══ */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex gap-3 mb-6 flex-wrap">
              {['All','Pending','Processing','Shipped','Delivered','Cancelled'].map(s => (
                <button key={s} onClick={() => setOrderStatusFilter(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                    orderStatusFilter === s ? 'bg-[#164475] text-white shadow-lg shadow-[#164475]/20' : 'bg-white border border-[#e2e8f0] text-[#64748b] hover:border-[#164475] hover:text-[#164475]'
                  }`}>{s}</button>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                  <tr>{['Order ID','Customer','Total','Status','Payment','Date'].map(h => (
                    <th key={h} className="text-left text-xs font-bold text-[#64748b] uppercase tracking-widest px-5 py-4">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {filteredOrders.length === 0 && (
                    <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-500">No orders found.</td></tr>
                  )}
                  {filteredOrders.map(o => (
                    <tr key={o._id} className="hover:bg-[#fafbfc] transition-colors">
                      <td className="px-5 py-4 font-bold text-[#0a1b2d] text-sm font-mono">{o.orderId}</td>
                      <td className="px-5 py-4 text-sm text-[#0a1b2d] font-semibold">{o.user?.name || o.guestEmail || 'Guest'}</td>
                      <td className="px-5 py-4 font-extrabold text-[#0a1b2d]">${o.total?.toLocaleString()}</td>
                      <td className="px-5 py-4"><StatusBadge s={o.orderStatus} /></td>
                      <td className="px-5 py-4 text-sm text-[#64748b] capitalize font-medium">{o.paymentMethod}</td>
                      <td className="px-5 py-4 text-sm text-[#64748b]">{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ MESSAGES ═══ */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#f1f5f9]">
              <h2 className="font-bold text-[#0a1b2d]">Contact Form Submissions</h2>
            </div>
            <div className="divide-y divide-[#f1f5f9]">
              {messages.length === 0 && (
                <div className="p-8 text-center text-gray-500">No messages found.</div>
              )}
              {messages.map(msg => (
                <div key={msg._id} className={`p-6 hover:bg-[#fafbfc] transition-colors ${!msg.read ? 'bg-[#164475]/5' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className={`font-bold ${!msg.read ? 'text-[#164475]' : 'text-[#0a1b2d]'}`}>{msg.subject}</h3>
                      <p className="text-sm text-gray-500">From: {msg.name} ({msg.email}) {msg.phone && `• Ph: ${msg.phone}`}</p>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                  {!msg.read && (
                    <button 
                      onClick={() => handleMarkMessageRead(msg._id)}
                      className="mt-4 text-xs font-bold text-[#164475] hover:underline"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ USERS ═══ */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                <tr>{['Name','Email','Role','Status','Joined'].map(h => (
                  <th key={h} className="text-left text-xs font-bold text-[#64748b] uppercase tracking-widest px-5 py-4">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-[#fafbfc] transition-colors">
                    <td className="px-5 py-4 font-bold text-[#0a1b2d] text-sm">{u.name}</td>
                    <td className="px-5 py-4 text-sm text-[#64748b] font-medium">{u.email}</td>
                    <td className="px-5 py-4 text-sm text-[#0a1b2d] capitalize">{u.role}</td>
                    <td className="px-5 py-4"><StatusBadge s={u.isActive !== false ? 'active' : 'inactive'} /></td>
                    <td className="px-5 py-4 text-sm text-[#64748b]">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => { setShowProductForm(false); setEditingProduct(null); }}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}
