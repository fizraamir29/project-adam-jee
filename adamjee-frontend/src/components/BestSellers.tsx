import React from "react";
import { Star } from "lucide-react";
import { Product } from "../types";
import { getProducts } from "../utils/storage";

interface BestSellersProps {
  bundle: Product[];
  onToggleBundle: (product: Product) => void;
  onAddBundleToCart: () => void;
  showBundleMessage: boolean;
  formatPrice: (usdAmount: number) => string;
}

export default function BestSellers({
  bundle,
  onToggleBundle,
  onAddBundleToCart,
  showBundleMessage,
  formatPrice
}: BestSellersProps) {
  
  const handleApplyBundleDiscount = (subtotal: number) => {
    return bundle.length >= 3 ? subtotal * 0.7 : subtotal;
  };

  const allProducts = getProducts();
  const bundleProducts = allProducts.filter(p => p.category === 'Accessories' || p.tag === 'Best Seller' || p.id?.startsWith('bp')).slice(0, 4);

  const bundleTotal = bundle.reduce((a, b) => a + b.price, 0);
  const discountedTotal = handleApplyBundleDiscount(bundleTotal);

  return (
    <section id="best-sellers" className="px-4 md:px-12 py-16 relative z-10 bg-white font-sans">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Section Header spanning full width */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pb-8 text-left">
          <div className="lg:col-span-2 space-y-2">
            <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#164475] block">
              BEST SELLERS / TRENDING NOW
            </span>
            <h2 className="text-[38px] md:text-[42px] leading-tight tracking-tight text-black">
              Pakistan's Most Popular<br />
              <span className="font-black">Gaming &amp; PC Products</span>
            </h2>
          </div>
          <div className="lg:pl-4 pt-1">
            <p className="text-gray-500 text-[13px] leading-relaxed">
              Explore our top-selling products trusted by gamers and PC enthusiasts nationwide. From powerful GPUs to gaming laptops and custom-built PCs
            </p>
          </div>
        </div>

        {/* Grid containing cards and Your Bundle sticky sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Left Column product grid — scrollable */}
          <div className="lg:col-span-2 reveal-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bundleProducts.map(prod => {
              const inBundle = bundle.find(b => b.id === prod.id);
              return (
                <div key={prod.id} className="bg-[#f8f9fa] rounded-[20px] flex flex-col justify-between p-4 card-hover">
                  {/* Image Area */}
                  <div className="relative bg-[#f8f9fa] rounded-[16px] flex items-center justify-center h-[200px] w-full overflow-hidden select-none">
                    <img 
                      src={prod.image} 
                      className="max-h-[75%] max-w-[75%] object-contain select-none pointer-events-none" 
                      alt={prod.name} 
                      referrerPolicy="no-referrer"
                    />
                    {prod.tag === "Hot" ? (
                      <span className="absolute top-3 right-3 bg-[#0a1b2d] text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider select-none">
                        HOT
                      </span>
                    ) : (
                      <span className="absolute top-3 right-3 bg-white px-3 py-1.5 rounded-full text-xs font-medium text-black flex items-center space-x-1 shadow-sm select-none">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>5.0</span>
                      </span>
                    )}
                  </div>

                  {/* Text area */}
                  <div className="mt-4 space-y-1 text-left px-1">
                    <span className="text-[12px] text-gray-500 block">Code u2917w</span>
                    <div className="flex justify-between items-baseline py-0.5">
                      <h4 className="text-[18px] font-bold text-black tracking-tight leading-snug">{prod.name}</h4>
                      <span className="text-[14px] text-gray-500 pl-2 whitespace-nowrap">{formatPrice(prod.price)}</span>
                    </div>
                    
                    <div className="pt-2">
                      <button 
                        onClick={() => onToggleBundle(prod)}
                        className={`w-full py-3 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300 cursor-pointer text-center border ${
                          inBundle 
                            ? 'bg-[#164475] hover:bg-[#0c2f56] text-white border-transparent shadow-md' 
                            : 'bg-transparent text-black border-gray-300 hover:border-[#164475]'
                        }`}
                      >
                        Add to Bundle
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>

          {/* Right Column — Bundle Calculator FIXED to viewport */}
          <div className="hidden lg:block relative reveal-right delay-200">
            <div className="bg-white p-8 rounded-[24px] border border-gray-200 shadow-sm flex flex-col justify-between sticky top-6" style={{ position: 'sticky', top: '24px' }}>
              <div className="space-y-4">
                <h3 className="text-[34px] font-bold text-black tracking-tight text-center">
                  Your Bundle
                </h3>
                <p className="text-[14px] text-gray-500 text-center leading-relaxed font-normal">
                  Add at least 3 products to proceed and Save 30%
                </p>

                {/* Progress Bar of Bundle items select */}
                <div className="py-4 border-b border-gray-100 mb-2">
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden max-w-[280px] mx-auto">
                    <div 
                      className="bg-[#164475] h-full transition-all duration-500" 
                      style={{ width: `${Math.min((bundle.length / 3) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Selected List details without internal scrollbar */}
                <div className="divide-y divide-gray-100 pr-1">
                  {bundle.length === 0 ? (
                    <div className="py-12 text-center text-sm text-gray-400 flex flex-col items-center justify-center space-y-3 select-none">
                      <span className="text-4xl">🧩</span>
                      <p className="font-bold text-gray-500 font-sans">No products in your bundle yet.</p>
                    </div>
                  ) : (
                    bundle.map(item => (
                      <div key={item.id} className="py-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-left">
                          <div className="w-[64px] h-[64px] rounded-[14px] bg-[#f8f9fa] flex flex-shrink-0 items-center justify-center p-1.5">
                            <img 
                              src={item.image} 
                              className="max-h-full max-w-full object-contain" 
                              alt={item.name} 
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex-1 max-w-[190px]">
                            <h5 className="text-[15px] font-bold text-[#0c2f56] leading-tight">{item.name}</h5>
                            <p className="text-[12px] text-gray-400 font-bold my-1">Code {item.code}</p>
                            <p className="text-[16px] font-bold text-[#0c2f56]">{formatPrice(item.price)}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-center space-y-1.5 justify-center">
                          <div className="w-[44px] h-[44px] flex items-center justify-center bg-[#f8f9fa] border border-gray-200 text-[15px] font-bold rounded-xl text-black">
                            1
                          </div>
                          <button 
                            onClick={() => onToggleBundle(item)} 
                            className="text-[12px] text-gray-400 hover:text-[#164475] font-bold transition cursor-pointer bg-transparent border-none underline underline-offset-2"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Price Calculations footer */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center py-2 mb-4">
                  <span className="text-[24px] font-bold text-[#0c2f56]">Total</span>
                  <span className="text-[34px] font-bold text-[#0c2f56]">
                    {formatPrice(discountedTotal)}
                  </span>
                </div>

                {showBundleMessage && (
                  <p className="text-[12px] text-[#164475] font-bold text-center animate-pulse py-2">
                    ⚠️ Please select at least 3 items to get the 30% off benefit!
                  </p>
                )}

                <button 
                  onClick={onAddBundleToCart}
                  className="w-full bg-[#164475] hover:bg-[#0c2f56] active:scale-[0.98] text-white text-[16px] font-bold tracking-wide py-4 rounded-full shadow-lg transition duration-300 cursor-pointer border-none"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
