import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { getProducts, INITIAL_PRODUCTS } from '../utils/storage';
import { Filter, ChevronDown, ShoppingCart } from 'lucide-react';


interface SearchPageProps {
  handleAddToCart: (product: Product) => void;
  formatPrice: (usdAmount: number) => string;
}

export default function SearchPage({ handleAddToCart, formatPrice }: SearchPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(5000);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');
  
  const categories = ['All', 'Headphones', 'Earphones', 'Speakers', 'Accessories'];
  const [allProducts, setAllProducts] = useState<Product[]>(() => INITIAL_PRODUCTS);
  useEffect(() => {
    setAllProducts(getProducts());
  }, []);

  const filteredProducts = allProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = p.price <= priceRange;
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesPrice && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    return 0; // Featured/Default
  });

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#fafbfc]">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-4xl font-extrabold text-[#0a1b2d] mb-2">Search Products</h1>
        <p className="text-[#64748b] mb-8">Find exactly what you're looking for in our premium catalog.</p>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-sm sticky top-32">
              <div className="flex items-center gap-2 mb-6 text-[#0a1b2d] font-bold text-lg">
                <Filter className="w-5 h-5 text-[#164475]" /> Filters
              </div>
              
              <div className="mb-6">
                <input 
                  type="text" 
                  placeholder="Search keywords..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#cbd5e1] focus:ring-2 focus:ring-[#164475] focus:border-[#164475] outline-none text-sm"
                />
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-[#0a1b2d] mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedCategory === cat ? 'border-[#164475] bg-[#164475]' : 'border-[#cbd5e1] group-hover:border-[#164475]'}`}>
                        {selectedCategory === cat && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                      </div>
                      <span className={`text-sm ${selectedCategory === cat ? 'font-bold text-[#0a1b2d]' : 'text-[#64748b] group-hover:text-[#0a1b2d]'}`} onClick={() => setSelectedCategory(cat)}>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-[#0a1b2d] mb-3">Max Price: {formatPrice(priceRange)}</h3>
                <input 
                  type="range" 
                  min="50" max="5000" step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#164475]"
                />
              </div>

              <button 
                onClick={() => {setSearchTerm(''); setPriceRange(5000); setSelectedCategory('All'); setSortBy('Featured');}}
                className="w-full bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0a1b2d] font-bold py-3 rounded-xl transition-colors text-sm"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="w-full lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-[#64748b] font-medium">Showing <strong className="text-[#0a1b2d]">{filteredProducts.length}</strong> results</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#64748b] font-medium">Sort by:</span>
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-[#cbd5e1] rounded-xl pl-4 pr-10 py-2 text-sm font-bold text-[#0a1b2d] focus:outline-none focus:ring-2 focus:ring-[#164475] cursor-pointer"
                  >
                    <option>Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] pointer-events-none" />
                </div>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-3xl p-5 border border-[#e2e8f0] shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
                    <Link href={`/product/${product.id}`} className="block relative aspect-square mb-6 overflow-hidden rounded-2xl bg-[#f8fafc]">
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 p-4" />
                      {product.tag && (
                        <span className="absolute top-3 left-3 bg-[#164475] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                          {product.tag}
                        </span>
                      )}
                    </Link>
                    <div className="flex-1 flex flex-col">
                      <div className="text-xs font-bold text-[#64748b] uppercase tracking-widest mb-2">{product.code}</div>
                      <Link href={`/product/${product.id}`} className="text-lg font-bold text-[#0a1b2d] mb-2 hover:text-[#164475] transition-colors line-clamp-2">
                        {product.name}
                      </Link>
                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <div className="text-xl font-black text-[#164475]">{formatPrice(product.price)}</div>
                        <button 
                          onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}
                          className="w-10 h-10 rounded-full bg-[#f1f5f9] text-[#164475] flex items-center justify-center hover:bg-[#164475] hover:text-white transition-colors"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-[#e2e8f0] p-16 text-center shadow-sm">
                <div className="w-20 h-20 bg-[#f1f5f9] rounded-full flex items-center justify-center mx-auto mb-6 text-[#64748b]">
                  <Filter className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-[#0a1b2d] mb-2">No products found</h3>
                <p className="text-[#64748b] mb-6">Try adjusting your search or filters to find what you're looking for.</p>
                <button 
                  onClick={() => {setSearchTerm(''); setPriceRange(5000);}}
                  className="bg-[#164475] text-white font-bold px-8 py-3 rounded-full hover:bg-[#0a1b2d] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
