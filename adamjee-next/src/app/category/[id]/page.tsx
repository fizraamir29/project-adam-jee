'use client';

import CategoryPage from '@/views/CategoryPage';
import { useApp } from '@/context/AppContext';

export default function Page() {
  const { handleAddToCart, formatPrice } = useApp();
  return <CategoryPage handleAddToCart={handleAddToCart} formatPrice={formatPrice} />;
}
