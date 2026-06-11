import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Product } from "../types";
import { getProducts } from "../utils/storage";
import { Filter, X, Star, ChevronDown, ChevronRight, ArrowRight } from "lucide-react";

interface CategoryPageProps {
  handleAddToCart: (product: Product) => void;
  formatPrice: (usdAmount: number) => string;
}

const TABS = [
  { label: "All", count: getProducts().length },
  { label: "Headphones", count: getProducts().filter(p => p.category === "Headphones").length },
  { label: "Earphones", count: getProducts().filter(p => p.category === "Earphones").length },
  { label: "Speakers", count: getProducts().filter(p => p.category === "Speakers").length },
  { label: "Accessories", count: getProducts().filter(p => p.category === "Accessories").length },
];

export default function CategoryPage({ handleAddToCart, formatPrice }: CategoryPageProps) {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Products data filtered and sorted dynamically
  const soldOutIds = ["hp3", "ac6"];

  const filteredProducts = getProducts().filter(product => {
    if (activeTab === "All") return true;
    return product.category === activeTab;
  });

  const products = [...filteredProducts].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    return 0; // Featured
  });

  const categoryName = activeTab === "All"
    ? (id === "all" ? "All Products" : id === "best-sellers" ? "Best Sellers" : id === "accessories" ? "Gaming Accessories" : "PC Components")
    : activeTab;

  // Sticky bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setStickyVisible(heroBottom <= 80);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll reveal for grid cards
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
          }
        });
      },
      { threshold: 0.1 }
    );
    const cards = document.querySelectorAll(".shop-card-reveal");
    cards.forEach((card) => observer.observe(card));
    return () => cards.forEach((card) => observer.unobserve(card));
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#fafbfc] relative">

      {/* ═══════════════════════════════════════════
          1. HERO BANNER
      ═══════════════════════════════════════════ */}
      <div
        ref={heroRef}
        className="relative bg-[#0a1b2d] text-white overflow-hidden"
        style={{ minHeight: "320px" }}
      >
        {/* Dark image background */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: 'url("/images/blue_rgb_pc_cases_1780241349905.png")',
            opacity: 0.25,
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1b2d]/60 via-[#0a1b2d]/80 to-[#0a1b2d] z-[1]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-12 pt-32 pb-16 flex flex-col justify-end">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/50 font-medium mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/50">Collections</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-bold">{categoryName}</span>
          </nav>

          {/* Heading with left fade-in animation */}
          <h1
            className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05]"
            style={{
              animation: "heroHeadingIn 600ms ease-out forwards",
              opacity: 0,
              transform: "translateX(-20px)",
            }}
          >
            {categoryName}
          </h1>
          <p
            className="text-white/60 text-sm md:text-base mt-4 max-w-xl font-medium"
            style={{
              animation: "heroHeadingIn 600ms ease-out 150ms forwards",
              opacity: 0,
              transform: "translateX(-20px)",
            }}
          >
            Discover our premium selection of gaming gear, engineered for peak performance and aesthetics.
          </p>
        </div>
      </div>

      {/* Inline keyframe for hero */}
      <style>{`
        @keyframes heroHeadingIn {
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* ═══════════════════════════════════════════
          2. STICKY FILTER BAR
      ═══════════════════════════════════════════ */}
      <div
        className={`sticky top-[72px] z-30 bg-white/95 backdrop-blur-xl border-b border-gray-200/80 transition-all duration-400 ${
          stickyVisible
            ? "translate-y-0 opacity-100 shadow-lg"
            : "translate-y-0 opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-12 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Show Filters */}
          <button
            onClick={() => setFiltersOpen(true)}
            className="inline-flex items-center gap-2 bg-[#0a1b2d] text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#164475] transition-colors"
          >
            <Filter className="w-3.5 h-3.5" />
            Show filters
          </button>

          {/* Middle: Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-all whitespace-nowrap ${
                  activeTab === tab.label
                    ? "text-[#0a1b2d]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
                <sup className="ml-0.5 text-[10px] font-bold text-gray-400">{tab.count}</sup>
                {/* Active underline */}
                {activeTab === tab.label && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#0a1b2d] rounded-full"
                    style={{
                      width: "60%",
                      animation: "tabUnderline 300ms ease-out forwards",
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right: Sort */}
          <div className="flex items-center gap-4">
            <div className="relative inline-flex items-center bg-gray-100 text-xs font-bold text-gray-700 px-4 py-2.5 rounded-full cursor-pointer hover:bg-gray-200 transition-colors pr-8">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none outline-none appearance-none cursor-pointer font-bold text-gray-700 w-full"
              >
                <option value="Featured">Featured</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes tabUnderline {
          from { width: 0%; }
          to { width: 60%; }
        }
      `}</style>

      {/* ═══════════════════════════════════════════
          3. PRODUCTS GRID
      ═══════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-12">
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {products.map((product, idx) => {
            const isSoldOut = soldOutIds.includes(product.id);

            return (
              <div
                key={product.id}
                className="shop-card-reveal opacity-0 translate-y-[30px]"
                style={{
                  transition: `opacity 500ms cubic-bezier(0.22,1,0.36,1), transform 500ms cubic-bezier(0.22,1,0.36,1)`,
                  transitionDelay: `${idx * 80}ms`,
                }}
              >
                <div className="bg-white rounded-[20px] border border-gray-100 overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 cursor-pointer relative">
                  {/* Image Area */}
                  <Link
                    to={`/product/${product.id}`}
                    className="relative block bg-[#f8f9fa] p-6 aspect-square flex items-center justify-center overflow-hidden"
                  >
                    {/* Tag badge */}
                    {product.tag && !isSoldOut && (
                      <span className="absolute top-4 left-4 bg-[#0a1b2d] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider z-10">
                        {product.tag}
                      </span>
                    )}

                    {/* Rating pill */}
                    <span className="absolute top-4 right-4 bg-white px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#0a1b2d] flex items-center gap-1 shadow-sm z-10">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {product.rating.toFixed(1)}
                    </span>

                    {/* Product Image */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-4/5 h-4/5 object-contain transition-transform duration-400 ease-out group-hover:scale-[1.08]"
                      style={{ mixBlendMode: "multiply" }}
                    />

                    {/* 5. Sold Out Overlay */}
                    {isSoldOut && (
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="bg-white/70 backdrop-blur-md px-6 py-3 rounded-full border border-white/50 shadow-lg">
                          <span className="text-sm font-black text-[#0a1b2d] uppercase tracking-widest">Sold Out</span>
                        </div>
                      </div>
                    )}
                  </Link>

                  {/* Info Area */}
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase block">{product.code}</span>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-[15px] font-bold text-[#0a1b2d] leading-tight group-hover:text-[#164475] transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[15px] font-black text-[#0a1b2d]">{formatPrice(product.price)}</span>
                      {!isSoldOut && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                          className="w-9 h-9 rounded-full bg-[#0a1b2d] hover:bg-[#164475] text-white flex items-center justify-center transition-colors shadow-md hover:shadow-lg active:scale-95"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Color swatches */}
                    {product.additionalImages && product.additionalImages.length > 0 && (
                      <div className="flex gap-1.5 pt-2">
                        {product.additionalImages.slice(0, 3).map((img, i) => (
                          <div
                            key={i}
                            className={`w-7 h-7 rounded-md border overflow-hidden flex items-center justify-center bg-white ${
                              i === 0 ? "border-[#0a1b2d]" : "border-gray-200"
                            }`}
                          >
                            <img src={img} alt="variant" className="w-5 h-5 object-contain" style={{ mixBlendMode: "multiply" }} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* ═══════════════════════════════════════════
              4. PROMO CARD (inside grid)
          ═══════════════════════════════════════════ */}
          <div
            className="shop-card-reveal opacity-0 translate-y-[30px] col-span-2 md:col-span-2"
            style={{
              transition: `opacity 500ms cubic-bezier(0.22,1,0.36,1), transform 500ms cubic-bezier(0.22,1,0.36,1)`,
              transitionDelay: `${products.length * 80}ms`,
            }}
          >
            <div className="relative rounded-[20px] overflow-hidden bg-[#0a1b2d] min-h-[360px] flex flex-col justify-end p-8 group">
              <div
                className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: 'url("/images/promo_gamers_bg.png")', opacity: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1b2d] via-[#0a1b2d]/50 to-transparent z-[1]" />
              <div className="relative z-10 space-y-4">
                <span className="text-[10px] font-black tracking-widest uppercase text-[#164475]">Limited Collection</span>
                <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                  Premium Gaming<br />Accessories
                </h3>
                <p className="text-white/60 text-sm max-w-sm font-medium">
                  Elevate your setup with hand-picked accessories designed for peak performance.
                </p>
                <Link
                  to="/category/accessories"
                  className="inline-flex items-center gap-2 border border-white/40 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-white hover:text-[#0a1b2d] transition-all"
                >
                  View Accessories <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-16">
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#0a1b2d] hover:text-[#0a1b2d] transition-colors font-bold icon-hover-scale">
            &larr;
          </button>
          <button className="w-10 h-10 rounded-full bg-[#0a1b2d] text-white flex items-center justify-center font-bold shadow-lg">
            1
          </button>
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#0a1b2d] hover:text-[#0a1b2d] transition-colors font-bold icon-hover-scale">
            2
          </button>
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#0a1b2d] hover:text-[#0a1b2d] transition-colors font-bold icon-hover-scale">
            3
          </button>
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#0a1b2d] hover:text-[#0a1b2d] transition-colors font-bold icon-hover-scale">
            &rarr;
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          6. FILTER SIDEBAR (slide-in from left)
      ═══════════════════════════════════════════ */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex animate-fade-in">
          {/* Dark Backdrop */}
          <div
            className="absolute inset-0 bg-[#0a1b2d]/60 backdrop-blur-md"
            onClick={() => setFiltersOpen(false)}
          />

          {/* Sidebar Panel */}
          <div
            className="relative w-full max-w-sm bg-white h-full shadow-2xl z-10 overflow-y-auto"
            style={{
              animation: "filterSlideIn 350ms ease-out forwards",
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-black text-[#0a1b2d] flex items-center gap-2">
                <Filter className="w-5 h-5" /> Filters
              </h3>
              <button
                onClick={() => setFiltersOpen(false)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-[#0a1b2d] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Groups */}
            <div className="p-6 space-y-8">
              {/* Categories */}
              <div className="space-y-4">
                <h4 className="font-black text-[#0a1b2d] uppercase text-xs tracking-widest border-b pb-3">Categories</h4>
                <div className="space-y-3">
                  {["All Products", "Desktops", "Laptops", "Components", "Monitors", "Accessories"].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 rounded-md border-2 border-gray-300 group-hover:border-[#164475] transition-colors flex items-center justify-center">
                        {cat === "All Products" && (
                          <div className="w-3 h-3 bg-[#164475] rounded-sm" />
                        )}
                      </div>
                      <span className="text-sm text-gray-600 group-hover:text-[#0a1b2d] font-medium transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <h4 className="font-black text-[#0a1b2d] uppercase text-xs tracking-widest border-b pb-3">Price Range</h4>
                <div className="space-y-3">
                  {["Under $50", "$50 — $200", "$200 — $500", "$500 — $1,000", "Over $1,000"].map((price) => (
                    <label key={price} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 rounded-md border-2 border-gray-300 group-hover:border-[#164475] transition-colors" />
                      <span className="text-sm text-gray-600 group-hover:text-[#0a1b2d] font-medium transition-colors">{price}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="space-y-4">
                <h4 className="font-black text-[#0a1b2d] uppercase text-xs tracking-widest border-b pb-3">Brands</h4>
                <div className="space-y-3">
                  {["ASUS ROG", "Corsair", "Razer", "MSI", "Logitech", "Dell", "HyperX"].map((brand) => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 rounded-md border-2 border-gray-300 group-hover:border-[#164475] transition-colors" />
                      <span className="text-sm text-gray-600 group-hover:text-[#0a1b2d] font-medium transition-colors">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-4">
                <h4 className="font-black text-[#0a1b2d] uppercase text-xs tracking-widest border-b pb-3">Availability</h4>
                <div className="space-y-3">
                  {["In Stock", "Out of Stock"].map((status) => (
                    <label key={status} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 rounded-md border-2 border-gray-300 group-hover:border-[#164475] transition-colors" />
                      <span className="text-sm text-gray-600 group-hover:text-[#0a1b2d] font-medium transition-colors">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="p-6 border-t border-gray-100 bg-white sticky bottom-0">
              <button
                onClick={() => setFiltersOpen(false)}
                className="w-full bg-[#0a1b2d] hover:bg-[#164475] text-white py-4 rounded-2xl font-bold transition-colors shadow-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes filterSlideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .shop-card-reveal.is-revealed {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
}
