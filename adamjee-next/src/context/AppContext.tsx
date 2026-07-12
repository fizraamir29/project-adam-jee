'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';
import { CURRENCIES } from '@/data';

interface AppContextType {
  currencyCode: 'PKR' | 'USD';
  setCurrencyCode: (code: 'PKR' | 'USD') => void;
  formatPrice: (usdAmount: number) => string;
  cart: { product: Product; qty: number }[];
  setCart: React.Dispatch<React.SetStateAction<{ product: Product; qty: number }[]>>;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  handleAddToCart: (product: Product) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currencyCode, setCurrencyCode] = useState<'PKR' | 'USD'>('USD');
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Load cart from localStorage in client
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage:', e);
      }
    }
  }, []);

  // Sync products from API to localStorage for real-time storefront updates
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          localStorage.setItem('adamjee_products', JSON.stringify(data.products));
        }
      })
      .catch(err => console.error('Failed to sync products from API:', err));
  }, []);

  // Save cart to localStorage (always sync, including empty cart)
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const currency = CURRENCIES[currencyCode];
  const formatPrice = (usdAmount: number) => {
    return `${currency.symbol}${(usdAmount * currency.rate).toLocaleString()}`;
  };

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const pId = product.id || product._id;
      const existing = prev.find(item => (item.product.id || item.product._id) === pId);
      if (existing) {
        return prev.map(item => (item.product.id || item.product._id) === pId ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product, qty: 1 }];
    });
    setCartOpen(true);
  };

  return (
    <AppContext.Provider value={{
      currencyCode,
      setCurrencyCode,
      formatPrice,
      cart,
      setCart,
      cartOpen,
      setCartOpen,
      handleAddToCart
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
