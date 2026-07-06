'use client';

import SearchPage from '@/views/SearchPage';
import { useApp } from '@/context/AppContext';

export default function Page() {
  const { handleAddToCart, formatPrice } = useApp();
  return <SearchPage handleAddToCart={handleAddToCart} formatPrice={formatPrice} />;
}
