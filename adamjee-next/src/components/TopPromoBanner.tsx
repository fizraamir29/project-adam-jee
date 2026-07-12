'use client';
import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function TopPromoBanner() {
  return (
    <div id="top-promo-banner" className="bg-[#164475] text-white text-xs py-3 px-4 md:px-12 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 text-center font-medium tracking-wide">
      <div className="flex items-center space-x-3 text-white/80">
        <Facebook className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
        <Twitter className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
        <Instagram className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
        <Linkedin className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
      </div>
      <div className="flex items-center text-white/95 overflow-hidden whitespace-nowrap w-48 sm:w-64">
        <div className="animate-marquee">
          <span className="px-4">Save up to 60% with code BLACKFRIDAY • Free shipping over $1000 •</span>
          <span className="px-4">Save up to 60% with code BLACKFRIDAY • Free shipping over $1000 •</span>
        </div>
      </div>
      <div className="flex items-center space-x-6 text-white/90">
        <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-1">English <span className="text-[9px]">▼</span></span>
        <div className="hover:text-white cursor-pointer transition-colors flex items-center gap-1">
          <span>Pakistan (USD $ )</span> <span className="text-[9px]">▼</span>
        </div>
      </div>
    </div>
  );
}
