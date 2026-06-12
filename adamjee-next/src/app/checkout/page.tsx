'use client';

import CheckoutPage from '@/views/CheckoutPage';
import { useApp } from '@/context/AppContext';

export default function Page() {
  const { cart, setCart, formatPrice } = useApp();
  return <CheckoutPage cart={cart} setCart={setCart} formatPrice={formatPrice} />;
}
