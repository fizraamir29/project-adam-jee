'use client';

import ProductListingPage from '@/views/ProductListingPage';
import { useApp } from '@/context/AppContext';

export default function Page() {
  const { handleAddToCart, formatPrice } = useApp();
  return <ProductListingPage handleAddToCart={handleAddToCart} formatPrice={formatPrice} />;
}
