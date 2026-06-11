import React, { useState } from "react";
import { BUNDLE_PRODUCTS, CURRENCIES } from "./data";
import { Product } from "./types";
import TopPromoBanner from "./components/TopPromoBanner";
import Header from "./components/Header";
import CartOverlay from "./components/CartOverlay";
import UnifiedFooter from "./components/UnifiedFooter";
import AIChatbot from "./components/AIChatbot";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductListingPage from "./pages/ProductListingPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import AccountPage from "./pages/AccountPage";
import SearchPage from "./pages/SearchPage";
import NotFoundPage from "./pages/NotFoundPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import BlogListingPage from "./pages/BlogListingPage";
import BlogPostPage from "./pages/BlogPostPage";
import FAQPage from "./pages/FAQPage";
import PolicyPage from "./pages/PolicyPage";
import SitemapPage from "./pages/SitemapPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import BenchmarksPage from "./pages/BenchmarksPage";
import BuildYourPC from "./pages/BuildYourPC";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useScrollReveal } from "./hooks/useScrollReveal";

function ScrollRevealHandler() {
  useScrollReveal();
  return null;
}

function AppContent() {
  // Navigation & Settings
  const [currencyCode, setCurrencyCode] = useState<"PKR" | "USD">("USD");

  // Cart
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Pricing helper
  const currency = CURRENCIES[currencyCode];
  const formatPrice = (usdAmount: number) => {
    return `${currency.symbol}${(usdAmount * currency.rate).toLocaleString()}`;
  };

  // Add Product to Cart
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product, qty: 1 }];
    });
    setCartOpen(true);
  };

  return (
    <>
      <ScrollRevealHandler />
      <div className="min-h-screen bg-[#fafbfc] text-[#0a1b2d] font-sans antialiased overflow-x-hidden">
        
        {/* 1. TOP BAR */}
        {!isAdminRoute && <TopPromoBanner />}

        {/* 2. MAIN HEADER */}
        {!isAdminRoute && (
          <Header 
            cartCount={cart.reduce((acu, i) => acu + i.qty, 0)} 
            onCartToggle={() => setCartOpen(prev => !prev)} 
            onBuildPcOpen={() => {}} 
          />
        )}

        {/* SHOPPING CART OVERLAY */}
        <CartOverlay 
          isOpen={cartOpen} 
          onClose={() => setCartOpen(false)} 
          cart={cart} 
          setCart={setCart} 
          formatPrice={formatPrice} 
        />

        {/* PAGE CONTENT */}
        <Routes>
          <Route path="/" element={<HomePage handleAddToCart={handleAddToCart} formatPrice={formatPrice} />} />
          <Route path="/category/:id" element={<CategoryPage handleAddToCart={handleAddToCart} formatPrice={formatPrice} />} />
          <Route path="/product/:id" element={<ProductListingPage handleAddToCart={handleAddToCart} formatPrice={formatPrice} />} />
          <Route path="/build-your-pc" element={<BuildYourPC handleAddToCart={handleAddToCart} formatPrice={formatPrice} />} />
          <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} formatPrice={formatPrice} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} setCart={setCart} formatPrice={formatPrice} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/account" element={<AccountPage handleAddToCart={handleAddToCart} formatPrice={formatPrice} />} />
          <Route path="/search" element={<SearchPage handleAddToCart={handleAddToCart} formatPrice={formatPrice} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogListingPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/warranty-returns" element={<PolicyPage title="Warranty & Returns" />} />
          <Route path="/privacy-policy" element={<PolicyPage title="Privacy Policy" />} />
          <Route path="/terms" element={<PolicyPage title="Terms & Conditions" />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/benchmarks" element={<BenchmarksPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* 14. NEWSLETTER & UNIFIED HIGH-FIDELITY DEEP-BLUE FOOTER */}
        {!isAdminRoute && <UnifiedFooter setIsBuilderOpen={() => {}} />}

        {/* CHATBOT FLOATING WIDGET */}
        <AIChatbot />

      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
