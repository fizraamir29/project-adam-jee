'use client';

import HomePage from '@/views/HomePage';
import { useApp } from '@/context/AppContext';

export default function Page() {
  const { handleAddToCart, formatPrice } = useApp();
  return <HomePage handleAddToCart={handleAddToCart} formatPrice={formatPrice} />;
}
