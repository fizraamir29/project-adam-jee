'use client';

import CartPage from '@/views/CartPage';
import { useApp } from '@/context/AppContext';

export default function Page() {
  const { cart, setCart, formatPrice } = useApp();
  return <CartPage cart={cart} setCart={setCart} formatPrice={formatPrice} />;
}
