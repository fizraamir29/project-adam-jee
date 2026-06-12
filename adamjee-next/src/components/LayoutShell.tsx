'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import TopPromoBanner from '@/components/TopPromoBanner';
import Header from '@/components/Header';
import CartOverlay from '@/components/CartOverlay';
import UnifiedFooter from '@/components/UnifiedFooter';
import AIChatbot from '@/components/AIChatbot';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { cart, cartOpen, setCartOpen, setCart, formatPrice } = useApp();
  const isAdminRoute = pathname?.startsWith('/admin');
  
  useScrollReveal();

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#0a1b2d] font-sans antialiased overflow-x-hidden">
      {!isAdminRoute && <TopPromoBanner />}

      {!isAdminRoute && (
        <Header 
          cartCount={cart.reduce((acu, i) => acu + i.qty, 0)} 
          onCartToggle={() => setCartOpen(!cartOpen)} 
          onBuildPcOpen={() => {}} 
        />
      )}

      <CartOverlay 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        cart={cart} 
        setCart={setCart} 
        formatPrice={formatPrice} 
      />

      {children}

      {!isAdminRoute && <UnifiedFooter setIsBuilderOpen={() => {}} />}

      <AIChatbot />
    </div>
  );
}
