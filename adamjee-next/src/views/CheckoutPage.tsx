'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from "react";

import { Product } from "../types";
import { saveOrder } from "../utils/storage";
import { CreditCard, Truck, ShieldCheck, ChevronLeft, Building2, User, Phone, Mail, MapPin, Loader2, ExternalLink, Lock } from "lucide-react";

interface CheckoutPageProps {
  cart: { product: Product; qty: number }[];
  setCart: React.Dispatch<React.SetStateAction<{ product: Product; qty: number }[]>>;
  formatPrice: (usdAmount: number) => string;
}

export default function CheckoutPage({ cart, setCart, formatPrice }: CheckoutPageProps) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank" | "cod">("card");
  
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
  const shipping = cart.length > 0 ? 15 : 0;
  const total = subtotal + shipping;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.target as HTMLFormElement);
    
    const items = cart.map(item => ({
      product: item.product.id || item.product._id,
      name: item.product.name,
      image: item.product.image,
      price: item.product.price,
      quantity: item.qty
    }));

    const orderPayload = {
      items,
      shippingAddress: {
        fullName: formData.get("fullName") as string,
        phone: formData.get("phone") as string,
        street: formData.get("address") as string,
        city: formData.get("city") as string,
        postalCode: formData.get("postalCode") as string || '',
        country: 'Pakistan'
      },
      guestEmail: formData.get("email") as string,
      paymentMethod,
      subtotal,
      shippingCost: shipping,
      total,
    };

    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // ─── Card Payment: Safepay Flow ───────────────────────────────────────
      if (paymentMethod === 'card') {
        // First create the order as 'pending' in our DB
        const orderRes = await fetch('/api/orders', {
          method: 'POST',
          headers,
          body: JSON.stringify({ ...orderPayload, paymentStatus: 'pending' })
        });
        const orderData = await orderRes.json();

        if (!orderRes.ok) {
          setError(orderData.message || 'Failed to create order.');
          setIsSubmitting(false);
          return;
        }

        const createdOrder = orderData.order;
        sessionStorage.setItem('lastOrder', JSON.stringify(createdOrder));

        // Then initiate Safepay payment session
        const safepayRes = await fetch('/api/payment/create-session', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            orderId: createdOrder.orderId,
            amount: total * 278, // Convert USD to PKR (1 USD = 278 PKR)
            currency: 'PKR',
            customerEmail: formData.get('email') as string,
            customerName: formData.get('fullName') as string,
          }),
        });

        const safepayData = await safepayRes.json();

        if (safepayData.mode === 'demo' || !safepayData.checkoutUrl) {
          // Safepay not configured yet — show demo notice and still redirect to confirmation
          setError('');
          setCart([]);
          router.push('/order-confirmation');
          return;
        }

        if (!safepayRes.ok || !safepayData.checkoutUrl) {
          setError(safepayData.message || 'Payment gateway error. Please try again.');
          setIsSubmitting(false);
          return;
        }

        // Redirect to Safepay hosted checkout
        setCart([]);
        window.location.href = safepayData.checkoutUrl;
        return;
      }

      // ─── Bank Transfer / COD Flow ─────────────────────────────────────────
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (res.ok) {
        setCart([]);
        sessionStorage.setItem('lastOrder', JSON.stringify(data.order));
        router.push("/order-confirmation");
      } else {
        setError(data.message || 'Failed to place order.');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#164475] font-medium transition-colors">
            <ChevronLeft className="w-4 h-4" /> Return to Cart
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Checkout Form Area */}
          <div className="flex-1 space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-5 mb-8 font-semibold animate-fade-in">
                {error}
              </div>
            )}
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
              
              {/* Contact Information */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-[#0a1b2d] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#164475] text-white flex items-center justify-center text-sm font-black">1</span>
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input name="email" required type="email" placeholder="john@example.com" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#164475] focus:border-transparent outline-none transition-all font-medium text-[#0a1b2d]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input name="phone" required type="tel" placeholder="+92 300 0000000" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#164475] focus:border-transparent outline-none transition-all font-medium text-[#0a1b2d]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-[#0a1b2d] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#164475] text-white flex items-center justify-center text-sm font-black">2</span>
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input name="fullName" required type="text" placeholder="John Doe" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#164475] focus:border-transparent outline-none transition-all font-medium text-[#0a1b2d]" />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Street Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input name="address" required type="text" placeholder="House/Apartment, Street Name" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#164475] focus:border-transparent outline-none transition-all font-medium text-[#0a1b2d]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">City</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input name="city" required type="text" placeholder="Karachi" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#164475] focus:border-transparent outline-none transition-all font-medium text-[#0a1b2d]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Postal Code</label>
                    <input required type="text" placeholder="75000" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#164475] focus:border-transparent outline-none transition-all font-medium text-[#0a1b2d]" />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-[#0a1b2d] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#164475] text-white flex items-center justify-center text-sm font-black">3</span>
                  Payment Method
                </h2>
                <div className="space-y-4">
                  
                  {/* Credit Card Option — Powered by Safepay */}
                  <label className={`flex flex-col border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "card" ? "border-[#164475] bg-[#164475]/5" : "border-gray-100 hover:border-[#164475]/30"}`}>
                    <div className="flex items-center gap-4 p-5">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === "card" ? "border-[#164475]" : "border-gray-300"}`}>
                        {paymentMethod === "card" && <div className="w-2.5 h-2.5 bg-[#164475] rounded-full" />}
                      </div>
                      <input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="hidden" />
                      <div className="flex-1">
                        <div className="font-bold text-[#0a1b2d]">Credit / Debit Card</div>
                        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Secured by Safepay
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-8 h-5 bg-blue-600 rounded text-[8px] flex items-center justify-center font-bold text-white">VISA</div>
                        <div className="w-8 h-5 bg-red-600 rounded text-[8px] flex items-center justify-center font-bold text-white">MC</div>
                        <div className="w-8 h-5 bg-green-600 rounded text-[8px] flex items-center justify-center font-bold text-white">PKR</div>
                      </div>
                    </div>
                    {paymentMethod === "card" && (
                      <div className="px-5 pb-5 border-t border-[#164475]/10 pt-4">
                        <div className="bg-gradient-to-r from-[#164475]/5 to-blue-50 rounded-xl p-4 flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#164475] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Lock className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#0a1b2d] mb-0.5">Secure Payment via Safepay</p>
                            <p className="text-xs text-gray-500 leading-relaxed">
                              You will be redirected to Safepay’s secure checkout to complete payment.
                              Your card details are handled by Safepay (licensed by State Bank of Pakistan) — we never see them.
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">SBP Licensed</span>
                              <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">PCI-DSS</span>
                              <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">256-bit SSL</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </label>

                  {/* Bank Transfer Option */}
                  <label className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "bank" ? "border-[#164475] bg-[#164475]/5" : "border-gray-100 hover:border-[#164475]/30"}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === "bank" ? "border-[#164475]" : "border-gray-300"}`}>
                      {paymentMethod === "bank" && <div className="w-2.5 h-2.5 bg-[#164475] rounded-full" />}
                    </div>
                    <input type="radio" name="payment" value="bank" checked={paymentMethod === "bank"} onChange={() => setPaymentMethod("bank")} className="hidden" />
                    <div className="flex-1 font-bold text-[#0a1b2d]">Direct Bank Transfer</div>
                  </label>

                  {/* Cash on Delivery Option */}
                  <label className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "cod" ? "border-[#164475] bg-[#164475]/5" : "border-gray-100 hover:border-[#164475]/30"}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === "cod" ? "border-[#164475]" : "border-gray-300"}`}>
                      {paymentMethod === "cod" && <div className="w-2.5 h-2.5 bg-[#164475] rounded-full" />}
                    </div>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="hidden" />
                    <div className="flex-1 font-bold text-[#0a1b2d]">Cash on Delivery (COD)</div>
                  </label>

                </div>
              </div>

            </form>
          </div>

          {/* Order Summary Area */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="bg-[#03152a] rounded-3xl p-8 text-white sticky top-24 shadow-2xl">
              <h3 className="text-xl font-bold mb-6">Your Order</h3>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-white/10 rounded-lg p-1.5 flex-shrink-0 relative">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#164475] text-[#03152a] rounded-full flex items-center justify-center text-[10px] font-black">
                        {item.qty}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold leading-tight mb-1 text-white/90 line-clamp-2">{item.product.name}</h4>
                      <p className="text-xs text-[#164475] font-bold">{formatPrice(item.product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/20 pt-6 space-y-4 mb-6 text-sm font-medium text-white/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-white">{formatPrice(shipping)}</span>
                </div>
              </div>

              <div className="border-t border-white/20 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg">Total</span>
                  <span className="text-3xl font-black text-[#164475]">{formatPrice(total)}</span>
                </div>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                disabled={isSubmitting || cart.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-[#164475] hover:bg-[#1a5491] text-white py-4 rounded-xl font-black text-sm tracking-wide transition-all shadow-lg hover:shadow-xl transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {paymentMethod === 'card' ? 'Redirecting to Safepay…' : 'Placing Order…'}
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    {paymentMethod === 'card' ? 'Pay Securely via Safepay' : 'Place Order Now'}
                    {paymentMethod === 'card' && <ExternalLink className="w-4 h-4 ml-1 opacity-70" />}
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-white/60 text-xs font-medium">
                <ShieldCheck className="w-4 h-4" /> 256-bit secure checkout
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
