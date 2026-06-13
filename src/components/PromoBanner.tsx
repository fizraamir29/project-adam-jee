import React from "react";
import { ArrowRight } from "lucide-react";
import { Product } from "../types";
import { NEW_ARRIVALS } from "../data";

interface PromoBannerProps {
  onAddToCart: (product: Product) => void;
}

export default function PromoBanner({ onAddToCart }: PromoBannerProps) {
  return (
    <section className="px-4 md:px-12 py-12 relative z-10 font-sans reveal-up">
      <div className="relative rounded-[24px] overflow-hidden flex flex-col justify-center min-h-[460px] text-white bg-[#0a1b2d] shadow-2xl">

        {/* Background Right: Gamers Image */}
        <div 
          className="absolute right-0 top-0 h-full w-full lg:w-[65%] z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/promo_gamers_bg.png")' }}
        >
          {/* Gradient fade to blend with the solid left blue */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1b2d] via-[#0a1b2d]/70 to-transparent"></div>
        </div>

        {/* Background Left: Neon Lines */}
        <div 
          className="absolute left-0 top-0 h-full w-[40%] lg:w-[30%] z-0 bg-cover bg-left opacity-80"
          style={{ backgroundImage: 'url("/images/promo_neon_lines.png")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a1b2d]"></div>
        </div>

        {/* Product Card — absolutely positioned at bottom-right */}
        <div className="absolute bottom-0 right-[8%] z-30 hidden lg:block">
          <div
            onClick={() => onAddToCart(NEW_ARRIVALS[0])}
            className="bg-white text-black rounded-t-[20px] rounded-b-none p-5 shadow-2xl w-[220px] flex flex-col gap-2 cursor-pointer hover:-translate-y-1 transition-all duration-300 group/pcard"
          >
            {/* Heart icon */}
            <div className="w-7 h-7 rounded-full bg-[#164475] flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white fill-white" viewBox="0 0 24 24">
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>

            {/* Product Image */}
            <div className="flex items-center justify-center py-1">
              <img
                src="/images/dell_led_monitor_1780238004077.png"
                className="max-w-[160px] max-h-[100px] w-auto h-auto object-contain transition-transform duration-300 group-hover/pcard:scale-105"
                alt="Dell LED Monitor"
                style={{ mixBlendMode: "multiply" }}
              />
            </div>

            {/* Product Info */}
            <div className="text-left">
              <span className="text-[11px] text-gray-400 block">Code u2917w</span>
              <h3 className="text-[16px] font-bold text-black tracking-tight leading-snug">29" Inch LED DELL</h3>
              <div className="flex items-center space-x-1 text-[13px] text-[#164475] font-bold mt-1">
                <span>Check Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Content — Left text only */}
        <div className="relative z-20 w-full min-h-[460px] flex items-center">
          <div className="px-8 md:px-14 lg:px-20 py-16 max-w-[520px]">

            {/* Label */}
            <div className="inline-flex items-center space-x-2 text-[11px] font-bold tracking-[0.1em] text-white uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>EXPERIENCE EVOLUTION.</span>
            </div>

            {/* Heading */}
            <h2 className="text-[44px] md:text-[52px] font-medium leading-[1.05] tracking-tight text-white mb-5">
              Experience the<br />
              Next-Level<br />
              <span className="text-white font-bold">Gaming Today</span>
            </h2>

            {/* Description */}
            <p className="text-white/80 text-[14px] leading-relaxed max-w-sm font-normal mb-7">
              Watch powerful gaming setups, custom PC builds, and performance showcases designed for gamers, creators, and tech enthusiasts across Pakistan.
            </p>

            {/* Button */}
            <button
              className="bg-white text-black font-bold tracking-wide px-8 py-3.5 rounded-full text-[14px] shadow-xl hover:bg-gray-100 hover:scale-105 transition-all duration-300"
            >
              Shop Now
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
