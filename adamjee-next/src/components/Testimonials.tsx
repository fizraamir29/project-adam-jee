'use client';
import React from "react";
import { Star, Play } from "lucide-react";

interface TestimonialsProps {
  onOpenSubmitModal: () => void;
}

export default function Testimonials({ onOpenSubmitModal }: TestimonialsProps) {
  return (
    <section id="why-choose-us" className="px-4 md:px-12 py-16 bg-white font-sans">
      {/* Header */}
      <div className="text-center space-y-2 mb-12 max-w-2xl mx-auto reveal-up">
        <span className="text-xs font-extrabold tracking-widest uppercase text-[#164475]">
          WHY CHOOSE US
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-[#0a1b2d] tracking-tight leading-tight">
          Your Trusted Destination For<br />
          <span className="font-black">Gaming & PC Hardware</span>
        </h2>
      </div>

      {/* 3-col grid — exact Figma Desktop-12 layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto">

        {/* Row 1, Col 1: Testimonial card with image top */}
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden flex flex-col reveal-up delay-100">
          <div className="h-[200px] overflow-hidden">
            <img src="/images/testimonial_setup1.png" className="w-full h-full object-cover" alt="Gaming Setup" />
          </div>
          <div className="p-6 flex flex-col flex-1 justify-between">
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              "Absolutely loved the custom PC build quality and cable management. The performance is smooth, and the team guided me perfectly throughout the process."
            </p>
            <div className="flex items-center space-x-3 border-t border-gray-100 pt-4 mt-4">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=hamza&backgroundColor=b6e3f4"
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                alt="Hamza"
              />
              <div>
                <h5 className="text-sm font-extrabold text-[#0a1b2d]">Hamza A.</h5>
                <span className="text-[10px] text-[#164475] font-bold">Verified Buyer ✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 1, Col 2: Video card (tall, spans 2 rows visually) */}
        <div className="relative rounded-[24px] overflow-hidden bg-[#0a1b2d] min-h-[420px] flex items-center justify-center group cursor-pointer shadow-sm reveal-up delay-200">
          <img
            src="/images/testimonial_setup2.png"
            className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
            alt="Adamjee Setup Showcase"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center space-y-3 text-white">
            <button
              onClick={() => alert("Playing Adamjee Setup Showcase video...")}
              className="w-16 h-16 rounded-full bg-white text-[#0a1b2d] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 cursor-pointer border-none"
            >
              <Play className="w-6 h-6 fill-[#0a1b2d] ml-0.5" />
            </button>
            <span className="text-[10px] uppercase font-black tracking-[0.2em]">Adamjee Setup Showcase</span>
          </div>
        </div>

        {/* Row 1, Col 3: Testimonial card with image top */}
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden flex flex-col reveal-up delay-300">
          <div className="h-[200px] overflow-hidden">
            <img src="/images/testimonial_setup3.png" className="w-full h-full object-cover" alt="Gaming Setup" />
          </div>
          <div className="p-6 flex flex-col flex-1 justify-between">
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              "Ordered my gaming setup from Adamjee Computers and the experience was amazing. Genuine products, fast delivery, and excellent customer support."
            </p>
            <div className="flex items-center space-x-3 border-t border-gray-100 pt-4 mt-4">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=ali&backgroundColor=c0aede"
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                alt="Ali"
              />
              <div>
                <h5 className="text-sm font-extrabold text-[#0a1b2d]">Ali R.</h5>
                <span className="text-[10px] text-[#164475] font-bold">Verified Buyer ✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2, Col 1: Video card */}
        <div className="relative rounded-[24px] overflow-hidden bg-[#0a1b2d] min-h-[340px] flex items-center justify-center group cursor-pointer shadow-sm reveal-up delay-400">
          <img
            src="/images/testimonial_setup4.png"
            className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
            alt="Futuristic Studio"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center space-y-3 text-white">
            <button
              onClick={() => alert("Playing Futuristic Studio setup video...")}
              className="w-14 h-14 rounded-full bg-white text-[#0a1b2d] flex items-center justify-center shadow-2xl group-hover:scale-110 transition duration-300 cursor-pointer border-none"
            >
              <Play className="w-5 h-5 fill-[#0a1b2d] ml-0.5" />
            </button>
            <span className="text-[10px] uppercase font-black tracking-[0.2em]">Futuristic Studio</span>
          </div>
        </div>

        {/* Row 2, Col 2: Text testimonial only */}
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 flex flex-col justify-between min-h-[340px] reveal-up delay-500">
          <div className="space-y-4">
            <div className="flex space-x-1 text-amber-400">
              {[1,2,3,4,5].map(x => <Star key={x} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              "Their upgrade recommendations helped me improve my FPS and streaming performance without overspending. Highly recommended for gamers."
            </p>
          </div>
          <div className="flex items-center space-x-3 border-t border-gray-100 pt-4">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=zeeshan&backgroundColor=ffd5dc"
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
              alt="Zeeshan"
            />
            <div>
              <h5 className="text-sm font-extrabold text-[#0a1b2d]">Zeeshan T.</h5>
              <span className="text-[10px] text-[#164475] font-bold">Verified Buyer ✓</span>
            </div>
          </div>
        </div>

        {/* Row 2, Col 3: Video card */}
        <div className="relative rounded-[24px] overflow-hidden bg-[#0a1b2d] min-h-[340px] flex items-center justify-center group cursor-pointer shadow-sm">
          <img
            src="/images/testimonial_setup5.png"
            className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
            alt="Blue Gaming Room"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center space-y-3 text-white">
            <button
              onClick={() => alert("Playing blue gaming room showcase...")}
              className="w-14 h-14 rounded-full bg-white text-[#0a1b2d] flex items-center justify-center shadow-2xl group-hover:scale-110 transition duration-300 cursor-pointer border-none"
            >
              <Play className="w-5 h-5 fill-[#0a1b2d] ml-0.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Submit Setup CTA button */}
      <div className="flex justify-center mt-12">
        <button
          onClick={onOpenSubmitModal}
          className="bg-[#164475] hover:bg-[#0a1b2d] text-white font-black tracking-wider px-12 py-4 rounded-full text-sm shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border-none"
        >
          Submit Your Setup Now
        </button>
      </div>
    </section>
  );
}
