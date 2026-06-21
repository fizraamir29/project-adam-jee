'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useSEO } from '../hooks/useSEO';
import {
  LayoutDashboard, ShoppingBag, Package, Users, MessageSquare,
  BarChart3, Settings, Plus, Pencil, Trash2, Search, Eye,
  TrendingUp, X, Upload, ChevronDown, LogOut,
  CheckCircle, Clock, Truck, AlertCircle, FileText, Printer,
  Boxes, ArrowUpDown, ArrowUp, ArrowDown, Download, ChevronLeft,
  ChevronRight, PackagePlus, PackageMinus, SlidersHorizontal,
  AlertTriangle, CheckSquare, MinusSquare
} from 'lucide-react';
import { Product } from '../types';
import { saveProducts } from '../utils/storage';

/* ─── HELPERS ────────────────────────────────── */
const statusColors: Record<string, string> = {
  delivered:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
  shipped:    'bg-blue-50 text-blue-700 border border-blue-200',
  processing: 'bg-amber-50 text-amber-700 border border-amber-200',
  pending:    'bg-orange-50 text-orange-700 border border-orange-200',
  cancelled:  'bg-red-50 text-red-700 border border-red-200',
  active:     'bg-emerald-50 text-emerald-700 border border-emerald-200',
  draft:      'bg-gray-100 text-gray-600 border border-gray-200',
  inactive:   'bg-gray-100 text-gray-500 border border-gray-200',
  paid:       'bg-emerald-50 text-emerald-700 border border-emerald-200',
  unpaid:     'bg-red-50 text-red-700 border border-red-200',
  cod:        'bg-amber-50 text-amber-700 border border-amber-200',
  'in stock': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'low stock':'bg-amber-50 text-amber-700 border border-amber-200',
  'out of stock': 'bg-red-50 text-red-700 border border-red-200',
};

const StatusBadge = ({ s }: { s: string }) => (
  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${statusColors[s?.toLowerCase()] ?? 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
    {s}
  </span>
);

const getInventoryStatus = (stock: number, threshold: number = 5): string => {
  if (stock <= 0) return 'out of stock';
  if (stock <= threshold) return 'low stock';
  return 'in stock';
};

const exportCSV = (data: any[], filename: string, columns: { key: string; label: string }[]) => {
  const header = columns.map(c => c.label).join(',');
  const rows = data.map(row =>
    columns.map(c => {
      const val = c.key.split('.').reduce((o, k) => o?.[k], row);
      return `"${String(val ?? '').replace(/"/g, '""')}"`;
    }).join(',')
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

/* ─── PAGINATION HOOK ────────────────────────── */
function usePagination<T>(items: T[], pageSize = 10) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const paged = items.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => { setPage(1); }, [items.length]);
  return { paged, page, setPage, totalPages };
}

function PaginationBar({ page, totalPages, setPage, total }: {
  page: number; totalPages: number; setPage: (p: number) => void; total: number;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-[#f1f5f9] bg-[#fafbfc]">
      <span className="text-xs text-[#64748b] font-semibold">{total} records · Page {page} of {totalPages}</span>
      <div className="flex items-center gap-1">
        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e2e8f0] disabled:opacity-40 hover:bg-[#f1f5f9] transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const p = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
          return (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${p === page ? 'bg-[#164475] text-white' : 'border border-[#e2e8f0] hover:bg-[#f1f5f9] text-[#64748b]'}`}>
              {p}
            </button>
          );
        })}
        <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e2e8f0] disabled:opacity-40 hover:bg-[#f1f5f9] transition-colors">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ─── SORT HEADER ────────────────────────────── */
function SortTh({ label, field, sortField, sortDir, onSort }: {
  label: string; field: string; sortField: string; sortDir: 'asc' | 'desc'; onSort: (f: string) => void;
}) {
  const active = sortField === field;
  return (
    <th className="text-left text-xs font-bold text-[#64748b] uppercase tracking-widest px-5 py-4 cursor-pointer select-none group"
      onClick={() => onSort(field)}>
      <div className="flex items-center gap-1.5">
        {label}
        <span className={`transition-opacity ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
          {active ? (sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3" />}
        </span>
      </div>
    </th>
  );
}

/* ─── PRODUCT FORM MODAL ─────────────────────── */
interface ProductFormProps {
  product?: any;
  onClose: () => void;
  onSave: (p: any) => void;
}

function ProductFormModal({ product, onClose, onSave }: ProductFormProps) {
  const [form, setForm] = useState({
    name: product?.name ?? '',
    code: product?.code ?? '',
    price: product?.price ?? 0,
    comparePrice: product?.comparePrice ?? 0,
    category: product?.category ?? 'Peripherals',
    tag: product?.tag ?? '',
    stock: product?.stock ?? 0,
    lowStockThreshold: product?.lowStockThreshold ?? 5,
    description: product?.description ?? '',
    image: product?.image ?? '',
    additionalImages: product?.additionalImages ?? [],
    costPerItem: product?.costPerItem ?? 0,
    barcode: product?.barcode ?? '',
    vendor: product?.vendor ?? '',
    productType: product?.productType ?? '',
    trackQuantity: product?.trackQuantity ?? true,
    continueSellingOutOfStock: product?.continueSellingOutOfStock ?? false,
    weight: product?.weight ?? 0,
    weightUnit: product?.weightUnit ?? 'kg',
    chargeTax: product?.chargeTax ?? true,
    status: product?.status ?? 'active',
    variants: product?.variants ?? [],
  });
  const [variantInput, setVariantInput] = useState('');

  const categories = ['Desktops','Laptops','Components','Peripherals','Accessories','Monitors','Networking','Headphones','Earphones','Speakers'];

  const addVariant = () => {
    if (variantInput.trim()) {
      setForm(f => ({ ...f, variants: [...f.variants, variantInput.trim()] }));
      setVariantInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#e2e8f0] sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-[#0a1b2d]">{product?._id ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#e2e8f0] transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* General */}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Status</label>
                  <div className="relative">
                    <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                      className="w-full appearance-none px-4 py-2.5 border border-[#e2e8f0] bg-white rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none">
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
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
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0] space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#164475]">Media Upload</h3>
            <div>
              <label className="block text-xs font-bold text-[#0a1b2d] mb-2">Product Images (First will be main image)</label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#cbd5e1] rounded-xl py-6 bg-white hover:bg-[#f1f5f9] cursor-pointer transition-colors">
                <Upload className="w-6 h-6 text-[#64748b] mb-2" />
                <span className="text-sm font-semibold text-[#64748b]">Upload from computer</span>
                <input type="file" multiple accept="image/*" className="hidden"
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
                  }} />
              </label>
              {(form.image || form.additionalImages.length > 0) && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {[...(form.image ? [form.image] : []), ...form.additionalImages].map((img, idx) => (
                    <div key={idx} className="relative group w-20 h-20 rounded-xl border border-[#e2e8f0] bg-white overflow-hidden flex-shrink-0">
                      <img src={img} alt="Preview" className="w-full h-full object-contain" />
                      <button type="button" onClick={() => {
                        if (idx === 0) {
                          const newAdditional = [...form.additionalImages];
                          const newMain = newAdditional.length > 0 ? newAdditional.shift() : '';
                          setForm({ ...form, image: newMain || '', additionalImages: newAdditional });
                        } else {
                          setForm({ ...form, additionalImages: form.additionalImages.filter((_: any, i: number) => i !== idx - 1) });
                        }
                      }} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold shadow-md">✕</button>
                      {idx === 0 && <span className="absolute bottom-0 left-0 right-0 bg-[#164475] text-white text-[9px] font-bold text-center py-0.5">MAIN</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0] space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#164475]">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Price (Retail) *', key: 'price' },
                { label: 'Compare-at Price', key: 'comparePrice' },
                { label: 'Cost per Item', key: 'costPerItem' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">{label}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] font-bold">$</span>
                    <input type="number" value={(form as any)[key]} onChange={e => setForm({...form, [key]: +e.target.value})}
                      className="w-full pl-7 pr-4 py-2.5 border border-[#e2e8f0] bg-white rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none" />
                  </div>
                </div>
              ))}
            </div>
            {form.price > 0 && form.costPerItem > 0 && (
              <p className="text-[11px] text-gray-500 font-semibold">
                Margin: {Math.round(((form.price - form.costPerItem) / form.price) * 100)}% | Markup: {Math.round(((form.price - form.costPerItem) / form.costPerItem) * 100)}%
              </p>
            )}
            <div className="flex items-center gap-2 pt-1">
              <input type="checkbox" id="chargeTax" checked={form.chargeTax} onChange={e => setForm({...form, chargeTax: e.target.checked})}
                className="w-4 h-4 text-[#164475] border-[#cbd5e1] rounded focus:ring-[#164475]" />
              <label htmlFor="chargeTax" className="text-xs font-bold text-[#0a1b2d] cursor-pointer">Charge tax on this product</label>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0] space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#164475]">Inventory</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">SKU / Code *</label>
                <input value={form.code} onChange={e => setForm({...form, code: e.target.value})}
                  className="w-full px-4 py-2.5 border border-[#e2e8f0] bg-white rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none" placeholder="SKU-001" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Barcode</label>
                <input value={form.barcode} onChange={e => setForm({...form, barcode: e.target.value})}
                  className="w-full px-4 py-2.5 border border-[#e2e8f0] bg-white rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none" placeholder="1920392019" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Stock Qty *</label>
                <input type="number" value={form.stock} onChange={e => setForm({...form, stock: +e.target.value})}
                  className="w-full px-4 py-2.5 border border-[#e2e8f0] bg-white rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Low Stock Alert At</label>
                <input type="number" value={form.lowStockThreshold} onChange={e => setForm({...form, lowStockThreshold: +e.target.value})}
                  className="w-full px-4 py-2.5 border border-[#e2e8f0] bg-white rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none" />
              </div>
            </div>
            <div className="space-y-2 pt-1">
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

          {/* Variants */}
          <div className="bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0] space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#164475]">Variants</h3>
            <p className="text-xs text-[#64748b]">Add product variants like sizes, colors, or configurations (e.g. "8GB/256GB Black")</p>
            <div className="flex gap-2">
              <input value={variantInput} onChange={e => setVariantInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addVariant(); }}}
                className="flex-1 px-4 py-2.5 border border-[#e2e8f0] bg-white rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none" placeholder="e.g. 16GB RAM / 512GB SSD" />
              <button type="button" onClick={addVariant} className="px-4 py-2.5 bg-[#164475] text-white rounded-xl text-sm font-bold hover:bg-[#0a1b2d] transition-colors">Add</button>
            </div>
            {form.variants.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.variants.map((v: string, i: number) => (
                  <span key={i} className="flex items-center gap-1.5 bg-white border border-[#e2e8f0] text-[#0a1b2d] text-xs font-semibold px-3 py-1.5 rounded-lg">
                    {v}
                    <button type="button" onClick={() => setForm(f => ({ ...f, variants: f.variants.filter((_: any, idx: number) => idx !== i) }))}
                      className="text-gray-400 hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Shipping & Organization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0] space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#164475]">Shipping</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Weight</label>
                  <input type="number" step="0.01" value={form.weight} onChange={e => setForm({...form, weight: +e.target.value})}
                    className="w-full px-4 py-2.5 border border-[#e2e8f0] bg-white rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Unit</label>
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

            <div className="bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0] space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#164475]">Organization</h3>
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

/* ─── STOCK ADJUST MODAL ─────────────────────── */
function StockAdjustModal({ product, onClose, onSave }: {
  product: any; onClose: () => void; onSave: (id: string, newStock: number, log: any) => void;
}) {
  const [mode, setMode] = useState<'in' | 'out' | 'set'>('in');
  const [qty, setQty] = useState(1);
  const [reason, setReason] = useState('');

  const preview = useMemo(() => {
    const cur = product.stock || 0;
    if (mode === 'in') return cur + qty;
    if (mode === 'out') return Math.max(0, cur - qty);
    return qty;
  }, [mode, qty, product.stock]);

  const handleSave = () => {
    const logEntry = {
      date: new Date().toISOString(),
      type: mode === 'in' ? 'Stock In' : mode === 'out' ? 'Stock Out' : 'Adjustment',
      qty: mode === 'out' ? -qty : qty,
      before: product.stock || 0,
      after: preview,
      reason: reason || 'Manual adjustment',
      productId: product._id || product.id,
    };
    onSave(product._id || product.id, preview, logEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0a1b2d]">Adjust Inventory</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#e2e8f0]"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex items-center gap-3 bg-[#f8fafc] p-3 rounded-2xl border border-[#e2e8f0]">
          <img src={product.image} alt={product.name} className="w-12 h-12 object-contain bg-white rounded-xl border border-[#e2e8f0] p-1 flex-shrink-0" />
          <div>
            <p className="font-bold text-[#0a1b2d] text-sm line-clamp-1">{product.name}</p>
            <p className="text-xs text-[#64748b]">Current stock: <span className="font-bold text-[#164475]">{product.stock || 0}</span> units</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'in', label: 'Stock In', icon: PackagePlus, color: 'emerald' },
            { id: 'out', label: 'Stock Out', icon: PackageMinus, color: 'red' },
            { id: 'set', label: 'Set Exact', icon: SlidersHorizontal, color: 'blue' },
          ].map(({ id, label, icon: Icon, color }) => (
            <button key={id} onClick={() => setMode(id as any)}
              className={`py-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all border ${mode === id
                ? color === 'emerald' ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : color === 'red' ? 'bg-red-50 border-red-300 text-red-700'
                  : 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-[#f8fafc] border-[#e2e8f0] text-[#64748b] hover:bg-white'}`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">
            {mode === 'in' ? 'Quantity to Add' : mode === 'out' ? 'Quantity to Remove' : 'Set New Quantity'}
          </label>
          <input type="number" min="0" value={qty} onChange={e => setQty(+e.target.value)}
            className="w-full px-4 py-3 border border-[#e2e8f0] rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none" />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Reason (optional)</label>
          <input value={reason} onChange={e => setReason(e.target.value)}
            className="w-full px-4 py-3 border border-[#e2e8f0] rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none" placeholder="e.g. New shipment received, Damaged goods..." />
        </div>

        <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] flex items-center justify-between">
          <span className="text-sm text-[#64748b] font-semibold">New stock level:</span>
          <span className={`text-xl font-black ${preview <= 0 ? 'text-red-600' : preview <= 5 ? 'text-amber-600' : 'text-emerald-600'}`}>{preview} units</span>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-[#e2e8f0] rounded-xl text-sm font-bold text-[#64748b] hover:bg-[#f8fafc]">Cancel</button>
          <button onClick={handleSave} className="flex-1 py-3 bg-[#164475] hover:bg-[#0a1b2d] text-white rounded-xl text-sm font-bold transition-colors">Confirm Adjustment</button>
        </div>
      </div>
    </div>
  );
}

/* ─── NAVIGATION ─────────────────────────────── */
const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'products',  icon: ShoppingBag,     label: 'Products' },
  { id: 'inventory', icon: Boxes,           label: 'Inventory' },
  { id: 'orders',    icon: Package,         label: 'Orders' },
  { id: 'invoices',  icon: FileText,        label: 'Invoice Generator' },
  { id: 'reports',   icon: BarChart3,       label: 'Reports' },
  { id: 'messages',  icon: MessageSquare,   label: 'Contact Messages' },
  { id: 'users',     icon: Users,           label: 'Customers' },
  { id: 'settings',  icon: Settings,        label: 'Settings' },
];

/* ─── MAIN ADMIN PAGE ────────────────────────── */
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
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productStatusFilter, setProductStatusFilter] = useState('All');

  // Sort
  const [productSortField, setProductSortField] = useState('name');
  const [productSortDir, setProductSortDir] = useState<'asc' | 'desc'>('asc');

  // Detail Modals
  const [selectedProductDetail, setSelectedProductDetail] = useState<any>(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<any>(null);
  const [selectedInvoiceDetail, setSelectedInvoiceDetail] = useState<any>(null);
  const [stockAdjustProduct, setStockAdjustProduct] = useState<any>(null);
  const [inventoryDetailProduct, setInventoryDetailProduct] = useState<any>(null);

  // Inventory movement log (localStorage)
  const [inventoryLog, setInventoryLog] = useState<any[]>([]);
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState('All');

  // Invoice Generator State
  const [invoiceCustomerName, setInvoiceCustomerName] = useState('');
  const [invoiceCustomerEmail, setInvoiceCustomerEmail] = useState('');
  const [invoiceCustomerPhone, setInvoiceCustomerPhone] = useState('');
  const [invoiceCustomerAddress, setInvoiceCustomerAddress] = useState('');
  const [invoiceShippingCharges, setInvoiceShippingCharges] = useState(0);
  const [invoiceNotes, setInvoiceNotes] = useState('');
  const [invoicePaymentMethod, setInvoicePaymentMethod] = useState('Cash');
  const [invoiceItems, setInvoiceItems] = useState<any[]>([{ productId: '', name: '', price: 0, cost: 0, quantity: 1 }]);
  const [invoiceDiscountType, setInvoiceDiscountType] = useState<'fixed' | 'percentage'>('fixed');
  const [invoiceDiscountValue, setInvoiceDiscountValue] = useState(0);
  const [invoiceTaxRate, setInvoiceTaxRate] = useState(18);
  const [showPrintInvoice, setShowPrintInvoice] = useState<any>(null);

  // Reports
  const [reportSubTab, setReportSubTab] = useState<'inventory' | 'physical' | 'online'>('inventory');
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');
  const [reportCategory, setReportCategory] = useState('All');
  const [reportStatus, setReportStatus] = useState('All');
  const [reportStockStatus, setReportStockStatus] = useState('All');

  // Store Settings
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Adamjee Computers',
    storePhone: '+92 300 0000000',
    storeEmail: 'support@adamjeecomputers.com',
    storeAddress: 'Regal Plaza, Saddar, Karachi, Pakistan',
    gstNumber: 'GST-1234567-8',
    currency: '$',
    defaultTaxRate: 18,
    terms: '1. 1 Year warranty on premium products.\n2. 7-day window for hardware check/returns.\n3. No returns on burned, damaged, or modified parts.'
  });

  const filteredReportProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = reportCategory === 'All' || p.category === reportCategory;
      const matchSt = reportStatus === 'All' || (p.status || 'active') === reportStatus;
      const invSt = getInventoryStatus(p.stock || 0, p.lowStockThreshold || 5);
      const matchInv = reportStockStatus === 'All' || invSt === reportStockStatus;
      
      let matchDate = true;
      if (reportStartDate || reportEndDate) {
        const date = p.updatedAt ? new Date(p.updatedAt) : null;
        if (reportStartDate && (!date || date < new Date(reportStartDate))) matchDate = false;
        if (reportEndDate && (!date || date > new Date(new Date(reportEndDate).getTime() + 86400000))) matchDate = false;
      }
      return matchCat && matchSt && matchInv && matchDate;
    });
  }, [products, reportCategory, reportStatus, reportStockStatus, reportStartDate, reportEndDate]);

  const filteredReportInvoices = useMemo(() => {
    return invoices.filter(i => {
      let matchDate = true;
      if (reportStartDate || reportEndDate) {
        const date = i.createdAt ? new Date(i.createdAt) : null;
        if (reportStartDate && (!date || date < new Date(reportStartDate))) matchDate = false;
        if (reportEndDate && (!date || date > new Date(new Date(reportEndDate).getTime() + 86400000))) matchDate = false;
      }
      return matchDate;
    });
  }, [invoices, reportStartDate, reportEndDate]);

  const filteredReportOrders = useMemo(() => {
    return orders.filter(o => {
      let matchDate = true;
      if (reportStartDate || reportEndDate) {
        const date = o.createdAt ? new Date(o.createdAt) : null;
        if (reportStartDate && (!date || date < new Date(reportStartDate))) matchDate = false;
        if (reportEndDate && (!date || date > new Date(new Date(reportEndDate).getTime() + 86400000))) matchDate = false;
      }
      return matchDate;
    });
  }, [orders, reportStartDate, reportEndDate]);


  /* ─── DERIVED DATA ──────────────────────────── */
  const filteredProducts = useMemo(() => {
    let arr = products.filter(p => {
      const matchSearch = !searchQ || p.name?.toLowerCase().includes(searchQ.toLowerCase()) || p.code?.toLowerCase().includes(searchQ.toLowerCase());
      const matchCat = productCategoryFilter === 'All' || p.category === productCategoryFilter;
      const matchStatus = productStatusFilter === 'All' || (p.status || 'active') === productStatusFilter.toLowerCase();
      return matchSearch && matchCat && matchStatus;
    });
    arr = [...arr].sort((a, b) => {
      let av: any = a[productSortField] ?? '';
      let bv: any = b[productSortField] ?? '';
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av < bv) return productSortDir === 'asc' ? -1 : 1;
      if (av > bv) return productSortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [products, searchQ, productCategoryFilter, productStatusFilter, productSortField, productSortDir]);

  const filteredOrders = useMemo(() =>
    orders.filter(o => orderStatusFilter === 'All' || o.orderStatus === orderStatusFilter.toLowerCase()),
    [orders, orderStatusFilter]);

  const filteredInventory = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !inventorySearch || p.name?.toLowerCase().includes(inventorySearch.toLowerCase()) || p.code?.toLowerCase().includes(inventorySearch.toLowerCase());
      const status = getInventoryStatus(p.stock || 0, p.lowStockThreshold || 5);
      const matchFilter = inventoryFilter === 'All' || status === inventoryFilter.toLowerCase();
      return matchSearch && matchFilter;
    });
  }, [products, inventorySearch, inventoryFilter]);

  const productCategories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))], [products]);

  const activeStoreSettings = showPrintInvoice?._storeSettings || storeSettings;

  // Pagination
  const { paged: pagedProducts, page: prodPage, setPage: setProdPage, totalPages: prodTotalPages } = usePagination(filteredProducts, 10);
  const { paged: pagedOrders, page: ordPage, setPage: setOrdPage, totalPages: ordTotalPages } = usePagination(filteredOrders, 10);
  const { paged: pagedInventory, page: invPageNum, setPage: setInvPage, totalPages: invTotalPages } = usePagination(filteredInventory, 10);
  const { paged: pagedUsers, page: usersPage, setPage: setUsersPage, totalPages: usersTotalPages } = usePagination(users, 10);
  const { paged: pagedInvoices, page: invoicesPage, setPage: setInvoicesPage, totalPages: invoicesTotalPages } = usePagination(invoices, 10);

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
    // Load inventory log
    try {
      const log = JSON.parse(localStorage.getItem('inv_log') || '[]');
      setInventoryLog(log);
    } catch { setInventoryLog([]); }
    // Load store settings
    try {
      const savedSettings = JSON.parse(localStorage.getItem('store_settings') || 'null');
      if (savedSettings) {
        setStoreSettings(savedSettings);
        setInvoiceTaxRate(savedSettings.defaultTaxRate);
      }
    } catch { /* keep defaults */ }
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

      if (prodRes.ok) saveProducts(prodData.products || prodData.data || []);
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
        localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email, role: data.role }));
        setIsAuthenticated(true);
        loadData(data.token);
      } else {
        setLoginError(data.message || 'Access denied. Admins only.');
      }
    } catch { setLoginError('An error occurred during login.'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Delete this product?')) {
      const token = localStorage.getItem('token');
      await fetch(`/api/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
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

  const handleStockAdjust = async (productId: string, newStock: number, logEntry: any) => {
    const token = localStorage.getItem('token');
    // Update stock via API
    await fetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ stock: newStock })
    });
    // Save to inventory log
    const newLog = [logEntry, ...inventoryLog];
    setInventoryLog(newLog);
    localStorage.setItem('inv_log', JSON.stringify(newLog));
    loadData(token!);
  };

  const handleMarkMessageRead = async (id: string) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/contact/${id}/read`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
    loadData(token!);
  };

  const handleDeleteInvoice = async (id: string) => {
    if (window.confirm('Delete this invoice?')) {
      const token = localStorage.getItem('token');
      await fetch(`/api/invoices/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      loadData(token!);
    }
  };

  const handleSaveInvoice = async () => {
    if (!invoiceCustomerName.trim()) { alert('Please enter customer name'); return; }
    if (invoiceItems.length === 0 || invoiceItems.some(item => !item.name.trim())) { alert('Please add at least one valid item'); return; }
    const subtotal = invoiceItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = invoiceDiscountType === 'fixed' ? invoiceDiscountValue : (subtotal * invoiceDiscountValue) / 100;
    const taxedAmount = subtotal - discountAmount;
    const taxAmount = (taxedAmount * invoiceTaxRate) / 100;
    const total = taxedAmount + taxAmount + invoiceShippingCharges;
    const invoiceData = {
      customerName: invoiceCustomerName, customerEmail: invoiceCustomerEmail, customerPhone: invoiceCustomerPhone,
      customerAddress: invoiceCustomerAddress,
      shippingCharges: Number(invoiceShippingCharges),
      items: invoiceItems.map(item => ({ productId: item.productId || '', name: item.name, price: Number(item.price), cost: Number(item.cost), quantity: Number(item.quantity) })),
      discountType: invoiceDiscountType, discountValue: Number(invoiceDiscountValue), discountAmount, taxRate: Number(invoiceTaxRate), taxAmount, subtotal, total,
      paymentMethod: invoicePaymentMethod, notes: invoiceNotes
    };
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/invoices', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(invoiceData) });
      const data = await res.json();
      if (res.ok) {
        setInvoiceCustomerName(''); setInvoiceCustomerEmail(''); setInvoiceCustomerPhone('');
        setInvoiceCustomerAddress(''); setInvoiceShippingCharges(0); setInvoiceNotes('');
        setInvoiceDiscountValue(0); setInvoiceItems([{ productId: '', name: '', price: 0, cost: 0, quantity: 1 }]);
        loadData(token!);
        setShowPrintInvoice({ ...data.invoice, _storeSettings: storeSettings });
      } else { alert(data.message || 'Failed to save invoice'); }
    } catch { alert('Error saving invoice'); }
  };

  const handleSaveSettings = () => {
    localStorage.setItem('store_settings', JSON.stringify(storeSettings));
    setInvoiceTaxRate(storeSettings.defaultTaxRate);
    alert('Settings saved successfully!');
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ orderStatus: status })
    });
    loadData(token!);
  };

  const handleProductSort = (field: string) => {
    if (productSortField === field) {
      setProductSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setProductSortField(field);
      setProductSortDir('asc');
    }
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
          {loginError && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">{loginError}</div>}
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
            <button type="submit" className="w-full py-3.5 bg-[#164475] text-white rounded-xl font-bold hover:bg-[#0a1b2d] transition-colors mt-6">Sign In</button>
          </form>
        </div>
      </div>
    );
  }



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
                activeTab === item.id ? 'bg-[#164475] text-white shadow-lg shadow-[#164475]/30' : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
              {item.id === 'orders' && orders.filter(o => o.orderStatus === 'pending').length > 0 &&
                <span className="ml-auto bg-[#164475] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{orders.filter(o => o.orderStatus === 'pending').length}</span>}
              {item.id === 'messages' && messages.filter(m => !m.read).length > 0 &&
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{messages.filter(m => !m.read).length}</span>}
              {item.id === 'inventory' && products.filter(p => getInventoryStatus(p.stock || 0, p.lowStockThreshold || 5) !== 'in stock').length > 0 &&
                <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{products.filter(p => getInventoryStatus(p.stock || 0, p.lowStockThreshold || 5) !== 'in stock').length}</span>}
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
              {[
                { label: 'Total Revenue', value: `$${stats.revenue?.total?.toLocaleString()}`, icon: TrendingUp, color: 'text-[#164475]', bg: 'bg-[#164475]/5' },
                { label: 'Total Orders', value: stats.orders?.total, icon: Package, color: 'text-[#164475]', bg: 'bg-[#f8fafc]' },
                { label: 'Products', value: stats.products?.total, icon: ShoppingBag, color: 'text-[#164475]', bg: 'bg-[#164475]/5' },
                { label: 'New Messages', value: messages.filter(m => !m.read).length, icon: MessageSquare, color: 'text-[#164475]', bg: 'bg-[#164475]/5' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-[#64748b]">{label}</span>
                    <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-[#0a1b2d]">{value}</div>
                </div>
              ))}
            </div>

            {/* Low Stock Alert */}
            {products.filter(p => getInventoryStatus(p.stock || 0, p.lowStockThreshold || 5) !== 'in stock').length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-amber-800">Inventory Alerts</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {products.filter(p => getInventoryStatus(p.stock || 0, p.lowStockThreshold || 5) !== 'in stock').slice(0, 4).map(p => (
                    <div key={p._id} className="bg-white rounded-xl p-3 border border-amber-100 flex items-center gap-2">
                      <img src={p.image} alt={p.name} className="w-8 h-8 object-contain" />
                      <div>
                        <p className="text-xs font-bold text-[#0a1b2d] line-clamp-1">{p.name}</p>
                        <StatusBadge s={getInventoryStatus(p.stock || 0, p.lowStockThreshold || 5)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

              <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6">
                <h2 className="font-bold text-[#0a1b2d] mb-5">Inventory Overview</h2>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Total Products', value: products.length, color: 'text-[#164475]' },
                    { label: 'Total Stock Units', value: products.reduce((s, p) => s + (p.stock || 0), 0), color: 'text-[#164475]' },
                    { label: 'Low Stock', value: products.filter(p => getInventoryStatus(p.stock || 0, p.lowStockThreshold || 5) === 'low stock').length, color: 'text-amber-600' },
                    { label: 'Out of Stock', value: products.filter(p => (p.stock || 0) <= 0).length, color: 'text-red-600' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-[#f1f5f9] last:border-0">
                      <span className="text-[#64748b] font-semibold">{label}</span>
                      <span className={`font-extrabold ${color}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ PRODUCTS ═══ */}
        {activeTab === 'products' && (
          <div>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none bg-white" />
              </div>
              <div className="relative">
                <select value={productCategoryFilter} onChange={e => setProductCategoryFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 border border-[#e2e8f0] rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#164475] outline-none">
                  {productCategories.map(c => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" />
              </div>
              <div className="relative">
                <select value={productStatusFilter} onChange={e => setProductStatusFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 border border-[#e2e8f0] rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#164475] outline-none">
                  {['All', 'Active', 'Draft'].map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" />
              </div>
              <button onClick={() => exportCSV(filteredProducts, 'products.csv', [
                { key: 'name', label: 'Product Name' }, { key: 'code', label: 'SKU' }, { key: 'category', label: 'Category' },
                { key: 'price', label: 'Selling Price' }, { key: 'costPerItem', label: 'Cost Price' },
                { key: 'stock', label: 'Stock' }, { key: 'vendor', label: 'Vendor' }, { key: 'status', label: 'Status' },
              ])} className="flex items-center gap-2 px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm font-bold text-[#64748b] hover:bg-[#f8fafc] transition-colors">
                <Download className="w-4 h-4" /> Export CSV
              </button>
              <button onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
                className="flex items-center gap-2 bg-[#164475] hover:bg-[#0a1b2d] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-[#164475]/20">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                    <tr>
                      <SortTh label="Product" field="name" sortField={productSortField} sortDir={productSortDir} onSort={handleProductSort} />
                      <th className="text-left text-xs font-bold text-[#64748b] uppercase tracking-widest px-5 py-4">SKU</th>
                      <SortTh label="Category" field="category" sortField={productSortField} sortDir={productSortDir} onSort={handleProductSort} />
                      <SortTh label="Selling Price" field="price" sortField={productSortField} sortDir={productSortDir} onSort={handleProductSort} />
                      <th className="text-left text-xs font-bold text-[#64748b] uppercase tracking-widest px-5 py-4">Cost</th>
                      <SortTh label="Stock" field="stock" sortField={productSortField} sortDir={productSortDir} onSort={handleProductSort} />
                      <th className="text-left text-xs font-bold text-[#64748b] uppercase tracking-widest px-5 py-4">Status</th>
                      <th className="text-left text-xs font-bold text-[#64748b] uppercase tracking-widest px-5 py-4">Updated</th>
                      <th className="text-left text-xs font-bold text-[#64748b] uppercase tracking-widest px-5 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                    {pagedProducts.length === 0 && (
                      <tr><td colSpan={9} className="px-5 py-8 text-center text-gray-500">No products found.</td></tr>
                    )}
                    {pagedProducts.map(p => {
                      const invStatus = getInventoryStatus(p.stock || 0, p.lowStockThreshold || 5);
                      return (
                        <tr key={p._id} className="hover:bg-[#fafbfc] transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img src={p.image} alt={p.name} className="w-12 h-12 object-contain bg-[#f8fafc] rounded-xl border border-[#e2e8f0] p-1 flex-shrink-0" />
                              <div>
                                <p className="font-semibold text-[#0a1b2d] text-sm line-clamp-1 max-w-[160px]">{p.name}</p>
                                {p.tag && <StatusBadge s={p.tag.toLowerCase()} />}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-xs text-[#64748b] font-mono">{p.code}</td>
                          <td className="px-5 py-4 text-sm text-[#64748b]">{p.category || '—'}</td>
                          <td className="px-5 py-4 font-extrabold text-[#0a1b2d]">${p.price}</td>
                          <td className="px-5 py-4 text-sm text-[#64748b]">{p.costPerItem ? `$${p.costPerItem}` : '—'}</td>
                          <td className="px-5 py-4">
                            <span className={`text-sm font-bold ${invStatus === 'out of stock' ? 'text-red-600' : invStatus === 'low stock' ? 'text-amber-600' : 'text-[#0a1b2d]'}`}>
                              {p.stock || 0}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-col gap-1">
                              <StatusBadge s={p.status || 'active'} />
                              <StatusBadge s={invStatus} />
                            </div>
                          </td>
                          <td className="px-5 py-4 text-xs text-[#64748b]">
                            {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => setSelectedProductDetail(p)} className="w-8 h-8 rounded-lg bg-[#f8fafc] text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors" title="View details">
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => { setEditingProduct(p); setShowProductForm(true); }} className="w-8 h-8 rounded-lg bg-[#f8fafc] text-[#164475] flex items-center justify-center hover:bg-[#164475] hover:text-white transition-colors" title="Edit">
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handleDeleteProduct(p._id)} className="w-8 h-8 rounded-lg bg-gray-100 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors" title="Delete">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <PaginationBar page={prodPage} totalPages={prodTotalPages} setPage={setProdPage} total={filteredProducts.length} />
            </div>
          </div>
        )}

        {/* ═══ INVENTORY ═══ */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
              {[
                { label: 'Total Products', value: products.length, color: 'text-[#164475]', bg: 'bg-[#164475]/5' },
                { label: 'Total Units', value: products.reduce((s, p) => s + (p.stock || 0), 0), color: 'text-[#164475]', bg: 'bg-[#164475]/5' },
                { label: 'Stock Value (Cost)', value: `$${products.reduce((s, p) => s + (p.stock || 0) * (p.costPerItem || 0), 0).toLocaleString()}`, color: 'text-[#164475]', bg: 'bg-[#164475]/5' },
                { label: 'Low Stock', value: products.filter(p => getInventoryStatus(p.stock || 0, p.lowStockThreshold || 5) === 'low stock').length, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Out of Stock', value: products.filter(p => (p.stock || 0) <= 0).length, color: 'text-red-600', bg: 'bg-red-50' },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm">
                  <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">{label}</p>
                  <p className={`text-2xl font-black ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                <input value={inventorySearch} onChange={e => setInventorySearch(e.target.value)} placeholder="Search inventory..."
                  className="w-full pl-10 pr-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:ring-2 focus:ring-[#164475] outline-none bg-white" />
              </div>
              <div className="flex gap-2">
                {['All', 'in stock', 'low stock', 'out of stock'].map(f => (
                  <button key={f} onClick={() => setInventoryFilter(f)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors border ${inventoryFilter === f ? 'bg-[#164475] text-white border-[#164475]' : 'bg-white border-[#e2e8f0] text-[#64748b] hover:border-[#164475] hover:text-[#164475]'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                    <tr>
                      {['Product', 'SKU', 'Category', 'Stock Level', 'Low Stock At', 'Cost', 'Retail Value', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left text-xs font-bold text-[#64748b] uppercase tracking-widest px-5 py-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                    {pagedInventory.length === 0 && (
                      <tr><td colSpan={9} className="px-5 py-8 text-center text-gray-500">No inventory items found.</td></tr>
                    )}
                    {pagedInventory.map(p => {
                      const invStatus = getInventoryStatus(p.stock || 0, p.lowStockThreshold || 5);
                      const retailValue = (p.stock || 0) * p.price;
                      return (
                        <tr key={p._id} className="hover:bg-[#fafbfc] transition-colors cursor-pointer" onClick={() => setInventoryDetailProduct(p)}>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img src={p.image} alt={p.name} className="w-10 h-10 object-contain bg-[#f8fafc] rounded-lg border border-[#e2e8f0] p-0.5 flex-shrink-0" />
                              <p className="font-semibold text-[#0a1b2d] text-sm line-clamp-1 max-w-[150px]">{p.name}</p>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-xs font-mono text-[#64748b]">{p.code}</td>
                          <td className="px-5 py-4 text-sm text-[#64748b]">{p.category || '—'}</td>
                          <td className="px-5 py-4">
                            <span className={`text-sm font-extrabold ${invStatus === 'out of stock' ? 'text-red-600' : invStatus === 'low stock' ? 'text-amber-600' : 'text-emerald-600'}`}>
                              {p.stock || 0} units
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm text-[#64748b] font-medium">{p.lowStockThreshold || 5}</td>
                          <td className="px-5 py-4 text-sm text-[#64748b]">{p.costPerItem ? `$${p.costPerItem}` : '—'}</td>
                          <td className="px-5 py-4 font-semibold text-[#0a1b2d] text-sm">${retailValue.toLocaleString()}</td>
                          <td className="px-5 py-4"><StatusBadge s={invStatus} /></td>
                          <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setStockAdjustProduct(p)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#164475]/5 text-[#164475] text-xs font-bold rounded-xl hover:bg-[#164475]/10 transition-colors">
                              <SlidersHorizontal className="w-3.5 h-3.5" /> Adjust
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <PaginationBar page={invPageNum} totalPages={invTotalPages} setPage={setInvPage} total={filteredInventory.length} />
            </div>

            {/* Inventory Movement Log */}
            {inventoryLog.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-[#f1f5f9]">
                  <h3 className="font-bold text-[#0a1b2d]">Inventory Movement Log</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                      <tr>
                        {['Date', 'Product', 'Type', 'Change', 'Before', 'After', 'Reason'].map(h => (
                          <th key={h} className="text-left text-xs font-bold text-[#64748b] uppercase tracking-widest px-5 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                      {inventoryLog.slice(0, 20).map((log, i) => {
                        const prod = products.find(p => (p._id || p.id) === log.productId);
                        return (
                          <tr key={i} className="hover:bg-[#fafbfc]">
                            <td className="px-5 py-3 text-[#64748b]">{new Date(log.date).toLocaleString()}</td>
                            <td className="px-5 py-3 font-semibold text-[#0a1b2d]">{prod?.name || log.productId}</td>
                            <td className="px-5 py-3"><StatusBadge s={log.type === 'Stock In' ? 'active' : log.type === 'Stock Out' ? 'cancelled' : 'processing'} /></td>
                            <td className={`px-5 py-3 font-bold ${log.qty > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {log.qty > 0 ? `+${log.qty}` : log.qty}
                            </td>
                            <td className="px-5 py-3 text-[#64748b]">{log.before}</td>
                            <td className="px-5 py-3 font-bold text-[#0a1b2d]">{log.after}</td>
                            <td className="px-5 py-3 text-[#64748b]">{log.reason}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ ORDERS ═══ */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex gap-2 flex-wrap flex-1">
                {['All','Pending','Processing','Shipped','Delivered','Cancelled'].map(s => (
                  <button key={s} onClick={() => setOrderStatusFilter(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                      orderStatusFilter === s ? 'bg-[#164475] text-white shadow-lg shadow-[#164475]/20' : 'bg-white border border-[#e2e8f0] text-[#64748b] hover:border-[#164475] hover:text-[#164475]'
                    }`}>{s}</button>
                ))}
              </div>
              <button onClick={() => exportCSV(filteredOrders, 'orders.csv', [
                { key: 'orderId', label: 'Order ID' }, { key: 'user.name', label: 'Customer' },
                { key: 'total', label: 'Total' }, { key: 'orderStatus', label: 'Status' },
                { key: 'paymentMethod', label: 'Payment' }, { key: 'createdAt', label: 'Date' },
              ])} className="flex items-center gap-2 px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm font-bold text-[#64748b] hover:bg-[#f8fafc] transition-colors">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                  <tr>{['Order ID','Customer','Total','Fulfillment','Payment','Date','Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-bold text-[#64748b] uppercase tracking-widest px-5 py-4">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {filteredOrders.length === 0 && (
                    <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-500">No orders found.</td></tr>
                  )}
                  {pagedOrders.map(o => (
                    <tr key={o._id} className="hover:bg-[#fafbfc] transition-colors">
                      <td className="px-5 py-4 font-bold text-[#0a1b2d] text-sm font-mono">{o.orderId}</td>
                      <td className="px-5 py-4 text-sm text-[#0a1b2d] font-semibold">{o.user?.name || o.guestEmail || 'Guest'}</td>
                      <td className="px-5 py-4 font-extrabold text-[#0a1b2d]">${o.total?.toLocaleString()}</td>
                      <td className="px-5 py-4"><StatusBadge s={o.orderStatus} /></td>
                      <td className="px-5 py-4">
                        <StatusBadge s={o.paymentMethod === 'cod' ? 'cod' : (o.paymentStatus || 'paid')} />
                      </td>
                      <td className="px-5 py-4 text-sm text-[#64748b]">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <button onClick={() => setSelectedOrderDetail(o)} className="w-8 h-8 rounded-lg bg-[#f8fafc] text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors" title="View details">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <PaginationBar page={ordPage} totalPages={ordTotalPages} setPage={setOrdPage} total={filteredOrders.length} />
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
              {messages.length === 0 && <div className="p-8 text-center text-gray-500">No messages found.</div>}
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
                    <button onClick={() => handleMarkMessageRead(msg._id)} className="mt-4 text-xs font-bold text-[#164475] hover:underline">Mark as Read</button>
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
                {pagedUsers.map(u => (
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
            <PaginationBar page={usersPage} totalPages={usersTotalPages} setPage={setUsersPage} total={users.length} />
          </div>
        )}

        {/* ═══ INVOICE GENERATOR ═══ */}
        {activeTab === 'invoices' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6 space-y-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#164475]">1. Customer Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Customer Name *', value: invoiceCustomerName, setter: setInvoiceCustomerName, ph: 'Ahmad Khan...' },
                    { label: 'Customer Phone', value: invoiceCustomerPhone, setter: setInvoiceCustomerPhone, ph: '0300-1234567' },
                    { label: 'Customer Email', value: invoiceCustomerEmail, setter: setInvoiceCustomerEmail, ph: 'customer@gmail.com' },
                  ].map(({ label, value, setter, ph }) => (
                    <div key={label}>
                      <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">{label}</label>
                      <input value={value} onChange={e => setter(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:ring-1 focus:ring-[#164475] outline-none" placeholder={ph} />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Billing / Delivery Address</label>
                  <textarea value={invoiceCustomerAddress} onChange={e => setInvoiceCustomerAddress(e.target.value)}
                    rows={2} className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:ring-1 focus:ring-[#164475] outline-none resize-none"
                    placeholder="House #12, Street 4, Block B, Gulshan-e-Iqbal, Karachi" />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#164475]">2. Invoice Line Items</h3>
                  <button onClick={() => setInvoiceItems([...invoiceItems, { productId: '', name: '', price: 0, cost: 0, quantity: 1 }])}
                    className="px-3 py-1.5 bg-[#164475]/5 text-[#164475] text-xs font-bold rounded-xl hover:bg-[#164475]/10 transition-colors">+ Add Row</button>
                </div>
                <div className="space-y-3">
                  {invoiceItems.map((item, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-3 items-stretch md:items-center bg-[#f8fafc] p-4 rounded-xl border border-slate-100 relative">
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                          <select value={item.productId} onChange={(e) => {
                            const val = e.target.value;
                            const matched = products.find(p => p._id === val || p.id === val);
                            const updated = [...invoiceItems];
                            updated[idx] = { productId: val, name: matched ? matched.name : '', price: matched ? matched.price : 0, cost: matched ? (matched.costPerItem || 0) : 0, quantity: item.quantity };
                            setInvoiceItems(updated);
                          }} className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#164475]">
                            <option value="">-- Choose Item from Inventory --</option>
                            {products.map(p => <option key={p._id || p.id} value={p._id || p.id}>{p.name} (${p.price})</option>)}
                          </select>
                        </div>
                        <input value={item.name} onChange={(e) => { const updated = [...invoiceItems]; updated[idx].name = e.target.value; setInvoiceItems(updated); }}
                          className="w-full px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#164475]" placeholder="Or type manual item name..." />
                      </div>
                      <div className="flex gap-2 w-full md:w-auto items-center">
                        {[
                          { label: 'Price', key: 'price', w: 'w-24' },
                          { label: 'Cost', key: 'cost', w: 'w-24' },
                          { label: 'Qty', key: 'quantity', w: 'w-16' },
                        ].map(({ label, key, w }) => (
                          <div key={key} className={w}>
                            <label className="block text-[10px] font-bold text-gray-500 mb-0.5">{label}</label>
                            <input type="number" min={key === 'quantity' ? 1 : 0} value={item[key]}
                              onChange={(e) => { const updated = [...invoiceItems]; updated[idx][key] = +e.target.value; setInvoiceItems(updated); }}
                              className={`w-full px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#164475] ${key === 'quantity' ? 'text-center' : ''}`} />
                          </div>
                        ))}
                        <div className="pt-4">
                          <button onClick={() => { const updated = invoiceItems.filter((_, i) => i !== idx); setInvoiceItems(updated.length > 0 ? updated : [{ productId: '', name: '', price: 0, cost: 0, quantity: 1 }]); }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

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
                    <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Notes / Remarks</label>
                    <input value={invoiceNotes} onChange={e => setInvoiceNotes(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:ring-1 focus:ring-[#164475] outline-none" placeholder="Warranty note, etc..." />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6 space-y-5 sticky top-6">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#164475]">Invoice Summary</h3>
                <div className="space-y-4 border-b border-[#f1f5f9] pb-4 text-sm">
                  <div>
                    <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Discount</label>
                    <div className="flex gap-2">
                      <input type="number" value={invoiceDiscountValue} onChange={e => setInvoiceDiscountValue(+e.target.value)}
                        className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#164475]" />
                      <select value={invoiceDiscountType} onChange={e => setInvoiceDiscountType(e.target.value as any)}
                        className="w-16 px-2 py-2 border border-[#e2e8f0] rounded-xl text-sm bg-white">
                        <option value="fixed">$</option>
                        <option value="percentage">%</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">GST Rate (%)</label>
                    <input type="number" value={invoiceTaxRate} onChange={e => setInvoiceTaxRate(+e.target.value)}
                      className="w-full px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#164475]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Shipping Charges</label>
                    <input type="number" min={0} value={invoiceShippingCharges} onChange={e => setInvoiceShippingCharges(+e.target.value)}
                      className="w-full px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#164475]" />
                  </div>
                </div>
                {(() => {
                  const subtotal = invoiceItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
                  const discAmt = invoiceDiscountType === 'fixed' ? invoiceDiscountValue : (subtotal * invoiceDiscountValue) / 100;
                  const taxAmt = ((subtotal - discAmt) * invoiceTaxRate) / 100;
                  const total = subtotal - discAmt + taxAmt + invoiceShippingCharges;
                  return (
                    <div className="text-sm space-y-2 border-b border-[#f1f5f9] pb-4">
                      <div className="flex justify-between text-[#64748b]"><span className="font-semibold">Subtotal:</span><span>{storeSettings.currency}{subtotal.toFixed(2)}</span></div>
                      <div className="flex justify-between text-[#64748b]"><span className="font-semibold">Discount:</span><span>-{storeSettings.currency}{discAmt.toFixed(2)}</span></div>
                      <div className="flex justify-between text-[#64748b]"><span className="font-semibold">GST Tax:</span><span>+{storeSettings.currency}{taxAmt.toFixed(2)}</span></div>
                      {invoiceShippingCharges > 0 && <div className="flex justify-between text-[#64748b]"><span className="font-semibold">Shipping:</span><span>+{storeSettings.currency}{invoiceShippingCharges.toFixed(2)}</span></div>}
                      <div className="flex justify-between text-lg font-black text-[#0a1b2d] pt-1"><span>Grand Total:</span><span>{storeSettings.currency}{total.toFixed(2)}</span></div>
                    </div>
                  );
                })()}
                <button onClick={handleSaveInvoice}
                  className="w-full py-3.5 bg-[#164475] hover:bg-[#0a1b2d] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#164475]/20 flex items-center justify-center gap-2">
                  <Printer className="w-4 h-4" /> Save & Print Invoice
                </button>
              </div>

              {/* Saved Invoices List */}
              {invoices.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#f1f5f9]">
                    <h3 className="font-bold text-[#0a1b2d] text-sm">Recent Invoices</h3>
                  </div>
                  <div className="divide-y divide-[#f1f5f9]">
                    {pagedInvoices.map(inv => (
                      <div key={inv._id} className="px-5 py-3 flex items-center justify-between hover:bg-[#fafbfc] cursor-pointer" onClick={() => setSelectedInvoiceDetail(inv)}>
                        <div>
                          <p className="text-xs font-bold text-[#164475] font-mono">{inv.invoiceId}</p>
                          <p className="text-xs text-[#64748b]">{inv.customerName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-extrabold text-[#0a1b2d]">{storeSettings.currency}{inv.total?.toFixed(2)}</p>
                          <p className="text-[10px] text-[#64748b]">{new Date(inv.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <PaginationBar page={invoicesPage} totalPages={invoicesTotalPages} setPage={setInvoicesPage} total={invoices.length} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ REPORTS ═══ */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Sub-tab navigation */}
            <div className="flex gap-2 border-b border-[#e2e8f0] pb-px flex-wrap">
              {[
                { id: 'inventory', label: 'Inventory Report' },
                { id: 'physical', label: 'Physical Store Report' },
                { id: 'online', label: 'Online Sales Report' }
              ].map(subTab => (
                <button key={subTab.id} onClick={() => setReportSubTab(subTab.id as any)}
                  className={`px-5 py-3 font-bold text-sm border-b-2 transition-all ${reportSubTab === subTab.id ? 'border-[#164475] text-[#164475]' : 'border-transparent text-gray-500 hover:text-slate-800'}`}>
                  {subTab.label}
                </button>
              ))}
            </div>

            {/* Filters Row */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-4 flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-xs font-bold text-[#64748b] uppercase tracking-wider mb-1">Start Date</label>
                <input type="date" value={reportStartDate} onChange={e => setReportStartDate(e.target.value)}
                  className="px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm focus:ring-1 focus:ring-[#164475] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#64748b] uppercase tracking-wider mb-1">End Date</label>
                <input type="date" value={reportEndDate} onChange={e => setReportEndDate(e.target.value)}
                  className="px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm focus:ring-1 focus:ring-[#164475] outline-none" />
              </div>
              {reportSubTab === 'inventory' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#64748b] uppercase tracking-wider mb-1">Category</label>
                    <select value={reportCategory} onChange={e => setReportCategory(e.target.value)}
                      className="px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm bg-white focus:ring-1 focus:ring-[#164475] outline-none">
                      {['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#64748b] uppercase tracking-wider mb-1">Status</label>
                    <select value={reportStatus} onChange={e => setReportStatus(e.target.value)}
                      className="px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm bg-white focus:ring-1 focus:ring-[#164475] outline-none">
                      {['All', 'active', 'draft'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#64748b] uppercase tracking-wider mb-1">Stock Status</label>
                    <select value={reportStockStatus} onChange={e => setReportStockStatus(e.target.value)}
                      className="px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm bg-white focus:ring-1 focus:ring-[#164475] outline-none">
                      {['All', 'in stock', 'low stock', 'out of stock'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </>
              )}
              <div className="ml-auto flex gap-2">
                <button onClick={() => {
                  const rows = reportSubTab === 'inventory'
                    ? products.filter(p => {
                        const matchCat = reportCategory === 'All' || p.category === reportCategory;
                        const matchSt = reportStatus === 'All' || (p.status || 'active') === reportStatus;
                        const invSt = getInventoryStatus(p.stock || 0, p.lowStockThreshold || 5);
                        const matchInv = reportStockStatus === 'All' || invSt === reportStockStatus;
                        return matchCat && matchSt && matchInv;
                      })
                    : reportSubTab === 'physical' ? invoices : orders;
                  exportCSV(rows, `${reportSubTab}-report.csv`, reportSubTab === 'inventory'
                    ? [{ key: 'name', label: 'Product' }, { key: 'code', label: 'SKU' }, { key: 'category', label: 'Category' }, { key: 'stock', label: 'Stock' }, { key: 'price', label: 'Price' }, { key: 'costPerItem', label: 'Cost' }]
                    : reportSubTab === 'physical'
                    ? [{ key: 'invoiceId', label: 'Invoice' }, { key: 'customerName', label: 'Customer' }, { key: 'total', label: 'Total' }, { key: 'paymentMethod', label: 'Payment' }]
                    : [{ key: 'orderId', label: 'Order' }, { key: 'user.name', label: 'Customer' }, { key: 'total', label: 'Total' }, { key: 'orderStatus', label: 'Status' }]);
                }} className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] rounded-xl text-sm font-bold text-[#64748b] hover:bg-[#f8fafc] transition-colors">
                  <Download className="w-4 h-4" /> CSV
                </button>
                <button onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] rounded-xl text-sm font-bold text-[#64748b] hover:bg-[#f8fafc] transition-colors">
                  <Printer className="w-4 h-4" /> Print/PDF
                </button>
                <button onClick={() => {
                  const rows = reportSubTab === 'inventory' ? filteredReportProducts : reportSubTab === 'physical' ? filteredReportInvoices : filteredReportOrders;
                  exportCSV(rows, `${reportSubTab}-report.xls`, reportSubTab === 'inventory'
                    ? [{ key: 'name', label: 'Product' }, { key: 'code', label: 'SKU' }, { key: 'category', label: 'Category' }, { key: 'stock', label: 'Stock' }, { key: 'price', label: 'Price' }, { key: 'costPerItem', label: 'Cost' }]
                    : reportSubTab === 'physical'
                    ? [{ key: 'invoiceId', label: 'Invoice' }, { key: 'customerName', label: 'Customer' }, { key: 'total', label: 'Total' }, { key: 'paymentMethod', label: 'Payment' }]
                    : [{ key: 'orderId', label: 'Order' }, { key: 'user.name', label: 'Customer' }, { key: 'total', label: 'Total' }, { key: 'orderStatus', label: 'Status' }]);
                }} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors">
                  <Download className="w-4 h-4" /> Excel
                </button>
              </div>
            </div>


            {reportSubTab === 'inventory' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[
                    { label: 'Total Products', value: filteredReportProducts.length },
                    { label: 'Total Stock Units', value: filteredReportProducts.reduce((sum, p) => sum + (p.stock || 0), 0) },
                    { label: 'Inventory Cost Value', value: `${storeSettings.currency}${filteredReportProducts.reduce((sum, p) => sum + ((p.stock || 0) * (p.costPerItem || 0)), 0).toLocaleString()}` },
                    { label: 'Low Stock', value: filteredReportProducts.filter(p => getInventoryStatus(p.stock || 0, p.lowStockThreshold || 5) === 'low stock').length },
                    { label: 'Out of Stock', value: filteredReportProducts.filter(p => (p.stock || 0) <= 0).length },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm">
                      <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">{label}</p>
                      <p className="text-2xl font-black text-[#0a1b2d]">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                        <tr className="text-left text-xs font-bold text-[#64748b] uppercase tracking-widest">
                          {['Product','SKU','Category','Stock','Threshold','Cost','Price','Total Cost','Total Value','Profit','Margin'].map(h => (
                            <th key={h} className="px-5 py-4">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f1f5f9] text-sm text-[#0a1b2d]">
                        {filteredReportProducts.length === 0 && <tr><td colSpan={11} className="px-5 py-8 text-center text-gray-500">No inventory products found.</td></tr>}
                        {filteredReportProducts.map(p => {
                          const costVal = (p.stock || 0) * (p.costPerItem || 0);
                          const retailVal = (p.stock || 0) * p.price;
                          const profit = retailVal - costVal;
                          const margin = p.price > 0 && p.costPerItem ? Math.round(((p.price - p.costPerItem) / p.price) * 100) : 0;
                          const invStatus = getInventoryStatus(p.stock || 0, p.lowStockThreshold || 5);
                          return (
                            <tr key={p._id || p.id} onClick={() => setSelectedProductDetail(p)} className="hover:bg-[#fafbfc] cursor-pointer">
                              <td className="px-5 py-4 font-semibold">{p.name}</td>
                              <td className="px-5 py-4 font-mono text-xs text-[#64748b]">{p.code}</td>
                              <td className="px-5 py-4 text-[#64748b]">{p.category || '—'}</td>
                              <td className="px-5 py-4">
                                <span className={`font-bold ${invStatus === 'out of stock' ? 'text-red-600' : invStatus === 'low stock' ? 'text-amber-600' : 'text-emerald-600'}`}>{p.stock || 0}</span>
                              </td>
                              <td className="px-5 py-4 text-[#64748b]">{p.lowStockThreshold || 5}</td>
                              <td className="px-5 py-4 text-gray-500">{storeSettings.currency}{p.costPerItem || 0}</td>
                              <td className="px-5 py-4 font-semibold">{storeSettings.currency}{p.price}</td>
                              <td className="px-5 py-4 text-gray-500">{storeSettings.currency}{costVal.toLocaleString()}</td>
                              <td className="px-5 py-4 font-semibold">{storeSettings.currency}{retailVal.toLocaleString()}</td>
                              <td className="px-5 py-4 font-extrabold text-[#164475]">{storeSettings.currency}{profit.toLocaleString()}</td>
                              <td className="px-5 py-4 font-bold text-slate-500">{margin}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {reportSubTab === 'physical' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {(() => {
                    const totalRev = filteredReportInvoices.reduce((sum, i) => sum + i.total, 0);
                    const totalCOGS = filteredReportInvoices.reduce((sum, i) => sum + i.items.reduce((s: number, item: any) => s + (item.cost || 0) * item.quantity, 0), 0);
                    const totalDisc = filteredReportInvoices.reduce((sum, i) => sum + (i.discountAmount || 0), 0);
                    const totalTax = filteredReportInvoices.reduce((sum, i) => sum + (i.taxAmount || 0), 0);
                    return [
                      { label: 'Total Invoices', value: filteredReportInvoices.length },
                      { label: 'Physical Revenue', value: `${storeSettings.currency}${totalRev.toLocaleString()}` },
                      { label: 'Total Discount', value: `-${storeSettings.currency}${totalDisc.toLocaleString()}` },
                      { label: 'Total GST Tax Collected', value: `${storeSettings.currency}${totalTax.toLocaleString()}` },
                      { label: 'Net Profit', value: `${storeSettings.currency}${(totalRev - totalCOGS).toLocaleString()}` },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm">
                        <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">{label}</p>
                        <p className="text-2xl font-black text-[#0a1b2d]">{value}</p>
                      </div>
                    ));
                  })()}
                </div>
                <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                        <tr className="text-left text-xs font-bold text-[#64748b] uppercase tracking-widest">
                          {['Invoice ID','Customer','Date','Items','Discount','GST Tax','Total','Profit'].map(h => <th key={h} className="px-5 py-4">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f1f5f9] text-sm text-[#0a1b2d]">
                        {filteredReportInvoices.length === 0 && <tr><td colSpan={8} className="px-5 py-8 text-center text-gray-500">No invoices found.</td></tr>}
                        {filteredReportInvoices.map(i => {
                          const cogs = i.items.reduce((s: number, item: any) => s + (item.cost || 0) * item.quantity, 0);
                          return (
                            <tr key={i._id} onClick={() => setSelectedInvoiceDetail(i)} className="hover:bg-[#fafbfc] cursor-pointer">
                              <td className="px-5 py-4 font-bold font-mono text-[#164475]">{i.invoiceId}</td>
                              <td className="px-5 py-4 font-semibold">{i.customerName}</td>
                              <td className="px-5 py-4 text-[#64748b]">{new Date(i.createdAt).toLocaleDateString()}</td>
                              <td className="px-5 py-4 text-center">{i.items.length}</td>
                              <td className="px-5 py-4 text-red-500">-{storeSettings.currency}{i.discountAmount || 0}</td>
                              <td className="px-5 py-4 text-gray-500">{storeSettings.currency}{i.taxAmount || 0}</td>
                              <td className="px-5 py-4 font-bold">{storeSettings.currency}{i.total.toLocaleString()}</td>
                              <td className="px-5 py-4 font-extrabold text-[#164475]">{storeSettings.currency}{(i.total - cogs).toLocaleString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {reportSubTab === 'online' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {(() => {
                    const active = filteredReportOrders.filter(o => o.orderStatus !== 'cancelled');
                    const rev = active.reduce((sum, o) => sum + o.total, 0);
                    const cogs = active.reduce((sum, o) => {
                      return sum + (o.items?.reduce((is: number, item: any) => {
                        const matched = products.find(p => p._id === item.product || p.id === item.product);
                        return is + (matched ? (matched.costPerItem || 0) : Math.round(item.price * 0.65)) * item.quantity;
                      }, 0) || 0);
                    }, 0);
                    return [
                      { label: 'Online Orders', value: active.length },
                      { label: 'Online Revenue', value: `${storeSettings.currency}${rev.toLocaleString()}` },
                      { label: 'Est. Cost of Goods', value: `${storeSettings.currency}${cogs.toLocaleString()}` },
                      { label: 'Online Net Profit', value: `${storeSettings.currency}${(rev - cogs).toLocaleString()}` },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm">
                        <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">{label}</p>
                        <p className="text-2xl font-black text-[#0a1b2d]">{value}</p>
                      </div>
                    ));
                  })()}
                </div>
                <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                        <tr className="text-left text-xs font-bold text-[#64748b] uppercase tracking-widest">
                          {['Order ID','Customer','Date','Status','Payment','Total','Est. Profit'].map(h => <th key={h} className="px-5 py-4">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f1f5f9] text-sm text-[#0a1b2d]">
                        {filteredReportOrders.length === 0 && <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-500">No orders found.</td></tr>}
                        {filteredReportOrders.map(o => {
                          const cogs = o.items?.reduce((is: number, item: any) => {
                            const matched = products.find(p => p._id === item.product || p.id === item.product);
                            return is + (matched ? (matched.costPerItem || 0) : Math.round(item.price * 0.65)) * item.quantity;
                          }, 0) || 0;
                          const profit = o.orderStatus === 'cancelled' ? 0 : o.total - cogs;
                          return (
                            <tr key={o._id} onClick={() => setSelectedOrderDetail(o)} className="hover:bg-[#fafbfc] cursor-pointer">
                              <td className="px-5 py-4 font-bold font-mono text-[#164475]">{o.orderId}</td>
                              <td className="px-5 py-4 font-semibold">{o.user?.name || o.guestEmail || 'Guest'}</td>
                              <td className="px-5 py-4 text-[#64748b]">{new Date(o.createdAt).toLocaleDateString()}</td>
                              <td className="px-5 py-4"><StatusBadge s={o.orderStatus} /></td>
                              <td className="px-5 py-4 capitalize text-[#64748b]">{o.paymentMethod}</td>
                              <td className="px-5 py-4 font-bold">{storeSettings.currency}{o.total.toLocaleString()}</td>
                              <td className="px-5 py-4 font-extrabold text-[#164475]">{storeSettings.currency}{profit.toLocaleString()}</td>
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

        {/* ═══ SETTINGS ═══ */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6 max-w-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#0a1b2d]">Store Settings</h2>
              <p className="text-xs text-[#64748b] mt-1">Configure your store information, tax rates, and default currency.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Store Name</label>
                <input value={storeSettings.storeName} onChange={e => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:ring-1 focus:ring-[#164475] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Store Phone</label>
                <input value={storeSettings.storePhone} onChange={e => setStoreSettings({ ...storeSettings, storePhone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:ring-1 focus:ring-[#164475] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Store Email</label>
                <input value={storeSettings.storeEmail} onChange={e => setStoreSettings({ ...storeSettings, storeEmail: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:ring-1 focus:ring-[#164475] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">GST/Tax Number</label>
                <input value={storeSettings.gstNumber} onChange={e => setStoreSettings({ ...storeSettings, gstNumber: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:ring-1 focus:ring-[#164475] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Currency Symbol</label>
                <input value={storeSettings.currency} onChange={e => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:ring-1 focus:ring-[#164475] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Default GST/Tax Rate (%)</label>
                <input type="number" value={storeSettings.defaultTaxRate} onChange={e => setStoreSettings({ ...storeSettings, defaultTaxRate: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:ring-1 focus:ring-[#164475] outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Store Address</label>
              <textarea value={storeSettings.storeAddress} onChange={e => setStoreSettings({ ...storeSettings, storeAddress: e.target.value })}
                rows={3} className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:ring-1 focus:ring-[#164475] outline-none resize-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0a1b2d] mb-1.5">Invoice Terms & Conditions</label>
              <textarea value={storeSettings.terms} onChange={e => setStoreSettings({ ...storeSettings, terms: e.target.value })}
                rows={4} className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:ring-1 focus:ring-[#164475] outline-none" />
            </div>

            <button onClick={handleSaveSettings}
              className="w-full py-3 bg-[#164475] hover:bg-[#0a1b2d] text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-[#164475]/20">
              Save Settings
            </button>
          </div>
        )}
      </main>

      {/* ═══ MODALS ═══ */}

      {/* Product Form */}
      {showProductForm && (
        <ProductFormModal product={editingProduct} onClose={() => { setShowProductForm(false); setEditingProduct(null); }} onSave={handleSaveProduct} />
      )}

      {/* Stock Adjust */}
      {stockAdjustProduct && (
        <StockAdjustModal product={stockAdjustProduct} onClose={() => setStockAdjustProduct(null)} onSave={handleStockAdjust} />
      )}

      {/* Inventory Detail Modal */}
      {inventoryDetailProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setInventoryDetailProduct(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-[#e2e8f0] pb-4">
              <h2 className="text-xl font-bold text-[#0a1b2d]">Inventory Detail</h2>
              <button onClick={() => setInventoryDetailProduct(null)} className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#e2e8f0]"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex items-center gap-4 bg-[#f8fafc] p-4 rounded-2xl border border-[#e2e8f0]">
              <img src={inventoryDetailProduct.image} alt={inventoryDetailProduct.name} className="w-20 h-20 object-contain bg-white rounded-xl border border-[#e2e8f0] p-1" />
              <div>
                <h3 className="font-bold text-[#0a1b2d]">{inventoryDetailProduct.name}</h3>
                <p className="text-xs font-mono text-[#64748b]">SKU: {inventoryDetailProduct.code}</p>
                <p className="text-xs text-[#64748b]">Category: {inventoryDetailProduct.category || 'N/A'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Current Stock', value: `${inventoryDetailProduct.stock || 0} units`, color: 'text-[#164475]' },
                { label: 'Low Stock At', value: `${inventoryDetailProduct.lowStockThreshold || 5} units`, color: 'text-amber-600' },
                { label: 'Stock Value', value: `$${((inventoryDetailProduct.stock || 0) * (inventoryDetailProduct.costPerItem || 0)).toLocaleString()}`, color: 'text-[#0a1b2d]' },
                { label: 'Status', value: getInventoryStatus(inventoryDetailProduct.stock || 0, inventoryDetailProduct.lowStockThreshold || 5), color: 'text-[#0a1b2d]' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0]">
                  <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mb-1">{label}</p>
                  <p className={`font-bold text-sm ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Related invoice history */}
            <div>
              <h4 className="font-bold text-[#0a1b2d] text-sm mb-3">Related Invoices</h4>
              <div className="space-y-2">
                {invoices.filter(inv => inv.items.some((item: any) => item.productId === (inventoryDetailProduct._id || inventoryDetailProduct.id))).length === 0 ? (
                  <p className="text-xs text-[#64748b]">No invoice transactions found for this product.</p>
                ) : (
                  invoices.filter(inv => inv.items.some((item: any) => item.productId === (inventoryDetailProduct._id || inventoryDetailProduct.id))).map(inv => (
                    <div key={inv._id} className="flex items-center justify-between bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0] text-sm">
                      <span className="font-mono text-[#164475] font-bold">{inv.invoiceId}</span>
                      <span className="text-[#64748b]">{inv.customerName}</span>
                      <span className="text-[#64748b]">{new Date(inv.createdAt).toLocaleDateString()}</span>
                      <span className="font-bold text-[#0a1b2d]">${inv.total}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Adjustment log for this product */}
            <div>
              <h4 className="font-bold text-[#0a1b2d] text-sm mb-3">Inventory Movement History</h4>
              <div className="space-y-2">
                {inventoryLog.filter(l => l.productId === (inventoryDetailProduct._id || inventoryDetailProduct.id)).length === 0 ? (
                  <p className="text-xs text-[#64748b]">No manual adjustments recorded.</p>
                ) : (
                  inventoryLog.filter(l => l.productId === (inventoryDetailProduct._id || inventoryDetailProduct.id)).map((log, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0] text-sm">
                      <span className="text-[#64748b] text-xs">{new Date(log.date).toLocaleString()}</span>
                      <StatusBadge s={log.type === 'Stock In' ? 'active' : log.type === 'Stock Out' ? 'cancelled' : 'processing'} />
                      <span className={`font-bold ${log.qty > 0 ? 'text-emerald-600' : 'text-red-600'}`}>{log.qty > 0 ? `+${log.qty}` : log.qty}</span>
                      <span className="text-[#64748b]">{log.before} → {log.after}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => { setStockAdjustProduct(inventoryDetailProduct); setInventoryDetailProduct(null); }}
                className="flex-1 py-3 bg-[#164475] hover:bg-[#0a1b2d] text-white rounded-xl text-sm font-bold transition-colors">Adjust Stock</button>
              <button onClick={() => setInventoryDetailProduct(null)} className="flex-1 py-3 border border-[#e2e8f0] text-[#64748b] rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedProductDetail(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-[#e2e8f0] pb-4">
              <h2 className="text-xl font-bold text-[#0a1b2d]">Product Details</h2>
              <button onClick={() => setSelectedProductDetail(null)} className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#e2e8f0]"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <img src={selectedProductDetail.image} alt={selectedProductDetail.name} className="w-full h-64 object-contain bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] p-2" />
                {selectedProductDetail.additionalImages?.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto py-1">
                    {selectedProductDetail.additionalImages.map((img: string, idx: number) => (
                      <img key={idx} src={img} alt="Gallery" className="w-16 h-16 object-contain border border-[#e2e8f0] bg-white rounded-lg p-1 flex-shrink-0" />
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#0a1b2d]">{selectedProductDetail.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs font-mono text-[#64748b] bg-slate-100 px-2 py-0.5 rounded">SKU: {selectedProductDetail.code}</span>
                    {selectedProductDetail.barcode && <span className="text-xs font-mono text-[#64748b] bg-slate-100 px-2 py-0.5 rounded">Barcode: {selectedProductDetail.barcode}</span>}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <StatusBadge s={selectedProductDetail.status || 'active'} />
                    <StatusBadge s={getInventoryStatus(selectedProductDetail.stock || 0, selectedProductDetail.lowStockThreshold || 5)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: 'Retail Price', value: `$${selectedProductDetail.price}`, bold: true },
                    { label: 'Cost per Item', value: `$${selectedProductDetail.costPerItem || 0}`, bold: false },
                    { label: 'Margin', value: `${selectedProductDetail.price > 0 && selectedProductDetail.costPerItem ? Math.round(((selectedProductDetail.price - selectedProductDetail.costPerItem) / selectedProductDetail.price) * 100) : 0}%`, bold: true },
                    { label: 'Stock Available', value: `${selectedProductDetail.stock ?? 0} units`, bold: true },
                    { label: 'Low Stock Alert', value: `${selectedProductDetail.lowStockThreshold || 5} units`, bold: false },
                    { label: 'Vendor', value: selectedProductDetail.vendor || 'Generic', bold: false },
                  ].map(({ label, value, bold }) => (
                    <div key={label} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider">{label}</p>
                      <p className={`${bold ? 'font-extrabold' : 'font-semibold'} text-[#0a1b2d] text-sm mt-0.5`}>{value}</p>
                    </div>
                  ))}
                </div>
                {selectedProductDetail.variants?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">Variants</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProductDetail.variants.map((v: string, i: number) => (
                        <span key={i} className="bg-white border border-[#e2e8f0] text-[#0a1b2d] text-xs font-semibold px-2.5 py-1 rounded-lg">{v}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sales History */}
            <div>
              <h4 className="font-bold text-[#0a1b2d] text-sm mb-3">Sales History (Online Orders)</h4>
              <div className="space-y-2">
                {orders.filter(o => o.items?.some((item: any) => item.product === (selectedProductDetail._id || selectedProductDetail.id))).length === 0 ? (
                  <p className="text-xs text-[#64748b]">No online order history for this product.</p>
                ) : (
                  orders.filter(o => o.items?.some((item: any) => item.product === (selectedProductDetail._id || selectedProductDetail.id))).slice(0, 5).map(o => (
                    <div key={o._id} className="flex items-center justify-between bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0] text-sm">
                      <span className="font-mono text-[#164475] font-bold">{o.orderId}</span>
                      <span className="text-[#64748b]">{o.user?.name || 'Guest'}</span>
                      <span className="text-[#64748b]">{new Date(o.createdAt).toLocaleDateString()}</span>
                      <StatusBadge s={o.orderStatus} />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Related Store Invoices */}
            <div>
              <h4 className="font-bold text-[#0a1b2d] text-sm mb-3">Related Store Invoices</h4>
              <div className="space-y-2">
                {invoices.filter(inv => inv.items.some((item: any) => item.productId === (selectedProductDetail._id || selectedProductDetail.id))).length === 0 ? (
                  <p className="text-xs text-[#64748b]">No store invoice transactions found for this product.</p>
                ) : (
                  invoices.filter(inv => inv.items.some((item: any) => item.productId === (selectedProductDetail._id || selectedProductDetail.id))).map(inv => (
                    <div key={inv._id} className="flex items-center justify-between bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0] text-sm">
                      <span className="font-mono text-[#164475] font-bold">{inv.invoiceId}</span>
                      <span className="text-[#64748b]">{inv.customerName}</span>
                      <span className="text-[#64748b]">{new Date(inv.createdAt).toLocaleDateString()}</span>
                      <span className="font-bold text-[#0a1b2d]">{storeSettings.currency}{inv.total}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Inventory Movement History */}
            <div>
              <h4 className="font-bold text-[#0a1b2d] text-sm mb-3">Inventory Movement History</h4>
              <div className="space-y-2">
                {inventoryLog.filter(l => l.productId === (selectedProductDetail._id || selectedProductDetail.id)).length === 0 ? (
                  <p className="text-xs text-[#64748b]">No manual adjustments recorded.</p>
                ) : (
                  inventoryLog.filter(l => l.productId === (selectedProductDetail._id || selectedProductDetail.id)).map((log, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0] text-sm">
                      <span className="text-[#64748b] text-xs">{new Date(log.date).toLocaleString()}</span>
                      <StatusBadge s={log.type === 'Stock In' ? 'active' : log.type === 'Stock Out' ? 'cancelled' : 'processing'} />
                      <span className={`font-bold ${log.qty > 0 ? 'text-emerald-600' : 'text-red-600'}`}>{log.qty > 0 ? `+${log.qty}` : log.qty}</span>
                      <span className="text-[#64748b]">{log.before} → {log.after}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-[#e2e8f0]">
              <h4 className="text-xs font-extrabold text-[#0a1b2d] uppercase tracking-wider mb-2">Description</h4>
              <p className="text-sm text-[#64748b] whitespace-pre-wrap leading-relaxed">{selectedProductDetail.description || 'No description provided.'}</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setEditingProduct(selectedProductDetail); setShowProductForm(true); setSelectedProductDetail(null); }}
                className="flex-1 py-3 bg-[#164475] hover:bg-[#0a1b2d] text-white rounded-xl text-sm font-bold transition-colors">Edit Product</button>
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
              <button onClick={() => setSelectedOrderDetail(null)} className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#e2e8f0]"><X className="w-4 h-4" /></button>
            </div>

            {/* Order Timeline */}
            <div className="bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0]">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#164475] mb-4">Order Timeline</h3>
              <div className="flex items-center justify-between relative">
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-[#e2e8f0] z-0" />
                {[
                  { label: 'Placed', icon: CheckCircle, statuses: ['pending', 'processing', 'shipped', 'delivered'] },
                  { label: 'Processing', icon: Clock, statuses: ['processing', 'shipped', 'delivered'] },
                  { label: 'Shipped', icon: Truck, statuses: ['shipped', 'delivered'] },
                  { label: 'Delivered', icon: CheckSquare, statuses: ['delivered'] },
                ].map(({ label, icon: Icon, statuses }) => {
                  const isActive = statuses.includes(selectedOrderDetail.orderStatus);
                  const isCancelled = selectedOrderDetail.orderStatus === 'cancelled';
                  return (
                    <div key={label} className="flex flex-col items-center gap-2 z-10 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isCancelled ? 'bg-red-50 border-red-200 text-red-400' : isActive ? 'bg-[#164475] border-[#164475] text-white' : 'bg-white border-[#e2e8f0] text-[#94a3b8]'}`}>
                        {isCancelled ? <X className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                      </div>
                      <span className={`text-xs font-bold ${isCancelled ? 'text-red-400' : isActive ? 'text-[#164475]' : 'text-[#94a3b8]'}`}>{label}</span>
                    </div>
                  );
                })}
                {selectedOrderDetail.orderStatus === 'cancelled' && (
                  <div className="flex flex-col items-center gap-2 z-10 flex-1">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 bg-red-50 border-red-300 text-red-500">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-red-500">Cancelled</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#f8fafc] p-4 rounded-2xl border border-[#e2e8f0] space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#164475]">Customer Information</h3>
                <div className="text-sm space-y-1.5 text-[#0a1b2d]">
                  <p><span className="text-[#64748b] font-semibold">Name:</span> {selectedOrderDetail.user?.name || selectedOrderDetail.shippingAddress?.fullName || 'Guest'}</p>
                  <p><span className="text-[#64748b] font-semibold">Email:</span> {selectedOrderDetail.user?.email || selectedOrderDetail.guestEmail || 'N/A'}</p>
                  <p><span className="text-[#64748b] font-semibold">Phone:</span> {selectedOrderDetail.shippingAddress?.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="bg-[#f8fafc] p-4 rounded-2xl border border-[#e2e8f0] space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#164475]">Shipping Address</h3>
                <div className="text-sm space-y-1.5 text-[#0a1b2d]">
                  <p><span className="text-[#64748b] font-semibold">Address:</span> {selectedOrderDetail.shippingAddress?.street || selectedOrderDetail.shippingAddress?.address}</p>
                  <p><span className="text-[#64748b] font-semibold">City:</span> {selectedOrderDetail.shippingAddress?.city}</p>
                  <p><span className="text-[#64748b] font-semibold">Country:</span> {selectedOrderDetail.shippingAddress?.country || 'Pakistan'}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-[#e2e8f0] flex flex-wrap gap-4 items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Update Status</p>
                <div className="flex gap-2 items-center mt-1">
                  <StatusBadge s={selectedOrderDetail.orderStatus} />
                  <span className="text-xs text-slate-400 capitalize">• Pay: {selectedOrderDetail.paymentMethod}</span>
                </div>
              </div>
              <select value={selectedOrderDetail.orderStatus}
                onChange={(e) => {
                  handleUpdateOrderStatus(selectedOrderDetail.orderId, e.target.value);
                  setSelectedOrderDetail((prev: any) => ({ ...prev, orderStatus: e.target.value }));
                }}
                className="px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#164475]">
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                  <option key={s} value={s}>{s.toUpperCase()}</option>
                ))}
              </select>
            </div>

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
                <h2 className="text-xl font-bold text-[#0a1b2d]">Store Invoice</h2>
                <p className="text-xs text-[#64748b] font-mono mt-0.5">{selectedInvoiceDetail.invoiceId} • {new Date(selectedInvoiceDetail.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setShowPrintInvoice(selectedInvoiceDetail); setSelectedInvoiceDetail(null); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#164475] hover:bg-[#0a1b2d] text-white rounded-xl transition-all">
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button onClick={() => setSelectedInvoiceDetail(null)} className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#e2e8f0]"><X className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0]">
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#164475]">Customer</h3>
                <p className="text-sm font-semibold text-[#0a1b2d]">{selectedInvoiceDetail.customerName}</p>
                {selectedInvoiceDetail.customerPhone && <p className="text-xs text-[#64748b]">Ph: {selectedInvoiceDetail.customerPhone}</p>}
                {selectedInvoiceDetail.customerEmail && <p className="text-xs text-[#64748b]">Email: {selectedInvoiceDetail.customerEmail}</p>}
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#164475]">Payment</h3>
                <p className="text-sm text-[#0a1b2d] font-semibold">{selectedInvoiceDetail.paymentMethod}</p>
                <StatusBadge s="paid" />
              </div>
            </div>

            <div className="border border-[#e2e8f0] rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#64748b] font-bold text-xs uppercase">
                  <tr>
                    <th className="text-left px-4 py-3">Description</th>
                    <th className="text-right px-4 py-3">Cost</th>
                    <th className="text-right px-4 py-3">Price</th>
                    <th className="text-center px-4 py-3">Qty</th>
                    <th className="text-right px-4 py-3">Total</th>
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

            <div className="flex justify-between items-start pt-2 border-t border-[#e2e8f0]">
              <div className="text-xs text-[#64748b] bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="font-bold text-[#0a1b2d] block mb-1">Profit Summary</span>
                <p>Revenue: <span className="font-bold">${selectedInvoiceDetail.total}</span></p>
                <p>COGS: <span className="font-bold">${selectedInvoiceDetail.items?.reduce((s: number, i: any) => s + (i.cost || 0) * i.quantity, 0)}</span></p>
                <p className="mt-1 font-extrabold text-[#164475]">Profit: ${Math.round(selectedInvoiceDetail.total - selectedInvoiceDetail.items?.reduce((s: number, i: any) => s + (i.cost || 0) * i.quantity, 0))}</p>
              </div>
              <div className="w-64 text-sm space-y-2">
                <div className="flex justify-between text-[#64748b]"><span className="font-semibold">Subtotal:</span><span>${selectedInvoiceDetail.subtotal}</span></div>
                <div className="flex justify-between text-[#64748b]"><span className="font-semibold">Discount:</span><span>-${selectedInvoiceDetail.discountAmount}</span></div>
                <div className="flex justify-between text-[#64748b]"><span className="font-semibold">GST ({selectedInvoiceDetail.taxRate}%):</span><span>+${selectedInvoiceDetail.taxAmount}</span></div>
                <div className="flex justify-between text-base font-extrabold text-[#0a1b2d] pt-2 border-t border-[#e2e8f0]"><span>Total:</span><span>${selectedInvoiceDetail.total}</span></div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => { handleDeleteInvoice(selectedInvoiceDetail._id); setSelectedInvoiceDetail(null); }}
                className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold transition-colors">Delete Invoice</button>
              <button onClick={() => setSelectedInvoiceDetail(null)} className="flex-1 py-2.5 bg-slate-100 font-bold text-[#64748b] rounded-xl hover:bg-slate-200 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Print Invoice Modal */}
      {showPrintInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <style>{`
            @media print {
              body * { visibility: hidden; }
              #print-area, #print-area * { visibility: visible; }
              #print-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; box-shadow: none !important; }
              .print\\:hidden { display: none !important; }
            }
          `}</style>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8" id="print-area">
            <div className="flex justify-between items-center border-b border-[#e2e8f0] pb-4 mb-6 print:hidden">
              <h3 className="font-bold text-lg text-[#0a1b2d]">Invoice Print Preview</h3>
              <div className="flex gap-2">
                <button onClick={() => window.print()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#164475] hover:bg-[#0a1b2d] text-white font-bold rounded-xl text-sm">
                  <Printer className="w-4 h-4" /> Print Document
                </button>
                <button onClick={() => setShowPrintInvoice(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm">Close</button>
              </div>
            </div>

                <div className="p-4 space-y-6">
                  <div className="flex justify-between items-start border-b-2 border-[#164475] pb-6">
                    <div>
                      <h1 className="text-3xl font-black tracking-tight text-[#0a1b2d]">{activeStoreSettings.storeName.toUpperCase()}</h1>
                      <p className="text-xs text-[#64748b] font-semibold mt-1">Pakistan's Premium Gaming & Desktop Hardware Store</p>
                      <p className="text-xs text-[#64748b]">{activeStoreSettings.storeAddress}</p>
                      <p className="text-xs text-[#64748b]">WhatsApp: {activeStoreSettings.storePhone} | {activeStoreSettings.storeEmail}</p>
                      {activeStoreSettings.gstNumber && <p className="text-xs text-[#64748b]"><span className="font-semibold">GST:</span> {activeStoreSettings.gstNumber}</p>}
                    </div>
                    <div className="text-right">
                      <div className="inline-block bg-[#0a1b2d] text-white text-xs font-extrabold uppercase px-3 py-1 rounded-md mb-2">OFFLINE INVOICE</div>
                      <h2 className="text-xl font-bold text-[#0a1b2d] font-mono">{showPrintInvoice.invoiceId}</h2>
                      <p className="text-xs text-[#64748b]"><span className="font-semibold">Date:</span> {new Date(showPrintInvoice.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs text-[#64748b]"><span className="font-semibold">Payment:</span> {showPrintInvoice.paymentMethod}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div>
                      <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#164475] mb-2">Billed To</h4>
                      <p className="text-sm font-bold text-[#0a1b2d]">{showPrintInvoice.customerName}</p>
                      {showPrintInvoice.customerPhone && <p className="text-xs text-[#64748b] mt-0.5">Ph: {showPrintInvoice.customerPhone}</p>}
                      {showPrintInvoice.customerEmail && <p className="text-xs text-[#64748b]">Email: {showPrintInvoice.customerEmail}</p>}
                      {showPrintInvoice.customerAddress && <p className="text-xs text-[#64748b] mt-1 whitespace-pre-wrap"><span className="font-semibold">Address:</span> {showPrintInvoice.customerAddress}</p>}
                    </div>
                    <div>
                      <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#164475] mb-2">Terms & Conditions</h4>
                      <p className="text-[10px] text-[#64748b] leading-tight whitespace-pre-wrap">
                        {activeStoreSettings.terms}
                      </p>
                    </div>
                  </div>

                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-200 text-[#0a1b2d] font-extrabold text-xs uppercase">
                        <th className="py-2.5">Item Description</th>
                        <th className="text-right py-2.5">Unit Price</th>
                        <th className="text-center py-2.5">Qty</th>
                        <th className="text-right py-2.5">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {showPrintInvoice.items?.map((item: any, idx: number) => (
                        <tr key={idx} className="text-[#0a1b2d]">
                          <td className="py-3 font-medium">{item.name}</td>
                          <td className="text-right py-3">{activeStoreSettings.currency}{item.price?.toFixed(2)}</td>
                          <td className="text-center py-3">{item.quantity}</td>
                          <td className="text-right py-3 font-bold">{activeStoreSettings.currency}{(item.price * item.quantity)?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <div className="w-72 text-sm space-y-2 text-[#0a1b2d]">
                      <div className="flex justify-between text-[#64748b]"><span className="font-semibold">Subtotal:</span><span>{activeStoreSettings.currency}{showPrintInvoice.subtotal?.toFixed(2)}</span></div>
                      {showPrintInvoice.discountAmount > 0 && (
                        <div className="flex justify-between text-[#64748b]">
                          <span className="font-semibold">Discount ({showPrintInvoice.discountType === 'percentage' ? `${showPrintInvoice.discountValue}%` : 'Fixed'}):</span>
                          <span>-{showPrintInvoice.discountType === 'percentage' ? '' : activeStoreSettings.currency}{showPrintInvoice.discountAmount?.toFixed(2)}</span>
                        </div>
                      )}
                      {showPrintInvoice.taxAmount > 0 && (
                        <div className="flex justify-between text-[#64748b]">
                          <span className="font-semibold">GST ({showPrintInvoice.taxRate}%):</span>
                          <span>+{activeStoreSettings.currency}{showPrintInvoice.taxAmount?.toFixed(2)}</span>
                        </div>
                      )}
                      {showPrintInvoice.shippingCharges > 0 && (
                        <div className="flex justify-between text-[#64748b]">
                          <span className="font-semibold">Shipping:</span>
                          <span>+{activeStoreSettings.currency}{showPrintInvoice.shippingCharges?.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-black bg-[#164475]/5 px-3 py-2 rounded-xl text-[#0a1b2d] border-t-2 border-[#164475] mt-1">
                        <span>Total Bill:</span><span>{activeStoreSettings.currency}{showPrintInvoice.total?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

              {showPrintInvoice.notes && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                  <span className="font-extrabold text-[#0a1b2d] uppercase tracking-wider block mb-1">Remarks</span>
                  <p className="text-slate-600 italic">{showPrintInvoice.notes}</p>
                </div>
              )}

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
