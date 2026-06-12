'use client';

import AccountPage from '@/views/AccountPage';
import { useApp } from '@/context/AppContext';

export default function Page() {
  const { handleAddToCart, formatPrice } = useApp();
  return <AccountPage handleAddToCart={handleAddToCart} formatPrice={formatPrice} />;
}
