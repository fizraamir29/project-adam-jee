import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { CheckCircle, Package, Truck, Home, ArrowRight, Mail, Phone, MapPin, Calendar, ShieldCheck, Clock } from 'lucide-react';
import { Product } from '../types';

interface OrderConfirmationPageProps {
  formatPrice?: (n: number) => string;
}

const steps = [
  { icon: CheckCircle, label: 'Order Placed', desc: 'We have received your order', done: true },
  { icon: Package,     label: 'Processing',   desc: 'Your build is being assembled', done: true },
  { icon: Truck,       label: 'Shipped',      desc: 'Courier will pick up soon', done: false },
  { icon: Home,        label: 'Delivered',    desc: 'Delivery within 3-5 days', done: false },
];

export default function OrderConfirmationPage({ formatPrice }: OrderConfirmationPageProps) {
  const pathname = usePathname();
  const [order, setOrder] = useState<any>(null);
  const fmt = formatPrice ?? ((n: number) => `$${n}`);

  // Fallback mock order if state is empty
  const fallbackOrder = {
    orderId: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
    paymentMethod: 'cod',
    shippingCost: 15,
    subtotal: 150,
    total: 165,
    shippingAddress: {
      fullName: 'Muhammad Ali',
      phone: '+92 300 1234567',
      street: 'DHA Phase 6, Street 4, House 12A',
      city: 'Karachi',
      postalCode: '75500',
      country: 'Pakistan'
    },
    items: [
      {
        product: 'hp1',
        name: 'ASUS ROG Red & Black Gaming Headset',
        image: '/images/headphones_red_black_1780246535746.png',
        price: 150,
        quantity: 1
      }
    ],
    createdAt: new Date().toISOString()
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedOrder = sessionStorage.getItem('lastOrder');
      if (savedOrder) {
        try {
          setOrder(JSON.parse(savedOrder));
        } catch (e) {
          setOrder(fallbackOrder);
        }
      } else {
        setOrder(fallbackOrder);
      }
    }
  }, []);

  if (!order) return null;

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'card': return 'Credit / Debit Card';
      case 'bank': return 'Direct Bank Transfer';
      case 'cod': return 'Cash on Delivery';
      default: return method;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] pt-32 pb-24 font-sans">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Success Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500/20 shadow-md">
            <CheckCircle className="w-10 h-10 text-green-600 animate-scale-in" />
          </div>
          <h1 className="text-4xl font-black text-[#0a1b2d] tracking-tight">Thank You For Your Order!</h1>
          <p className="text-gray-500 text-lg mt-2 font-medium">Your setup is being prepared. Order ID: <span className="text-[#164475] font-extrabold font-mono">{order.orderId}</span></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Info Columns */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Timeline Progress */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm animate-fade-in-up">
              <h2 className="text-xl font-black text-[#0a1b2d] mb-8 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#164475]" /> Order Progress
              </h2>
              <div className="relative pl-6 border-l-2 border-gray-100 space-y-8 ml-3">
                {steps.map((step, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle Indicator */}
                    <div className={`absolute -left-[37px] top-0.5 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
                      step.done 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'bg-white border-gray-200 text-gray-400'
                    }`}>
                      <step.icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${step.done ? 'text-[#0a1b2d]' : 'text-gray-400'}`}>{step.label}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Details */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm animate-fade-in-up delay-100">
              <h2 className="text-xl font-black text-[#0a1b2d] mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#164475]" /> Shipping & Delivery Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Shipping Address */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Delivery Address</h3>
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3">
                    <p className="font-extrabold text-[#0a1b2d] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#164475]"></span>
                      {order.shippingAddress?.fullName}
                    </p>
                    <div className="text-sm text-gray-600 space-y-1 pl-4">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        {order.shippingAddress?.street}
                      </p>
                      <p className="pl-5.5">{order.shippingAddress?.city}, {order.shippingAddress?.postalCode || 'Pakistan'}</p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        {order.shippingAddress?.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery details and speed */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Delivery Duration</h3>
                  <div className="bg-green-50/50 rounded-2xl p-5 border border-green-500/10 space-y-3">
                    <p className="font-extrabold text-green-850 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-700" />
                      3–5 Business Days
                    </p>
                    <p className="text-xs text-green-700/80 leading-relaxed pl-6">
                      Once your order is confirmed, your package will be delivered to your address within **3 to 5 business days**. 
                      Your build will be securely shipped using premium protective packaging and maximum safety precautions.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Contact Queries Section */}
            <div className="bg-gradient-to-br from-[#0a1b2d] to-[#03152a] text-white p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden animate-fade-in-up delay-200">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#164475]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-md">
                  <h2 className="text-xl font-black tracking-tight">Need Help or Have a Query?</h2>
                  <p className="text-sm text-gray-300 leading-relaxed font-medium">
                    If you have any questions about your order or want to request custom adjustments to your build, feel free to drop us an email or message on WhatsApp.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <a href="mailto:support@adamjeecomputers.com" className="flex items-center justify-center gap-2 bg-[#164475] hover:bg-[#164475]/80 text-[#03152a] font-bold px-5 py-3.5 rounded-xl text-sm transition-all shadow-md">
                    <Mail className="w-4 h-4" />
                    Email Support
                  </a>
                  <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3.5 rounded-xl text-sm border border-white/10 transition-all">
                    <Phone className="w-4 h-4" />
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right column: Order Summary */}
          <div className="space-y-6 animate-fade-in-up delay-100">
            <div className="bg-[#03152a] rounded-3xl p-6 md:p-8 text-white border border-white/5 shadow-2xl">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#164475]" /> Summary
              </h3>

              {/* Items List */}
              <div className="space-y-4 mb-6 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-white/10 rounded-xl p-1.5 flex-shrink-0 relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#164475] text-[#03152a] rounded-full flex items-center justify-center text-[9px] font-black">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold leading-snug text-white/90 truncate">{item.name}</h4>
                      <p className="text-[10px] text-[#164475] font-extrabold mt-0.5">{fmt(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Costing */}
              <div className="border-t border-white/10 pt-4 space-y-3 mb-4 text-xs font-semibold text-white/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">{fmt(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Cost</span>
                  <span className="text-white">{fmt(order.shippingCost || 15)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-{fmt(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-white/5 pt-3 mt-2">
                  <span>Payment Method</span>
                  <span className="text-white capitalize font-mono text-[10px]">{getPaymentMethodLabel(order.paymentMethod)}</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-sm">Total Paid</span>
                  <span className="text-2xl font-black text-[#164475]">{fmt(order.total)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/" className="w-full flex items-center justify-center gap-2 bg-[#164475] hover:bg-[#164475]/90 text-[#03152a] py-3.5 rounded-xl font-black text-xs tracking-wider transition-all shadow-md">
                  <Home className="w-4 h-4" /> Continue Shopping
                </Link>
                <Link href="/account" className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-3.5 rounded-xl font-bold text-xs tracking-wider transition-colors border border-white/10">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
