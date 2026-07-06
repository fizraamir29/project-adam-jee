import { Product } from '../types';
import { ALL_PRODUCTS, NEW_ARRIVALS, BUNDLE_PRODUCTS } from '../data';

// NEW_ARRIVALS come first so they appear in the New Arrivals section (they have 'New'/'Hot' tags)
export const INITIAL_PRODUCTS = [
  ...NEW_ARRIVALS,
  ...ALL_PRODUCTS.filter(p => !NEW_ARRIVALS.find(n => n.id === p.id)),
  ...BUNDLE_PRODUCTS.filter(b => !ALL_PRODUCTS.find(p => p.id === b.id) && !NEW_ARRIVALS.find(p => p.id === b.id))
];

export const getProducts = (): Product[] => {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  const data = localStorage.getItem('adamjee_products');
  if (data) {
    const stored: Product[] = JSON.parse(data);
    // If stored data has no tagged products, it's stale — merge fresh NEW_ARRIVALS in
    const hasTagged = stored.some(p => p.tag === 'New' || p.tag === 'Hot');
    if (!hasTagged) {
      const adminAdded = stored.filter(p => !INITIAL_PRODUCTS.find(ip => ip.id === p.id));
      const fresh = [...INITIAL_PRODUCTS, ...adminAdded];
      localStorage.setItem('adamjee_products', JSON.stringify(fresh));
      return fresh;
    }
    return stored;
  }
  localStorage.setItem('adamjee_products', JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
};

export const saveProducts = (products: Product[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('adamjee_products', JSON.stringify(products));
};

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  city: string;
  items: { product: Product; qty: number }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  date: string;
}

export const getOrders = (): Order[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('adamjee_orders');
  return data ? JSON.parse(data) : [];
};

export const saveOrder = (order: Order) => {
  if (typeof window === 'undefined') return;
  const orders = getOrders();
  orders.unshift(order); // Add to beginning
  localStorage.setItem('adamjee_orders', JSON.stringify(orders));
};

export const updateOrderStatus = (orderId: string, status: Order['status']) => {
  if (typeof window === 'undefined') return;
  const orders = getOrders();
  const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
  localStorage.setItem('adamjee_orders', JSON.stringify(updated));
};

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export const getMessages = (): ContactMessage[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('adamjee_messages');
  return data ? JSON.parse(data) : [];
};

export const saveMessage = (msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) => {
  if (typeof window === 'undefined') return;
  const messages = getMessages();
  const newMessage: ContactMessage = {
    ...msg,
    id: `msg-${Date.now()}`,
    date: new Date().toISOString(),
    read: false,
  };
  messages.unshift(newMessage);
  localStorage.setItem('adamjee_messages', JSON.stringify(messages));
};

export const markMessageRead = (id: string) => {
  if (typeof window === 'undefined') return;
  const messages = getMessages();
  const updated = messages.map(m => m.id === id ? { ...m, read: true } : m);
  localStorage.setItem('adamjee_messages', JSON.stringify(updated));
};

export const deleteMessage = (id: string) => {
  if (typeof window === 'undefined') return;
  const messages = getMessages();
  const updated = messages.filter(m => m.id !== id);
  localStorage.setItem('adamjee_messages', JSON.stringify(updated));
};

export const getWishlist = (): string[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('adamjee_wishlist');
  return data ? JSON.parse(data) : [];
};

export const toggleWishlist = (productId: string): boolean => {
  if (typeof window === 'undefined') return false;
  const wishlist = getWishlist();
  const index = wishlist.indexOf(productId);
  let added = false;
  if (index > -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(productId);
    added = true;
  }
  localStorage.setItem('adamjee_wishlist', JSON.stringify(wishlist));
  return added;
};

export const isInWishlist = (productId: string): boolean => {
  if (typeof window === 'undefined') return false;
  return getWishlist().includes(productId);
};
