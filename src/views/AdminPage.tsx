import React, { useState, useEffect } from 'react';
import { useSEO } from '../hooks/useSEO';
import {
  LayoutDashboard, ShoppingBag, Package, Users, MessageSquare,
  BarChart3, Settings, Plus, Pencil, Trash2, Search, Eye,
  TrendingUp, TrendingDown, X, Upload, ChevronDown, LogOut,
  Star, CheckCircle, Clock, Truck, AlertCircle, FileText, Printer
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
    costPerItem: (product as any)?.costPerItem ?? 0,
    barcode: (product as any)?.barcode ?? '',
    vendor: (product as any)?.vendor ?? '',
    productType: (product as any)?.productType ?? '',
    trackQuantity: (product as any)?.trackQuantity ?? true,
    continueSellingOutOfStock: (product as any)?.continueSellingOutOfStock ?? false,
    weight: (product as any)?.weight ?? 0,
    weightUnit: (product as any)?.weightUnit ?? 'kg',
    chargeTax: (product as any)?.chargeTax ?? true,
  });

  const categories = ['Desktops','Laptops','Components','Peripherals','Accessories','Monitors','Networking','Headphones','Earphones','Speakers'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#e2e8f0] sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-[#0a1b2d]">{product?._id ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#e2e8f0] transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* General Information Card */}
          <div className="bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0] space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#164475]">General Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Product Title *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-4 py-3 border border-[#e2e8f0] bg-white rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none" placeholder="e.g. ASUS ROG Gaming Mouse" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  rows={3} className="w-full px-4 py-3 border border-[#e2e8f0] bg-white rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none resize-none"
                  placeholder="Describe this product in detail..." />
              </div>
            </div>
          </div>

          {/* Media / Images Card */}
          <div className="bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0] space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#164475]">Media Upload</h3>
            <div>
              <label className="block text-xs font-bold text-[#0a1b2d] mb-2">Product Images (First will be main image)</label>
              <div className="flex items-center gap-3 w-full">
                <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#cbd5e1] rounded-xl py-6 bg-white hover:bg-[#f1f5f9] cursor-pointer transition-colors">
                  <Upload className="w-6 h-6 text-[#64748b] mb-2" />
                  <span className="text-sm font-semibold text-[#64748b]">Upload from computer</span>
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
              
              {(form.image || form.additionalImages.length > 0) && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {[...(form.image ? [form.image] : []), ...form.additionalImages].map((img, idx) => (
                    <div key={idx} className="relative group w-20 h-20 rounded-xl border border-[#e2e8f0] bg-white overflow-hidden flex-shrink-0">
                      <img src={img} alt="Preview" className="w-full h-full object-contain" />
                      <button 
                        type="button"
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
          </div>

          {/* Pricing Section Card */}
          <div className="bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0] space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#164475]">Pricing (Shopify Schema)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Price (Retail USD) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] font-bold">$</span>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: +e.target.value})}
                    className="w-full pl-7 pr-4 py-2.5 border border-[#e2e8f0] bg-white rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Compare-at Price (Original)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] font-bold">$</span>
                  <input type="number" value={form.comparePrice} onChange={e => setForm({...form, comparePrice: +e.target.value})}
                    className="w-full pl-7 pr-4 py-2.5 border border-[#e2e8f0] bg-white rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Cost per Item (Confidential)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] font-bold">$</span>
                  <input type="number" value={form.costPerItem} onChange={e => setForm({...form, costPerItem: +e.target.value})}
                    className="w-full pl-7 pr-4 py-2.5 border border-[#e2e8f0] bg-white rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none" />
                </div>
                {form.price > 0 && (
                  <p className="text-[11px] text-gray-500 mt-1 font-semibold">
                    Margin: {Math.round(((form.price - form.costPerItem) / form.price) * 100)}% | 
                    Markup: {form.costPerItem > 0 ? Math.round(((form.price - form.costPerItem) / form.costPerItem) * 100) : 100}%
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="chargeTax" checked={form.chargeTax} onChange={e => setForm({...form, chargeTax: e.target.checked})}
                className="w-4 h-4 text-[#164475] border-[#cbd5e1] rounded focus:ring-[#164475]" />
              <label htmlFor="chargeTax" className="text-xs font-bold text-[#0a1b2d] cursor-pointer">Charge tax on this product</label>
            </div>
          </div>

          {/* Inventory Section Card */}
          <div className="bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0] space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#164475]">Inventory Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">SKU / Code *</label>
                <input value={form.code} onChange={e => setForm({...form, code: e.target.value})}
                  className="w-full px-4 py-2.5 border border-[#e2e8f0] bg-white rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none" placeholder="Code ABC-001" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Barcode (ISBN, UPC, GTIN)</label>
                <input value={form.barcode} onChange={e => setForm({...form, barcode: e.target.value})}
                  className="w-full px-4 py-2.5 border border-[#e2e8f0] bg-white rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none" placeholder="e.g. 1920392019" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Stock / Quantity Available *</label>
                <input type="number" value={form.stock} onChange={e => setForm({...form, stock: +e.target.value})}
                  className="w-full px-4 py-2.5 border border-[#e2e8f0] bg-white rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none" />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="trackQuantity" checked={form.trackQuantity} onChange={e => setForm({...form, trackQuantity: e.target.checked})}
                  className="w-4 h-4 text-[#164475] border-[#cbd5e1] rounded focus:ring-[#164475]" />
                <label htmlFor="trackQuantity" className="text-xs font-bold text-[#0a1b2d] cursor-pointer">Track inventory quantity</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="continueSelling" checked={form.continueSellingOutOfStock} onChange={e => setForm({...form, continueSellingOutOfStock: e.target.checked})}
                  className="w-4 h-4 text-[#164475] border-[#cbd5e1] rounded focus:ring-[#164475]" />
                <label htmlFor="continueSelling" className="text-xs font-bold text-[#0a1b2d] cursor-pointer">Continue selling when out of stock</label>
              </div>
            </div>
          </div>

          {/* Shipping & Product Organization Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping */}
            <div className="bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0] space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#164475]">Shipping Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Weight</label>
                  <input type="number" step="0.01" value={form.weight} onChange={e => setForm({...form, weight: +e.target.value})}
                    className="w-full px-4 py-2.5 border border-[#e2e8f0] bg-white rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Weight Unit</label>
                  <div className="relative">
                    <select value={form.weightUnit} onChange={e => setForm({...form, weightUnit: e.target.value})}
                      className="w-full appearance-none px-4 py-2.5 border border-[#e2e8f0] bg-white rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none">
                      {['kg','g','lb','oz'].map(u => <option key={u}>{u}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Organization */}
            <div className="bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0] space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#164475]">Product Classification</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Category *</label>
                  <div className="relative">
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                      className="w-full appearance-none px-4 py-2.5 border border-[#e2e8f0] bg-white rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none">
                      {categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Badge Tag</label>
                  <div className="relative">
                    <select value={form.tag} onChange={e => setForm({...form, tag: e.target.value})}
                      className="w-full appearance-none px-4 py-2.5 border border-[#e2e8f0] bg-white rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none">
                      <option value="">None</option>
                      {['New','Hot','Sale','Best Seller'].map(t => <option key={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Vendor / Brand</label>
                  <input value={form.vendor} onChange={e => setForm({...form, vendor: e.target.value})}
                    className="w-full px-4 py-2.5 border border-[#e2e8f0] bg-white rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none" placeholder="e.g. ASUS" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Product Type</label>
                  <input value={form.productType} onChange={e => setForm({...form, productType: e.target.value})}
                    className="w-full px-4 py-2.5 border border-[#e2e8f0] bg-white rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none" placeholder="e.g. Mouse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-[#e2e8f0] sticky bottom-0 bg-white z-10">
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
  { id: 'invoices',  icon: FileText,        label: 'Invoice Generator' },
  { id: 'reports',   icon: BarChart3,       label: 'Reports' },
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
  const [invoices, setInvoices] = useState<any[]>([]);
  
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchQ, setSearchQ] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Detail Modal States
  const [selectedProductDetail, setSelectedProductDetail] = useState<any>(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<any>(null);
  const [selectedInvoiceDetail, setSelectedInvoiceDetail] = useState<any>(null);
  
  // Invoice Generator State
  const [invoiceCustomerName, setInvoiceCustomerName] = useState('');
  const [invoiceCustomerEmail, setInvoiceCustomerEmail] = useState('');
  const [invoiceCustomerPhone, setInvoiceCustomerPhone] = useState('');
  const [invoiceNotes, setInvoiceNotes] = useState('');
  const [invoicePaymentMethod, setInvoicePaymentMethod] = useState('Cash');
  const [invoiceItems, setInvoiceItems] = useState<any[]>([
    { productId: '', name: '', price: 0, cost: 0, quantity: 1 }
  ]);
  const [invoiceDiscountType, setInvoiceDiscountType] = useState<'fixed' | 'percentage'>('fixed');
  const [invoiceDiscountValue, setInvoiceDiscountValue] = useState(0);
  const [invoiceTaxRate, setInvoiceTaxRate] = useState(18); // default 18% GST
  const [showPrintInvoice, setShowPrintInvoice] = useState<any>(null); // holds generated invoice to print
  
  // Reports Tab State
  const [reportSubTab, setReportSubTab] = useState<'inventory' | 'physical' | 'online'>('inventory');

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
      
      const [statsRes, prodRes, ordRes, msgRes, usersRes, invRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/products'),
        fetch('/api/orders', { headers }),
        fetch('/api/contact', { headers }),
        fetch('/api/admin/users', { headers }),
        fetch('/api/invoices', { headers })
      ]);

      const statsData = statsRes.ok ? await statsRes.json() : {};
      const prodData = prodRes.ok ? await prodRes.json() : {};
      const ordData = ordRes.ok ? await ordRes.json() : {};
      const msgData = msgRes.ok ? await msgRes.json() : {};
      const usersData = usersRes.ok ? await usersRes.json() : {};
      const invData = invRes.ok ? await invRes.json() : {};

      setStats(statsData.stats || null);
      setProducts(prodData.products || prodData.data || []);
      setOrders(ordData.orders || ordData.data || []);
      setMessages(msgData.messages || msgData.data || []);
      setUsers(usersData.users || usersData.data || []);
      setInvoices(invData.invoices || []);

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

  const handleDeleteInvoice = async (id: string) => {
    if (window.confirm('Delete this invoice?')) {
      const token = localStorage.getItem('token');
      await fetch(`/api/invoices/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      loadData(token!);
    }
  };

  const handleSaveInvoice = async () => {
    if (!invoiceCustomerName.trim()) {
      alert('Please enter customer name');
      return;
    }
    if (invoiceItems.length === 0 || invoiceItems.some(item => !item.name.trim())) {
      alert('Please add at least one valid item');
      return;
    }

    // Calculations
    const subtotal = invoiceItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discountAmount = 0;
    if (invoiceDiscountType === 'fixed') {
      discountAmount = invoiceDiscountValue;
    } else {
      discountAmount = (subtotal * invoiceDiscountValue) / 100;
    }
    const taxedAmount = subtotal - discountAmount;
    const taxAmount = (taxedAmount * invoiceTaxRate) / 100;
    const total = taxedAmount + taxAmount;

    const invoiceData = {
      customerName: invoiceCustomerName,
      customerEmail: invoiceCustomerEmail,
      customerPhone: invoiceCustomerPhone,
      items: invoiceItems.map(item => ({
        productId: item.productId || '',
        name: item.name,
        price: Number(item.price),
        cost: Number(item.cost),
        quantity: Number(item.quantity)
      })),
      discountType: invoiceDiscountType,
      discountValue: Number(invoiceDiscountValue),
      discountAmount,
      taxRate: Number(invoiceTaxRate),
      taxAmount,
      subtotal,
      total,
      paymentMethod: invoicePaymentMethod,
      notes: invoiceNotes
    };

    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(invoiceData)
      });
      const data = await res.json();
      if (res.ok) {
        // Reset states
        setInvoiceCustomerName('');
        setInvoiceCustomerEmail('');
        setInvoiceCustomerPhone('');
        setInvoiceNotes('');
        setInvoiceDiscountValue(0);
        setInvoiceItems([{ productId: '', name: '', price: 0, cost: 0, quantity: 1 }]);
        loadData(token!);
        
        // Show print layout
        setShowPrintInvoice(data.invoice);
      } else {
        alert(data.message || 'Failed to save invoice');
      }
    } catch (err) {
      alert('Error saving invoice');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string, trackingNumber?: string) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ orderStatus: status, trackingNumber })
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
                            <button onClick={() => setSelectedProductDetail(p)}
                              className="w-8 h-8 rounded-lg bg-[#f8fafc] text-gray-600 flex items-center justify-center hover:bg-gray-200 hover:text-black transition-colors" title="View details">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => { setEditingProduct(p); setShowProductForm(true); }}
                              className="w-8 h-8 rounded-lg bg-[#f8fafc] text-[#164475] flex items-center justify-center hover:bg-[#164475] hover:text-white transition-colors" title="Edit">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteProduct(p._id)}
                              className="w-8 h-8 rounded-lg bg-gray-100 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors" title="Delete">
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
                  <tr>{['Order ID','Customer','Total','Status','Payment','Date','Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-bold text-[#64748b] uppercase tracking-widest px-5 py-4">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {filteredOrders.length === 0 && (
                    <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-500">No orders found.</td></tr>
                  )}
                  {filteredOrders.map(o => (
                    <tr key={o._id} className="hover:bg-[#fafbfc] transition-colors">
                      <td className="px-5 py-4 font-bold text-[#0a1b2d] text-sm font-mono">{o.orderId}</td>
                      <td className="px-5 py-4 text-sm text-[#0a1b2d] font-semibold">{o.user?.name || o.guestEmail || 'Guest'}</td>
                      <td className="px-5 py-4 font-extrabold text-[#0a1b2d]">${o.total?.toLocaleString()}</td>
                      <td className="px-5 py-4"><StatusBadge s={o.orderStatus} /></td>
                      <td className="px-5 py-4 text-sm text-[#64748b] capitalize font-medium">{o.paymentMethod}</td>
                      <td className="px-5 py-4 text-sm text-[#64748b]">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <button onClick={() => setSelectedOrderDetail(o)}
                          className="w-8 h-8 rounded-lg bg-[#f8fafc] text-gray-600 flex items-center justify-center hover:bg-gray-200 hover:text-black transition-colors" title="View details">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
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

        {/* ═══ INVOICE GENERATOR ═══ */}
        {activeTab === 'invoices' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Info Card */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6 space-y-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#164475]">1. Customer Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Customer Name *</label>
                    <input value={invoiceCustomerName} onChange={e => setInvoiceCustomerName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:ring-1 focus:ring-[#164475] outline-none" placeholder="Ahmad Khan..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Customer Phone</label>
                    <input value={invoiceCustomerPhone} onChange={e => setInvoiceCustomerPhone(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:ring-1 focus:ring-[#164475] outline-none" placeholder="0300-1234567" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Customer Email</label>
                    <input value={invoiceCustomerEmail} onChange={e => setInvoiceCustomerEmail(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:ring-1 focus:ring-[#164475] outline-none" placeholder="customer@gmail.com" />
                  </div>
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#164475]">2. Invoice Line Items</h3>
                  <button 
                    onClick={() => setInvoiceItems([...invoiceItems, { productId: '', name: '', price: 0, cost: 0, quantity: 1 }])}
                    className="px-3 py-1.5 bg-[#164475]/5 text-[#164475] text-xs font-bold rounded-xl hover:bg-[#164475]/10 transition-colors"
                  >
                    + Add Row
                  </button>
                </div>

                <div className="space-y-3">
                  {invoiceItems.map((item, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-3 items-stretch md:items-center bg-[#f8fafc] p-4 rounded-xl border border-slate-100 relative">
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                          <select 
                            value={item.productId}
                            onChange={(e) => {
                              const val = e.target.value;
                              const matched = products.find(p => p._id === val || p.id === val);
                              const updated = [...invoiceItems];
                              updated[idx] = {
                                productId: val,
                                name: matched ? matched.name : '',
                                price: matched ? matched.price : 0,
                                cost: matched ? (matched.costPerItem || 0) : 0,
                                quantity: item.quantity
                              };
                              setInvoiceItems(updated);
                            }}
                            className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#164475]"
                          >
                            <option value="">-- Choose Item from Inventory --</option>
                            {products.map(p => (
                              <option key={p._id || p.id} value={p._id || p.id}>{p.name} (${p.price})</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <input 
                            value={item.name} 
                            onChange={(e) => {
                              const updated = [...invoiceItems];
                              updated[idx].name = e.target.value;
                              setInvoiceItems(updated);
                            }}
                            className="w-full px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#164475]" 
                            placeholder="Or type manual item name..." 
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 w-full md:w-auto items-center">
                        <div className="w-24">
                          <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Price</label>
                          <input 
                            type="number"
                            value={item.price} 
                            onChange={(e) => {
                              const updated = [...invoiceItems];
                              updated[idx].price = +e.target.value;
                              setInvoiceItems(updated);
                            }}
                            className="w-full px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#164475]" 
                          />
                        </div>
                        <div className="w-24">
                          <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Cost</label>
                          <input 
                            type="number"
                            value={item.cost} 
                            onChange={(e) => {
                              const updated = [...invoiceItems];
                              updated[idx].cost = +e.target.value;
                              setInvoiceItems(updated);
                            }}
                            className="w-full px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#164475]" 
                          />
                        </div>
                        <div className="w-16">
                          <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Qty</label>
                          <input 
                            type="number" 
                            min="1"
                            value={item.quantity} 
                            onChange={(e) => {
                              const updated = [...invoiceItems];
                              updated[idx].quantity = +e.target.value;
                              setInvoiceItems(updated);
                            }}
                            className="w-full px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm bg-white text-center focus:outline-none focus:ring-1 focus:ring-[#164475]" 
                          />
                        </div>
                        <div className="pt-4">
                          <button 
                            onClick={() => {
                              const updated = invoiceItems.filter((_, i) => i !== idx);
                              setInvoiceItems(updated.length > 0 ? updated : [{ productId: '', name: '', price: 0, cost: 0, quantity: 1 }]);
                            }}
                            className="p-2 text-red-500 hover:bg-red-55 rounded-xl transition-colors"
                            title="Remove row"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes & Payment Card */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6 space-y-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#164475]">3. Payment & Remarks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Payment Method</label>
                    <div className="relative">
                      <select value={invoicePaymentMethod} onChange={e => setInvoicePaymentMethod(e.target.value)}
                        className="w-full appearance-none px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#164475]">
                        {['Cash', 'Card', 'Bank Transfer', 'COD'].map(m => <option key={m}>{m}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Invoice Notes / Remarks</label>
                    <input value={invoiceNotes} onChange={e => setInvoiceNotes(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:ring-1 focus:ring-[#164475] outline-none" placeholder="Warranty check note, etc..." />
                  </div>
                </div>
              </div>
            </div>

            {/* Calculations Card (Summary Column) */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6 space-y-5 sticky top-6">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#164475]">Invoice Summary</h3>
                
                <div className="space-y-4 border-b border-[#f1f5f9] pb-4 text-sm">
                  {/* Discount input */}
                  <div>
                    <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Discount Rate</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        value={invoiceDiscountValue} 
                        onChange={e => setInvoiceDiscountValue(+e.target.value)}
                        className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#164475]" 
                      />
                      <select 
                        value={invoiceDiscountType} 
                        onChange={e => setInvoiceDiscountType(e.target.value as any)}
                        className="w-20 px-2 py-2 border border-[#e2e8f0] rounded-xl text-sm bg-white"
                      >
                        <option value="fixed">$</option>
                        <option value="percentage">%</option>
                      </select>
                    </div>
                  </div>

                  {/* GST rate input */}
                  <div>
                    <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">GST Rate (%)</label>
                    <input 
                      type="number" 
                      value={invoiceTaxRate} 
                      onChange={e => setInvoiceTaxRate(+e.target.value)}
                      className="w-full px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#164475]" 
                    />
                  </div>
                </div>

                {/* Final values */}
                <div className="text-sm space-y-2 border-b border-[#f1f5f9] pb-4">
                  <div className="flex justify-between text-[#64748b]"><span className="font-semibold">Subtotal:</span><span>${invoiceItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span></div>
                  
                  <div className="flex justify-between text-[#64748b]">
                    <span className="font-semibold">Discount Amount:</span>
                    <span>
                      -${(invoiceDiscountType === 'fixed' 
                        ? invoiceDiscountValue 
                        : (invoiceItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * invoiceDiscountValue) / 100).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#64748b]">
                    <span className="font-semibold">GST Tax:</span>
                    <span>
                      +${(((invoiceItems.reduce((sum, item) => sum + item.price * item.quantity, 0) - (invoiceDiscountType === 'fixed' ? invoiceDiscountValue : (invoiceItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * invoiceDiscountValue) / 100)) * invoiceTaxRate) / 100).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-black text-[#0a1b2d]">
                  <span>Grand Total:</span>
                  <span>
                    ${((invoiceItems.reduce((sum, item) => sum + item.price * item.quantity, 0) - (invoiceDiscountType === 'fixed' ? invoiceDiscountValue : (invoiceItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * invoiceDiscountValue) / 100)) * (1 + invoiceTaxRate / 100)).toFixed(2)}
                  </span>
                </div>

                <button 
                  onClick={handleSaveInvoice}
                  className="w-full py-3.5 bg-[#164475] hover:bg-[#0a1b2d] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#164475]/20 flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Save & Print Invoice
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ REPORTS VIEW ═══ */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Tab Selector */}
            <div className="flex gap-2 border-b border-[#e2e8f0] pb-px flex-wrap">
              {[
                { id: 'inventory', label: 'Shopify Inventory Report' },
                { id: 'physical', label: 'Physical Store (Invoices) Report' },
                { id: 'online', label: 'Online Sales (Orders) Report' }
              ].map(subTab => (
                <button 
                  key={subTab.id} 
                  onClick={() => setReportSubTab(subTab.id as any)}
                  className={`px-5 py-3 font-bold text-sm border-b-2 transition-all ${
                    reportSubTab === subTab.id 
                      ? 'border-[#164475] text-[#164475]' 
                      : 'border-transparent text-gray-500 hover:text-slate-800'
                  }`}
                >
                  {subTab.label}
                </button>
              ))}
            </div>

            {/* Sub-tab 1: Inventory Report */}
            {reportSubTab === 'inventory' && (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm">
                    <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">Total Items in Stock</p>
                    <p className="text-2xl font-black text-[#0a1b2d]">{products.reduce((sum, p) => sum + (p.stock || 0), 0)}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm">
                    <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">Cost of Inventory</p>
                    <p className="text-2xl font-black text-[#0a1b2d]">${products.reduce((sum, p) => sum + ((p.stock || 0) * (p.costPerItem || 0)), 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm">
                    <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">Total Retail Value</p>
                    <p className="text-2xl font-black text-[#0a1b2d]">${products.reduce((sum, p) => sum + ((p.stock || 0) * p.price), 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm">
                    <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">Potential Margin Profit</p>
                    <p className="text-2xl font-black text-[#164475]">
                      ${(products.reduce((sum, p) => sum + ((p.stock || 0) * p.price), 0) - products.reduce((sum, p) => sum + ((p.stock || 0) * (p.costPerItem || 0)), 0)).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                        <tr className="text-left text-xs font-bold text-[#64748b] uppercase tracking-widest">
                          <th className="px-5 py-4">Product</th>
                          <th className="px-5 py-4">SKU</th>
                          <th className="px-5 py-4 text-center">Stock Level</th>
                          <th className="px-5 py-4 text-right">Cost</th>
                          <th className="px-5 py-4 text-right">Price</th>
                          <th className="px-5 py-4 text-right">Total Cost</th>
                          <th className="px-5 py-4 text-right">Total Value</th>
                          <th className="px-5 py-4 text-right">Potential Profit</th>
                          <th className="px-5 py-4 text-center">Margin</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f1f5f9] text-sm text-[#0a1b2d]">
                        {products.map(p => {
                          const costVal = (p.stock || 0) * (p.costPerItem || 0);
                          const retailVal = (p.stock || 0) * p.price;
                          const profit = retailVal - costVal;
                          const margin = p.price > 0 && p.costPerItem ? Math.round(((p.price - p.costPerItem) / p.price) * 100) : 0;
                          return (
                            <tr key={p._id || p.id} onClick={() => setSelectedProductDetail(p)} className="hover:bg-[#fafbfc] transition-colors cursor-pointer">
                              <td className="px-5 py-4 font-semibold">{p.name}</td>
                              <td className="px-5 py-4 font-mono text-xs text-[#64748b]">{p.code}</td>
                              <td className="px-5 py-4 text-center font-bold">{p.stock || 0}</td>
                              <td className="px-5 py-4 text-right text-gray-500">${p.costPerItem || 0}</td>
                              <td className="px-5 py-4 text-right font-semibold">${p.price}</td>
                              <td className="px-5 py-4 text-right text-gray-500">${costVal.toLocaleString()}</td>
                              <td className="px-5 py-4 text-right font-semibold">${retailVal.toLocaleString()}</td>
                              <td className="px-5 py-4 text-right font-extrabold text-[#164475]">${profit.toLocaleString()}</td>
                              <td className="px-5 py-4 text-center font-bold text-slate-500">{margin}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Invoices Report */}
            {reportSubTab === 'physical' && (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm">
                    <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">Total Invoices</p>
                    <p className="text-2xl font-black text-[#0a1b2d]">{invoices.length}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm">
                    <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">Physical Sales Revenue</p>
                    <p className="text-2xl font-black text-[#0a1b2d]">${invoices.reduce((sum, i) => sum + i.total, 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm">
                    <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">Offline Cost of Goods</p>
                    <p className="text-2xl font-black text-[#0a1b2d]">
                      ${invoices.reduce((sum, i) => sum + i.items.reduce((s: number, item: any) => s + (item.cost || 0) * item.quantity, 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm">
                    <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">Physical Sales Net Profit</p>
                    <p className="text-2xl font-black text-[#164475]">
                      ${(invoices.reduce((sum, i) => sum + i.total, 0) - invoices.reduce((sum, i) => sum + i.items.reduce((s: number, item: any) => s + (item.cost || 0) * item.quantity, 0), 0)).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                        <tr className="text-left text-xs font-bold text-[#64748b] uppercase tracking-widest">
                          <th className="px-5 py-4">Invoice ID</th>
                          <th className="px-5 py-4">Customer</th>
                          <th className="px-5 py-4">Date</th>
                          <th className="px-5 py-4 text-center">Items</th>
                          <th className="px-5 py-4 text-right">Discount</th>
                          <th className="px-5 py-4 text-right">GST Tax</th>
                          <th className="px-5 py-4 text-right">Total Invoice</th>
                          <th className="px-5 py-4 text-right">Revenue Profit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f1f5f9] text-sm text-[#0a1b2d]">
                        {invoices.length === 0 && (
                          <tr><td colSpan={8} className="px-5 py-8 text-center text-gray-500">No generated invoices found.</td></tr>
                        )}
                        {invoices.map(i => {
                          const cogs = i.items.reduce((s: number, item: any) => s + (item.cost || 0) * item.quantity, 0);
                          const profit = i.total - cogs;
                          return (
                            <tr key={i._id} onClick={() => setSelectedInvoiceDetail(i)} className="hover:bg-[#fafbfc] transition-colors cursor-pointer">
                              <td className="px-5 py-4 font-bold font-mono text-[#164475]">{i.invoiceId}</td>
                              <td className="px-5 py-4 font-semibold">{i.customerName}</td>
                              <td className="px-5 py-4 text-[#64748b]">{new Date(i.createdAt).toLocaleDateString()}</td>
                              <td className="px-5 py-4 text-center">{i.items.length}</td>
                              <td className="px-5 py-4 text-right text-red-500">-${i.discountAmount || 0}</td>
                              <td className="px-5 py-4 text-right text-gray-500">${i.taxAmount || 0}</td>
                              <td className="px-5 py-4 text-right font-bold">${i.total.toLocaleString()}</td>
                              <td className="px-5 py-4 text-right font-extrabold text-[#164475]">${profit.toLocaleString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 3: Online Sales Report */}
            {reportSubTab === 'online' && (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm">
                    <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">Online Orders</p>
                    <p className="text-2xl font-black text-[#0a1b2d]">{orders.filter(o => o.orderStatus !== 'cancelled').length}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm">
                    <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">Online Sales Revenue</p>
                    <p className="text-2xl font-black text-[#0a1b2d]">${orders.filter(o => o.orderStatus !== 'cancelled').reduce((sum, o) => sum + o.total, 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm">
                    <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">Est. Cost of Goods</p>
                    <p className="text-2xl font-black text-[#0a1b2d]">
                      ${orders.filter(o => o.orderStatus !== 'cancelled').reduce((sum, o) => {
                        return sum + (o.items?.reduce((is: number, item: any) => {
                          const matched = products.find(p => p._id === item.product || p.id === item.product);
                          const cost = matched ? (matched.costPerItem || 0) : Math.round(item.price * 0.65);
                          return is + cost * item.quantity;
                        }, 0) || 0);
                      }, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm">
                    <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">Online Net Profit</p>
                    <p className="text-2xl font-black text-[#164475]">
                      ${(orders.filter(o => o.orderStatus !== 'cancelled').reduce((sum, o) => sum + o.total, 0) - orders.filter(o => o.orderStatus !== 'cancelled').reduce((sum, o) => {
                        return sum + (o.items?.reduce((is: number, item: any) => {
                          const matched = products.find(p => p._id === item.product || p.id === item.product);
                          const cost = matched ? (matched.costPerItem || 0) : Math.round(item.price * 0.65);
                          return is + cost * item.quantity;
                        }, 0) || 0);
                      }, 0)).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                        <tr className="text-left text-xs font-bold text-[#64748b] uppercase tracking-widest">
                          <th className="px-5 py-4">Order ID</th>
                          <th className="px-5 py-4">Customer</th>
                          <th className="px-5 py-4">Date</th>
                          <th className="px-5 py-4">Status</th>
                          <th className="px-5 py-4">Payment</th>
                          <th className="px-5 py-4 text-right">Items Price</th>
                          <th className="px-5 py-4 text-right">Total Order</th>
                          <th className="px-5 py-4 text-right">Est. Profit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f1f5f9] text-sm text-[#0a1b2d]">
                        {orders.length === 0 && (
                          <tr><td colSpan={8} className="px-5 py-8 text-center text-gray-500">No online orders found.</td></tr>
                        )}
                        {orders.map(o => {
                          const cogs = o.items?.reduce((is: number, item: any) => {
                            const matched = products.find(p => p._id === item.product || p.id === item.product);
                            const cost = matched ? (matched.costPerItem || 0) : Math.round(item.price * 0.65);
                            return is + cost * item.quantity;
                          }, 0) || 0;
                          const profit = o.orderStatus === 'cancelled' ? 0 : o.total - cogs;
                          return (
                            <tr key={o._id} onClick={() => setSelectedOrderDetail(o)} className="hover:bg-[#fafbfc] transition-colors cursor-pointer">
                              <td className="px-5 py-4 font-bold font-mono text-[#164475]">{o.orderId}</td>
                              <td className="px-5 py-4 font-semibold">{o.user?.name || o.guestEmail || 'Guest'}</td>
                              <td className="px-5 py-4 text-[#64748b]">{new Date(o.createdAt).toLocaleDateString()}</td>
                              <td className="px-5 py-4"><StatusBadge s={o.orderStatus} /></td>
                              <td className="px-5 py-4 capitalize text-[#64748b]">{o.paymentMethod}</td>
                              <td className="px-5 py-4 text-right text-gray-500">${o.subtotal || o.total}</td>
                              <td className="px-5 py-4 text-right font-bold">${o.total.toLocaleString()}</td>
                              <td className="px-5 py-4 text-right font-extrabold text-[#164475]">${profit.toLocaleString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
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

      {/* Product Detail Modal */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedProductDetail(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-[#e2e8f0] pb-4">
              <h2 className="text-xl font-bold text-[#0a1b2d]">Product Specifications</h2>
              <button onClick={() => setSelectedProductDetail(null)} className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#e2e8f0] transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <img src={selectedProductDetail.image} alt={selectedProductDetail.name} className="w-full h-64 object-contain bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] p-2" />
                {selectedProductDetail.additionalImages && selectedProductDetail.additionalImages.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto py-1">
                    {selectedProductDetail.additionalImages.map((img: string, idx: number) => (
                      <img key={idx} src={img} alt="Spec gallery" className="w-16 h-16 object-contain border border-[#e2e8f0] bg-white rounded-lg p-1" />
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#0a1b2d]">{selectedProductDetail.name}</h3>
                  <span className="text-xs font-mono text-[#64748b] bg-slate-100 px-2 py-0.5 rounded">SKU: {selectedProductDetail.code}</span>
                  {selectedProductDetail.barcode && <span className="text-xs font-mono text-[#64748b] bg-slate-100 px-2 py-0.5 rounded ml-2">Barcode: {selectedProductDetail.barcode}</span>}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider">Retail Price</p>
                    <p className="font-extrabold text-[#0a1b2d] text-base">${selectedProductDetail.price}</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider">Cost per Item</p>
                    <p className="font-extrabold text-gray-500 text-base">${selectedProductDetail.costPerItem || 0}</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider">Markup Margin</p>
                    <p className="font-bold text-[#164475]">
                      {selectedProductDetail.price > 0 && selectedProductDetail.costPerItem ? Math.round(((selectedProductDetail.price - selectedProductDetail.costPerItem) / selectedProductDetail.price) * 100) : 0}% Margin
                    </p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider">Stock Available</p>
                    <p className="font-bold text-[#0a1b2d]">{selectedProductDetail.stock ?? 0} units</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider">Vendor / Brand</p>
                    <p className="font-semibold text-[#0a1b2d]">{selectedProductDetail.vendor || 'Generic'}</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider">Weight</p>
                    <p className="font-semibold text-[#0a1b2d]">{selectedProductDetail.weight || 0} {selectedProductDetail.weightUnit || 'kg'}</p>
                  </div>
                </div>
                <div className="text-xs text-[#64748b] space-y-1">
                  <p>Category: <span className="font-bold text-slate-700">{selectedProductDetail.category}</span></p>
                  <p>Product Type: <span className="font-bold text-slate-700">{selectedProductDetail.productType || 'N/A'}</span></p>
                  <p>Track Quantity: <span className="font-bold text-slate-700">{selectedProductDetail.trackQuantity ? 'Yes' : 'No'}</span></p>
                  <p>Continue selling out of stock: <span className="font-bold text-slate-700">{selectedProductDetail.continueSellingOutOfStock ? 'Yes' : 'No'}</span></p>
                  <p>Tax Charged: <span className="font-bold text-slate-700">{selectedProductDetail.chargeTax ? 'Yes' : 'No'}</span></p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-[#e2e8f0]">
              <h4 className="text-xs font-extrabold text-[#0a1b2d] uppercase tracking-wider mb-2">Description</h4>
              <p className="text-sm text-[#64748b] whitespace-pre-wrap leading-relaxed">{selectedProductDetail.description || 'No description provided.'}</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setEditingProduct(selectedProductDetail); setShowProductForm(true); setSelectedProductDetail(null); }} className="flex-1 py-3 bg-[#164475] hover:bg-[#0a1b2d] text-white rounded-xl text-sm font-bold transition-colors">Edit Product</button>
              <button onClick={() => setSelectedProductDetail(null)} className="flex-1 py-3 border border-[#e2e8f0] text-[#64748b] rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrderDetail(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-[#e2e8f0] pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#0a1b2d]">Order Details</h2>
                <p className="text-xs text-[#64748b] font-mono mt-0.5">{selectedOrderDetail.orderId} • {new Date(selectedOrderDetail.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrderDetail(null)} className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#e2e8f0] transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div className="bg-[#f8fafc] p-4 rounded-2xl border border-[#e2e8f0] space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#164475]">Customer Information</h3>
                <div className="text-sm space-y-1.5 text-[#0a1b2d]">
                  <p><span className="text-[#64748b] font-semibold">Name:</span> {selectedOrderDetail.user?.name || selectedOrderDetail.shippingAddress?.fullName || 'Guest'}</p>
                  <p><span className="text-[#64748b] font-semibold">Email:</span> {selectedOrderDetail.user?.email || selectedOrderDetail.guestEmail || 'N/A'}</p>
                  <p><span className="text-[#64748b] font-semibold">Phone:</span> {selectedOrderDetail.shippingAddress?.phone || 'N/A'}</p>
                </div>
              </div>
              {/* Shipping Address */}
              <div className="bg-[#f8fafc] p-4 rounded-2xl border border-[#e2e8f0] space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#164475]">Shipping Address</h3>
                <div className="text-sm space-y-1.5 text-[#0a1b2d]">
                  <p><span className="text-[#64748b] font-semibold">Address:</span> {selectedOrderDetail.shippingAddress?.street || selectedOrderDetail.shippingAddress?.address}</p>
                  <p><span className="text-[#64748b] font-semibold">City:</span> {selectedOrderDetail.shippingAddress?.city}</p>
                  <p><span className="text-[#64748b] font-semibold">Country:</span> {selectedOrderDetail.shippingAddress?.country || 'Pakistan'}</p>
                </div>
              </div>
            </div>

            {/* Status updates */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-[#e2e8f0] flex flex-wrap gap-4 items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Status Settings</p>
                <div className="flex gap-2 items-center mt-1">
                  <StatusBadge s={selectedOrderDetail.orderStatus} />
                  <span className="text-xs text-slate-400 capitalize">• Pay: {selectedOrderDetail.paymentMethod}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select 
                  value={selectedOrderDetail.orderStatus}
                  onChange={(e) => {
                    handleUpdateOrderStatus(selectedOrderDetail.orderId, e.target.value, selectedOrderDetail.trackingNumber);
                    setSelectedOrderDetail((prev: any) => ({ ...prev, orderStatus: e.target.value }));
                  }}
                  className="px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#164475]"
                >
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                    <option key={s} value={s}>{s.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Order Items */}
            <div className="border border-[#e2e8f0] rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#64748b] font-bold text-xs uppercase">
                  <tr>
                    <th className="text-left px-4 py-3">Item</th>
                    <th className="text-right px-4 py-3">Price</th>
                    <th className="text-center px-4 py-3">Qty</th>
                    <th className="text-right px-4 py-3">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {selectedOrderDetail.items?.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 font-semibold text-[#0a1b2d]">{item.name}</td>
                      <td className="text-right px-4 py-3">${item.price}</td>
                      <td className="text-center px-4 py-3">{item.quantity}</td>
                      <td className="text-right px-4 py-3 font-bold">${(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations summary */}
            <div className="flex justify-end">
              <div className="w-64 text-sm space-y-2">
                <div className="flex justify-between text-[#64748b]"><span className="font-semibold">Subtotal:</span><span>${selectedOrderDetail.subtotal ?? selectedOrderDetail.total}</span></div>
                <div className="flex justify-between text-[#64748b]"><span className="font-semibold">Discount:</span><span>-${selectedOrderDetail.discount ?? 0}</span></div>
                <div className="flex justify-between text-[#64748b]"><span className="font-semibold">Shipping:</span><span>+${selectedOrderDetail.shippingCost ?? 0}</span></div>
                <div className="flex justify-between text-base font-extrabold text-[#0a1b2d] pt-2 border-t border-[#e2e8f0]"><span>Total Amount:</span><span>${selectedOrderDetail.total}</span></div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setSelectedOrderDetail(null)} className="px-6 py-2.5 bg-slate-100 font-bold text-[#64748b] rounded-xl hover:bg-slate-200 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoiceDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedInvoiceDetail(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-[#e2e8f0] pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#0a1b2d]">Store Invoice Summary</h2>
                <p className="text-xs text-[#64748b] font-mono mt-0.5">{selectedInvoiceDetail.invoiceId} • {new Date(selectedInvoiceDetail.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setShowPrintInvoice(selectedInvoiceDetail);
                    setSelectedInvoiceDetail(null);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#164475] hover:bg-[#0a1b2d] text-white rounded-xl transition-all shadow-md"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Layout
                </button>
                <button onClick={() => setSelectedInvoiceDetail(null)} className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#e2e8f0] transition-colors"><X className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0]">
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#164475]">Customer details</h3>
                <p className="text-sm font-semibold text-[#0a1b2d]">{selectedInvoiceDetail.customerName}</p>
                {selectedInvoiceDetail.customerPhone && <p className="text-xs text-[#64748b]"><span className="font-semibold">Phone:</span> {selectedInvoiceDetail.customerPhone}</p>}
                {selectedInvoiceDetail.customerEmail && <p className="text-xs text-[#64748b]"><span className="font-semibold">Email:</span> {selectedInvoiceDetail.customerEmail}</p>}
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#164475]">Payment info</h3>
                <p className="text-sm text-[#0a1b2d] font-semibold">Payment: <span className="text-[#164475]">{selectedInvoiceDetail.paymentMethod}</span></p>
                <p className="text-xs text-[#64748b]"><span className="font-semibold">Cashier Status:</span> Paid in full</p>
              </div>
            </div>

            {/* Items */}
            <div className="border border-[#e2e8f0] rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#64748b] font-bold text-xs uppercase">
                  <tr>
                    <th className="text-left px-4 py-3">Product Description</th>
                    <th className="text-right px-4 py-3">Cost per unit</th>
                    <th className="text-right px-4 py-3">Price</th>
                    <th className="text-center px-4 py-3">Qty</th>
                    <th className="text-right px-4 py-3">Total Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {selectedInvoiceDetail.items?.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 font-semibold text-[#0a1b2d]">{item.name}</td>
                      <td className="text-right px-4 py-3 text-gray-400">${item.cost || 0}</td>
                      <td className="text-right px-4 py-3">${item.price}</td>
                      <td className="text-center px-4 py-3">{item.quantity}</td>
                      <td className="text-right px-4 py-3 font-bold">${(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Notes */}
            {selectedInvoiceDetail.notes && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                <span className="font-extrabold text-[#0a1b2d] uppercase tracking-wider block mb-1">Invoice Notes</span>
                <p className="text-slate-600 italic">{selectedInvoiceDetail.notes}</p>
              </div>
            )}

            {/* Summary */}
            <div className="flex justify-between items-start pt-2 border-t border-[#e2e8f0]">
              <div className="text-xs text-[#64748b] bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="font-bold text-[#0a1b2d] block mb-1">Estimated Profit Summary</span>
                <p>Total Revenue: <span className="font-bold text-slate-800">${selectedInvoiceDetail.total}</span></p>
                <p>COGS: <span className="font-bold text-slate-800">${selectedInvoiceDetail.items?.reduce((sum: number, item: any) => sum + (item.cost || 0) * item.quantity, 0)}</span></p>
                <p className="mt-1 font-extrabold text-[#164475]">Profit margin: ${Math.round(selectedInvoiceDetail.total - selectedInvoiceDetail.items?.reduce((sum: number, item: any) => sum + (item.cost || 0) * item.quantity, 0))}</p>
              </div>
              <div className="w-64 text-sm space-y-2">
                <div className="flex justify-between text-[#64748b]"><span className="font-semibold">Subtotal:</span><span>${selectedInvoiceDetail.subtotal}</span></div>
                <div className="flex justify-between text-[#64748b]">
                  <span className="font-semibold">Discount ({selectedInvoiceDetail.discountType === 'percentage' ? `${selectedInvoiceDetail.discountValue}%` : 'Fixed'}):</span>
                  <span>-${selectedInvoiceDetail.discountAmount}</span>
                </div>
                <div className="flex justify-between text-[#64748b]"><span className="font-semibold">GST Tax ({selectedInvoiceDetail.taxRate}%):</span><span>+${selectedInvoiceDetail.taxAmount}</span></div>
                <div className="flex justify-between text-base font-extrabold text-[#0a1b2d] pt-2 border-t border-[#e2e8f0]"><span>Total Invoice:</span><span>${selectedInvoiceDetail.total}</span></div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => {
                  handleDeleteInvoice(selectedInvoiceDetail._id);
                  setSelectedInvoiceDetail(null);
                }}
                className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold transition-colors"
              >
                Delete Invoice
              </button>
              <button onClick={() => setSelectedInvoiceDetail(null)} className="flex-1 py-2.5 bg-slate-100 font-bold text-[#64748b] rounded-xl hover:bg-slate-200 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Print Preview Template (Print overlay) */}
      {showPrintInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:absolute print:inset-0 print:bg-white print:p-0">
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              #print-area, #print-area * {
                visibility: visible;
              }
              #print-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 0;
                box-shadow: none !important;
              }
              .print\\:hidden {
                display: none !important;
              }
            }
          `}</style>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 print:shadow-none print:w-full print:max-w-full print:max-h-full print:overflow-visible print:p-0" id="print-area">
            {/* Action Bar (hidden when printing) */}
            <div className="flex justify-between items-center border-b border-[#e2e8f0] pb-4 mb-6 print:hidden">
              <h3 className="font-bold text-lg text-[#0a1b2d]">Invoice Print Preview</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#164475] hover:bg-[#0a1b2d] text-white font-bold rounded-xl transition-all shadow-md text-sm"
                >
                  <Printer className="w-4 h-4" /> Print Document
                </button>
                <button 
                  onClick={() => setShowPrintInvoice(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all"
                >
                  Close Preview
                </button>
              </div>
            </div>

            {/* A4 Sheet Body */}
            <div className="p-4 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-[#164475] pb-6">
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-[#0a1b2d]">ADAMJEE COMPUTERS</h1>
                  <p className="text-xs text-[#64748b] font-semibold mt-1">Pakistan's Premium Gaming & Desktop Hardware Store</p>
                  <p className="text-xs text-[#64748b]">Regal Plaza, Saddar, Karachi, Pakistan</p>
                  <p className="text-xs text-[#64748b]">WhatsApp: +92 300 0000000 | support@adamjeecomputers.com</p>
                </div>
                <div className="text-right">
                  <div className="inline-block bg-[#0a1b2d] text-white text-xs font-extrabold uppercase px-3 py-1 rounded-md mb-2">OFFLINE INVOICE</div>
                  <h2 className="text-xl font-bold text-[#0a1b2d] font-mono">{showPrintInvoice.invoiceId}</h2>
                  <p className="text-xs text-[#64748b]"><span className="font-semibold">Date:</span> {new Date(showPrintInvoice.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs text-[#64748b]"><span className="font-semibold">Payment:</span> {showPrintInvoice.paymentMethod}</p>
                </div>
              </div>

              {/* Bill To */}
              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#164475] mb-2">Billed To</h4>
                  <p className="text-sm font-bold text-[#0a1b2d]">{showPrintInvoice.customerName}</p>
                  {showPrintInvoice.customerPhone && <p className="text-xs text-[#64748b] mt-0.5">Ph: {showPrintInvoice.customerPhone}</p>}
                  {showPrintInvoice.customerEmail && <p className="text-xs text-[#64748b]">Email: {showPrintInvoice.customerEmail}</p>}
                </div>
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#164475] mb-2">Terms & Conditions</h4>
                  <p className="text-[10px] text-[#64748b] leading-tight">
                    1. 1 Year warranty on premium products.<br/>
                    2. 7-day window for hardware check/returns.<br/>
                    3. No returns on burned, damaged, or modified parts.
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-[#0a1b2d] font-extrabold text-xs uppercase">
                    <th className="py-2.5">Item Description</th>
                    <th className="text-right py-2.5">Unit Price</th>
                    <th className="text-center py-2.5">Qty</th>
                    <th className="text-right py-2.5">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {showPrintInvoice.items?.map((item: any, idx: number) => (
                    <tr key={idx} className="text-[#0a1b2d]">
                      <td className="py-3 font-medium">{item.name}</td>
                      <td className="text-right py-3">${item.price?.toFixed(2)}</td>
                      <td className="text-center py-3">{item.quantity}</td>
                      <td className="text-right py-3 font-bold">${(item.price * item.quantity)?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary calculations */}
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <div className="w-72 text-sm space-y-2 text-[#0a1b2d]">
                  <div className="flex justify-between text-[#64748b]">
                    <span className="font-semibold">Subtotal:</span>
                    <span>${showPrintInvoice.subtotal?.toFixed(2)}</span>
                  </div>
                  {showPrintInvoice.discountAmount > 0 && (
                    <div className="flex justify-between text-[#64748b]">
                      <span className="font-semibold">Discount ({showPrintInvoice.discountType === 'percentage' ? `${showPrintInvoice.discountValue}%` : 'Fixed'}):</span>
                      <span>-${showPrintInvoice.discountAmount?.toFixed(2)}</span>
                    </div>
                  )}
                  {showPrintInvoice.taxAmount > 0 && (
                    <div className="flex justify-between text-[#64748b]">
                      <span className="font-semibold">GST ({showPrintInvoice.taxRate}%):</span>
                      <span>+${showPrintInvoice.taxAmount?.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-black bg-[#164475]/5 px-3 py-2 rounded-xl text-[#0a1b2d] border-t-2 border-[#164475] mt-1">
                    <span>Total Bill:</span>
                    <span>${showPrintInvoice.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {showPrintInvoice.notes && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                  <span className="font-extrabold text-[#0a1b2d] uppercase tracking-wider block mb-1">Remarks / Store Note</span>
                  <p className="text-slate-600 italic">{showPrintInvoice.notes}</p>
                </div>
              )}

              {/* Footer */}
              <div className="border-t border-slate-200 pt-8 mt-12 flex justify-between items-center">
                <div>
                  <p className="text-xs text-[#0a1b2d] font-bold">Authorized Signature ________________</p>
                  <p className="text-[10px] text-[#64748b] mt-1">Thanks for shopping at Adamjee Computers Pakistan.</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#0a1b2d] font-bold">Customer Signature ________________</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
