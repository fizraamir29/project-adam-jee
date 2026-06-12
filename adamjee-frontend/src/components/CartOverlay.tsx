import React from "react";
import { ShoppingCart, X, Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "../types";

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  cart: { product: Product; qty: number }[];
  setCart: React.Dispatch<React.SetStateAction<{ product: Product; qty: number }[]>>;
  formatPrice: (usdAmount: number) => string;
}

export default function CartOverlay({ isOpen, onClose, cart, setCart, formatPrice }: CartOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#0a1b2d]/60 backdrop-blur-md animate-fade-in">
      {/* Sliding Panel */}
      <div className="w-full max-w-md bg-white h-screen shadow-2xl flex flex-col animate-slide-in-right relative overflow-hidden rounded-l-[40px]">
        {/* Header */}
        <div className="flex justify-between items-center p-8 pb-6 border-b border-[#f1f5f9] bg-white/80 backdrop-blur-xl z-10">
          <h3 className="text-2xl font-extrabold text-[#0a1b2d] flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f0f7ff] rounded-full flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-[#164475]" />
            </div>
            Your Cart <span className="text-[#94a3b8] text-lg font-semibold">({cart.reduce((a, b) => a + b.qty, 0)})</span>
          </h3>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f8fafc] text-[#64748b] hover:bg-[#e2e8f0] hover:text-[#0a1b2d] hover:-rotate-90 transition-all border-none outline-none">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 chat-scroll bg-[#fafbfc]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-scale-in">
              <div className="w-32 h-32 bg-white rounded-full shadow-xl shadow-[#164475]/5 flex items-center justify-center mb-6 border border-[#f1f5f9] animate-float relative">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#cbd5e1] animate-[spin_10s_linear_infinite]" />
                <ShoppingCart className="w-12 h-12 text-[#cbd5e1]" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#0a1b2d] mb-2">Cart is empty</h3>
              <p className="text-[#64748b] max-w-[250px] mb-8 font-medium leading-relaxed">Looks like you haven't added any premium gear to your cart yet.</p>
              <Link 
                to="/category/all" 
                onClick={onClose}
                className="bg-gradient-to-r from-[#164475] to-[#0a1b2d] text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-[#164475]/20 hover:shadow-[#164475]/40 hover:-translate-y-1 transition-all flex items-center gap-2 group"
              >
                Start Shopping <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : (
            cart.map((item, i) => (
              <div key={item.product.id} className="group flex gap-4 bg-white p-4 rounded-3xl border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="w-24 h-24 rounded-2xl bg-[#f8fafc] border border-[#f1f5f9] p-2 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                <div className="flex-1 py-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h4 className="text-sm font-bold text-[#0a1b2d] line-clamp-2 leading-snug">{item.product.name}</h4>
                      <button 
                        onClick={() => setCart(prev => prev.filter(i => i.product.id !== item.product.id))}
                        className="text-[#cbd5e1] hover:text-[#0a1b2d] transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs font-bold text-[#64748b] uppercase tracking-widest">{item.product.code}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-lg font-black text-[#164475]">{formatPrice(item.product.price)}</p>
                    
                    <div className="flex items-center bg-[#f8fafc] rounded-full border border-[#e2e8f0]">
                      <button 
                        onClick={() => setCart(p => p.map(i => i.product.id === item.product.id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i))}
                        className="w-8 h-8 flex items-center justify-center text-[#64748b] hover:text-[#164475] font-bold text-lg hover:bg-white rounded-full transition-colors"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-[#0a1b2d]">{item.qty}</span>
                      <button 
                        onClick={() => setCart(p => p.map(i => i.product.id === item.product.id ? { ...i, qty: i.qty + 1 } : i))}
                        className="w-8 h-8 flex items-center justify-center text-[#64748b] hover:text-[#164475] font-bold text-lg hover:bg-white rounded-full transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Area */}
        {cart.length > 0 && (
          <div className="bg-white p-8 border-t border-[#f1f5f9] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-10">
            <div className="flex justify-between items-end mb-6">
              <span className="text-[#64748b] font-bold text-sm uppercase tracking-widest">Grand Total</span>
              <span className="text-3xl font-black text-[#0a1b2d] tracking-tight">
                {formatPrice(cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0))}
              </span>
            </div>
            
            <div className="space-y-3">
              <Link 
                to="/checkout"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 bg-[#164475] hover:bg-[#0a1b2d] text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-[#164475]/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#164475]/30"
              >
                Secure Checkout <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/cart"
                onClick={onClose}
                className="w-full flex items-center justify-center bg-[#f8fafc] hover:bg-[#e2e8f0] text-[#0a1b2d] py-4 rounded-2xl font-bold transition-colors border border-[#e2e8f0]"
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
