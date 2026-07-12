'use client';
import React from "react";
import { Star, ArrowRight, Eye } from "lucide-react";
import { Product } from "../types";
import { NEW_ARRIVALS } from "../data";

interface NewArrivalsProps {
  onAddToCart: (product: Product) => void;
  formatPrice: (usdAmount: number) => string;
}

export default function NewArrivals({ onAddToCart, formatPrice }: NewArrivalsProps) {
  const [products, setProducts] = React.useState<Product[]>(() => NEW_ARRIVALS.slice(0, 6));

  React.useEffect(() => {
    fetch('/api/products?limit=6&sort=newest')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          const fetched = data.products;
          if (fetched.length < 6) {
            const fallback = NEW_ARRIVALS.filter(na => !fetched.some((f: any) => f._id === na.id || f.id === na.id || f.id === na._id || f._id === na._id));
            setProducts([...fetched, ...fallback].slice(0, 6));
          } else {
            setProducts(fetched);
          }
        }
      })
      .catch(err => {
        console.error('Failed to load new arrivals:', err);
      });
  }, []);

  return (
    <section id="featured-arrivals" className="px-4 md:px-12 py-12 bg-gray-50/50">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-4 reveal-up">
        <div className="space-y-1 max-w-lg text-left">
          <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#164475]">
            NEW ARRIVALS
          </span>
          <h2 className="text-[44px] md:text-[56px] font-black text-black tracking-tight leading-[1.05]">
            Fresh Tech. Latest<br />Performance.
          </h2>
        </div>
        <div className="flex-1 max-w-[420px] text-gray-500 text-[13px] leading-relaxed lg:pl-6 text-left">
          <p>
            Stay ahead with newly launched gaming hardware, cutting-edge accessories, and upgraded PC components. Discover the latest arrivals from top tech brands
          </p>
          <a href="#featured-arrivals" className="font-bold text-black border-b-[1.5px] border-black pb-0.5 mt-4 inline-flex items-center gap-1.5 hover:text-gray-700 transition">
            Explore New Arrivals <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </a>
        </div>
      </div>

      {/* 6 Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
        {products.map((prod, idx) => {
          // Add border for Keyboard to match image
          const isKeyboard = prod.id === "na2";
          const cardBgClass = isKeyboard ? "bg-[#f8f9fa] border-[#164475]" : "bg-[#f8f9fa] border-transparent";
          const delayClass = `delay-${((idx % 3) + 1) * 100}`;

          return (
            <div 
              key={prod.id} 
              className={`relative h-[420px] max-w-[380px] w-full mx-auto rounded-[24px] overflow-hidden group flex flex-col justify-between p-6 border ${cardBgClass} card-hover reveal-up ${delayClass}`}
              onClick={() => onAddToCart(prod)}
            >
              {/* 1. Header Row (Tags and Indicators) */}
              <div className="flex justify-between items-center w-full select-none z-10">
                <span className={`text-[11px] font-bold px-4 py-1.5 rounded-full ${
                  prod.tag === 'New' ? 'bg-[#164475] text-white' : 'bg-[#0a1b2d] text-white'
                }`}>
                  {prod.tag}
                </span>
                
                {isKeyboard ? (
                  <span className="bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm">
                    <Eye className="w-4 h-4 text-black" strokeWidth={2} />
                  </span>
                ) : (
                  <span className="bg-white px-2.5 py-1.5 rounded-full text-[11px] font-medium text-black flex items-center space-x-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-[#164475] text-[#164475]" />
                    <span>{prod.rating.toFixed(1)}</span>
                  </span>
                )}
              </div>

              {/* 2. Centered Product Display Image */}
              <div className="relative w-full h-[160px] flex flex-col justify-center items-center mt-2 mb-1 select-none flex-1">
                <div className="w-full flex items-center justify-center">
                  <img 
                    src={prod.image} 
                    className="max-w-[240px] max-h-[140px] w-auto h-auto object-contain product-img-zoom" 
                    alt={prod.name} 
                    referrerPolicy="no-referrer"
                    style={{ mixBlendMode: "multiply" }}
                  />
                </div>
                {/* Dots under the keyboard image */}
                {isKeyboard && (
                  <div className="flex space-x-1.5 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full border border-black block" />
                    <span className="w-1.5 h-1.5 rounded-full bg-black block" />
                    <span className="w-1.5 h-1.5 rounded-full border border-black block" />
                  </div>
                )}
              </div>

              {/* 3. Footer Content (Code, Name, Price, Thumbnails) */}
              <div className="w-full space-y-1 mt-auto">
                <span className="text-[12px] text-gray-500 font-normal block text-left">
                  {prod.code}
                </span>
                
                {/* Name and Price on same baseline */}
                <div className="flex justify-between items-baseline gap-2 pb-3">
                  <h3 className="text-[20px] font-bold text-black tracking-tight truncate flex-1 leading-tight text-left">
                    {prod.name}
                  </h3>
                  <span className="text-[14px] text-gray-500 whitespace-nowrap">
                    {formatPrice(prod.price)}
                  </span>
                </div>
                
                {/* Thumbnails Row */}
                {prod.additionalImages && prod.additionalImages.length > 0 && (
                  <div className="flex gap-2">
                    {prod.additionalImages.map((img, i) => (
                      <div key={i} className={`w-8 h-8 rounded border flex items-center justify-center bg-white ${i === 0 ? 'border-black' : 'border-gray-200'}`}>
                        <img src={img} alt="Thumb" className="max-w-[20px] max-h-[20px] object-contain mix-blend-multiply" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}
