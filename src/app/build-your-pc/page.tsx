'use client';

import BuildYourPC from '@/views/BuildYourPC';
import { useApp } from '@/context/AppContext';

export default function Page() {
  const { handleAddToCart, formatPrice } = useApp();
  return <BuildYourPC handleAddToCart={handleAddToCart} formatPrice={formatPrice} />;
}
