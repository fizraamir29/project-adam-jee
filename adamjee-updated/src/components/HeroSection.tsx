import React from "react";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

interface HeroSectionProps {
  onBuildPcOpen: () => void;
}

export default function HeroSection({ onBuildPcOpen }: HeroSectionProps) {
  return (
    <section className="px-4 md:px-12 py-0 pb-6 relative z-10 font-sans">
      <div className="relative rounded-b-[32px] md:rounded-b-[40px] overflow-hidden flex flex-col justify-center min-h-[580px] text-white bg-[#164475] shadow-2xl">
        
        {/* Left side glowing neon chevrons */}
        <div className="absolute top-0 left-0 w-full lg:w-1/2 h-full opacity-30 pointer-events-none flex items-center justify-start z-0 overflow-hidden">
          <svg viewBox="0 0 500 560" className="w-[120%] h-full max-w-[600px] -ml-20" fill="none">
            <defs>
              <filter id="neon-hero-left" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="6" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <g filter="url(#neon-hero-left)" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 250,50 L 50,280 L 250,510" stroke="#bae6fd" strokeWidth="4"/>
              <path d="M 250,50 L 50,280 L 250,510" stroke="#bae6fd" strokeWidth="2"/>
              <path d="M 330,120 L 150,280 L 330,440" stroke="#7cb3d8" strokeWidth="3" opacity="0.5"/>
              <path d="M 150,0 L -50,280 L 150,560" stroke="#bae6fd" strokeWidth="6" opacity="0.2"/>
            </g>
          </svg>
        </div>

        {/* Right side background image (simulating the PC cases) */}
        <div 
          className="absolute top-0 right-0 w-full lg:w-[55%] h-full z-0 bg-cover bg-center bg-no-repeat blur-to-sharp"
          style={{ backgroundImage: 'url("/images/blue_rgb_pc_cases_1780241349905.png")', opacity: 0.9 }}
        >
          {/* Gradient fade to blend with the solid blue */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#164475] via-[#164475]/50 to-transparent"></div>
        </div>

        {/* Right floating social bar */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center bg-black/40 backdrop-blur-md rounded-l-2xl py-6 px-3 z-30 space-y-5 reveal-right delay-500">
          <Facebook className="w-4 h-4 text-white hover:text-[#164475] cursor-pointer icon-hover-scale" />
          {/* X Icon (SVG) */}
          <svg className="w-4 h-4 fill-white hover:fill-[#164475] cursor-pointer icon-hover-scale" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          <Instagram className="w-4 h-4 text-white hover:text-[#164475] cursor-pointer icon-hover-scale" />
          <Youtube className="w-4 h-4 text-white hover:text-[#164475] cursor-pointer icon-hover-scale" />
          
          <div className="mt-8 pt-4 border-t border-white/20">
            <div className="rotate-180" style={{ writingMode: 'vertical-rl' }}>
              <span className="inline-block bg-white text-[#164475] font-black text-[10px] tracking-widest uppercase py-2 px-3 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                Get 20% Off
              </span>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="relative z-20 w-full min-h-[580px] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-8 md:px-14 lg:px-20 py-16 w-full">
            <div className="lg:col-span-7 space-y-7 text-left">
              
              {/* Label */}
              <div className="inline-flex items-center space-x-2 text-[11px] font-black tracking-widest text-[#7cb3d8] uppercase reveal-up delay-100">
                <span className="w-2 h-2 rounded-full bg-[#7cb3d8] animate-pulse-glow" />
                <span>BUILT FOR CREATORS & PC ENTHUSIASTS</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-[60px] font-medium leading-[1.1] tracking-tight text-white reveal-up delay-200">
                Power Your Setup<br />
                with the Latest Gaming<br />
                <span className="text-[#7cb3d8] font-bold">& PC Hardware</span>
              </h1>

              {/* Subtext */}
              <p className="text-white/90 text-sm leading-relaxed max-w-lg font-normal reveal-up delay-300">
                Upgrade your gaming and work setup with high-performance PCs, laptops, graphic cards, accessories, and the latest tech — all at competitive prices with trusted support across Pakistan.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-2 reveal-up delay-400">
                <a
                  href="#featured-arrivals"
                  className="bg-white text-gray-900 font-bold tracking-wide px-8 py-3.5 rounded-full text-sm shadow-xl hover:bg-gray-100 hover:scale-105 transition-all duration-300"
                >
                  Shop Now
                </a>
                <a
                  href="#perf-checker"
                  className="border-2 border-white/40 text-white font-bold px-8 py-3.5 rounded-full text-sm hover:border-white hover:bg-white/10 transition-all duration-300 cursor-pointer bg-transparent flex items-center justify-center"
                >
                  Build Your PC
                </a>
              </div>
            </div>
            <div className="lg:col-span-5 hidden lg:block" />
          </div>
        </div>



        {/* Bottom carousel dots */}
        <div className="absolute bottom-8 left-8 md:left-20 flex space-x-2.5 z-20">
          <span className="w-2 h-2 rounded-full border-2 border-[#7cb3d8] bg-transparent block cursor-pointer hover:bg-[#7cb3d8]/50" />
          <span className="w-2 h-2 rounded-full bg-white block cursor-pointer" />
          <span className="w-2 h-2 rounded-full border-2 border-[#7cb3d8] bg-transparent block cursor-pointer hover:bg-[#7cb3d8]/50" />
        </div>

        {/* Bottom right explore categories */}
        <div className="absolute bottom-6 right-24 hidden lg:flex items-center space-x-3 text-white/90 text-[13px] font-medium z-20">
          <span className="tracking-wide">Explore Categories</span>
          <a
            href="#explore-categories"
            className="w-10 h-10 rounded-full bg-transparent border border-white/30 text-white flex items-center justify-center transition-all hover:bg-white/10 hover:border-white"
          >
            <span className="text-lg font-light mb-0.5">↓</span>
          </a>
        </div>

      </div>
    </section>
  );
}
