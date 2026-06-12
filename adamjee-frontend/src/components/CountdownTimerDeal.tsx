import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowRight as ArrowRightIcon } from "lucide-react";
import { Product } from "../types";

interface CountdownTimerDealProps {
  onAddToCart: (product: Product) => void;
}

function useCountdown(initialHrs = 12, initialMins = 25, initialSecs = 45) {
  const [time, setTime] = useState({ hrs: initialHrs, mins: initialMins, secs: initialSecs });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hrs > 0) return { hrs: prev.hrs - 1, mins: 59, secs: 59 };
        return { hrs: initialHrs, mins: 0, secs: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [initialHrs]);

  return time;
}

const pad = (n: number) => String(n).padStart(2, "0");

const dealCards = [
  {
    id: "deal-v1",
    badge: "20% OFF",
    rating: "5.0",
    image: "/images/deal-vr.png",
    title: "Gaming Accessories",
    subtitle: "Discounts",
    tagline: "All at unbeatable prices.",
    price: 99,
  },
  {
    id: "deal-v2",
    badge: "30% OFF",
    rating: "4.9",
    image: "/images/deal-laptop.png",
    title: "GPU & Laptop",
    subtitle: "Clearance",
    tagline: "All at unbeatable prices.",
    price: 899,
  },
];

export default function CountdownTimerDeal({ onAddToCart }: CountdownTimerDealProps) {
  const time = useCountdown();
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    sliderRef.current?.scrollBy({ left: direction === "right" ? 300 : -300, behavior: "smooth" });
  };

  return (
    <section className="px-4 md:px-12 py-12 bg-white font-sans">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-4">
        <div className="space-y-2 max-w-lg">
          <span className="text-xs font-bold tracking-wide uppercase text-[#164475]">
            Exclusive Deals / Flash Sale
          </span>
          <h2 className="text-3xl sm:text-[42px] font-bold text-black tracking-tight leading-[1.05]">
            Explore Limited-Time<br />Gaming Deals
          </h2>
        </div>
        <div className="flex-1 max-w-[480px] text-gray-500 text-[14.5px] leading-[1.6] lg:pl-6 pb-2">
          <p className="mb-4">
            Grab exclusive discounts on gaming PCs, laptops, accessories, and PC components before they're gone. Upgrade your setup with unbeatable offers and flash sale prices.
          </p>
          <a href="#flash-sale" className="font-bold text-black border-b-[1.5px] border-black pb-0.5 hover:text-gray-600 hover:border-gray-600 transition-colors inline-flex items-center gap-1.5">
            View Flash Sale <ArrowRightIcon className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* Countdown hero card */}
        <div className="col-span-12 lg:col-span-6 bg-gradient-to-br from-[#0a1b2d] to-[#164475] rounded-[24px] overflow-hidden relative min-h-[460px] shadow-lg">
          
          {/* Subtle texture/glow effect overlay */}
          <div className="absolute inset-0 bg-[url('/images/promo_neon_lines.png')] opacity-10 mix-blend-screen bg-cover pointer-events-none" />

          {/* White shadow/glow behind the headphone */}
          <div className="absolute right-0 bottom-0 w-[280px] h-[280px] md:w-[400px] md:h-[400px] bg-white/20 blur-[80px] rounded-full z-0 translate-x-1/4 translate-y-1/4 pointer-events-none"></div>

          {/* Headphone Image - Absolute positioning for perfect Figma alignment */}
          <img
            src="/images/headphone_transparent.png"
            alt="RGB Gaming Headset"
            className="absolute right-0 bottom-0 w-[240px] sm:w-[300px] md:w-[360px] lg:w-[400px] object-contain select-none drop-shadow-2xl pointer-events-none z-10 transform -rotate-[4deg] origin-bottom-right"
          />

          <div className="relative z-20 flex flex-col justify-center p-8 md:p-10 lg:pl-12 gap-6 h-full w-full md:w-[65%]">
            <div className="space-y-1 mt-2">
              <p className="text-white/80 text-[14px] font-medium tracking-wide">Code u2917w</p>
              <h3 className="text-3xl md:text-[36px] font-semibold text-white tracking-tight">
                29" Inch Led Dell
              </h3>
            </div>

            <div className="flex gap-4 pt-1">
              {[
                { val: pad(time.hrs), label: "HOURS" },
                { val: pad(time.mins), label: "MINUTES" },
                { val: pad(time.secs), label: "SECONDS" },
              ].map(({ val, label }) => (
                <div
                  key={label}
                  className="bg-[#0b1c31]/30 border border-white/20 rounded-[10px] w-[72px] h-[78px] flex flex-col items-center justify-center gap-1 backdrop-blur-sm shadow-sm"
                >
                  <p className="text-[32px] font-bold text-white leading-none">{val}</p>
                  <p className="text-[8px] font-bold text-white uppercase tracking-widest mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() =>
                  onAddToCart({
                    id: "deal-h1",
                    name: '29" Inch Led Dell',
                    code: "u2917w",
                    price: 430,
                    rating: 5.0,
                    image: "/images/headphone_transparent.png",
                  })
                }
                className="bg-white text-black font-bold px-8 py-3.5 rounded-full text-[15px] hover:scale-105 active:scale-95 transition-transform shadow-md cursor-pointer border-none"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>

        {/* Deal cards slider */}
        <div className="col-span-12 lg:col-span-6 flex flex-col justify-between gap-4">
          <div
            ref={sliderRef}
            className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: "none" }}
          >
            {dealCards.map((card) => (
              <div
                key={card.id}
                className="snap-start flex-shrink-0 w-[260px] sm:w-[280px] bg-[#f7f8f9] rounded-[24px] p-6 flex flex-col justify-between min-h-[420px] group hover:shadow-xl transition-shadow duration-300 relative"
              >
                <div className="flex justify-between items-start relative z-10">
                  <span className="bg-[#164475] text-white text-[11px] font-bold tracking-wider px-4 py-1.5 rounded-full">
                    {card.badge}
                  </span>
                  <div className="bg-white px-3 py-1.5 rounded-full text-[11px] font-bold text-black flex items-center gap-1.5 shadow-sm">
                    <span className="text-[#164475] text-[13px]">★</span>
                    <span>{card.rating}</span>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center py-4 relative z-0">
                  <img
                    src={card.image}
                    alt={`${card.title} ${card.subtitle}`}
                    className="max-h-[175px] w-auto object-contain drop-shadow-xl group-hover:-translate-y-2 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-end gap-2">
                    <div>
                      <h4 className="text-[20px] font-semibold text-black tracking-tight leading-[1.2] mb-1.5">
                        {card.title}<br />{card.subtitle}
                      </h4>
                      <p className="text-gray-500 text-[13px] font-medium">{card.tagline}</p>
                    </div>
                    <button
                      onClick={() =>
                        onAddToCart({
                          id: card.id,
                          name: `${card.title} ${card.subtitle}`,
                          code: card.id,
                          price: card.price,
                          rating: parseFloat(card.rating),
                          image: card.image,
                        })
                      }
                      className="w-10 h-10 rounded-full flex items-center justify-center text-black hover:bg-gray-200 transition-colors cursor-pointer flex-shrink-0 -mr-1"
                    >
                      <ArrowRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-1 pr-2">
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-full border-[1.5px] border-gray-200 bg-white text-gray-400 hover:text-black hover:border-gray-400 flex items-center justify-center transition active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 stroke-[1.5]" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 rounded-full bg-[#164475] hover:bg-[#0a1b2d] text-white flex items-center justify-center transition active:scale-95 cursor-pointer border-none"
            >
              <ArrowRight className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
