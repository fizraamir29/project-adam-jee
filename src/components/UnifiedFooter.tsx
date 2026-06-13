'use client';

import React, { useState } from "react";
import { Instagram, Linkedin, Youtube, ChevronDown } from "lucide-react";
import Link from "next/link";

interface UnifiedFooterProps {
  setIsBuilderOpen: (open: boolean) => void;
}

const instagramPosts = [
  "/images/blue_rgb_pc_cases_1780241349905.png",
  "/images/testimonial_setup2.png",
  "/images/testimonial_setup3.png",
  "/images/testimonial_setup4.png",
  "/images/testimonial_setup5.png",
  "/images/testimonial_setup1.png",
];

const navLinkClass =
  "hover:text-white text-left transition-colors duration-200 cursor-pointer bg-transparent border-none text-white/80 text-sm font-medium p-0";

export default function UnifiedFooter({ setIsBuilderOpen }: UnifiedFooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-gradient-to-b from-[#1e4a7a] to-[#0d2a52] text-white">

      {/* Newsletter */}
      <div className="px-4 md:px-12 py-16">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-6">
          <div className="flex items-center gap-2">
            <img
              src="/images/Mask group (2).png"
              alt="Adamjee"
              className="h-10 w-auto object-contain"
            />
            <img
              src="/images/Mask group (1).png"
              alt="Adamjee Computers"
              className="h-6 w-auto object-contain brightness-0 invert"
            />
          </div>

          <h2 className="text-2xl md:text-[28px] font-semibold text-white tracking-tight">
            Stay In The Loop With Our Weekly Newsletter
          </h2>

          <form onSubmit={handleSubscribe} className="w-full max-w-lg">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-white text-[#0a1b2d] px-6 py-4 rounded-full text-sm font-medium focus:outline-none placeholder-gray-400 shadow-lg"
            />
          </form>

          <p className="text-sm text-white/80 font-medium">
            Sign up for exclusive drops, esports news, and member-only performance deals.
          </p>

          {subscribed && (
            <p className="text-sm text-green-400 font-semibold">
              🎉 You&apos;re subscribed! Welcome to the Adamjee family.
            </p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-12">
        <hr className="border-white/20" />
      </div>

      {/* Links */}
      <div className="px-4 md:px-12 py-14">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">

          <div className="md:col-span-5 lg:col-span-4 space-y-4">
            <h4 className="text-white font-bold text-lg">About Us</h4>
            <p className="text-sm text-white/75 leading-relaxed pr-4">
              Your trusted destination for gaming PCs, laptops, custom builds, and premium
              tech accessories — delivering performance, reliability, and expert support
              across Pakistan.
            </p>
          </div>

          <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="text-white font-bold text-lg">Shop</h4>
              <nav className="flex flex-col gap-3">
                <Link href="/category/all" className={navLinkClass}>All Products</Link>
                <button onClick={() => setIsBuilderOpen(true)} className={navLinkClass}>
                  Custom PC Builds
                </button>
                <Link href="/category/accessories" className={navLinkClass}>Gaming Accessories</Link>
                <Link href="/category/sale" className={navLinkClass}>Flash Sale</Link>
                <Link href="/blog" className={navLinkClass}>Blog</Link>
              </nav>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-bold text-lg">Company</h4>
              <nav className="flex flex-col gap-3">
                <Link href="/about" className={navLinkClass}>Our Story</Link>
                <Link href="/faq" className={navLinkClass}>FAQ</Link>
                <Link href="/contact" className={navLinkClass}>Contact Us</Link>
              </nav>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-bold text-lg">Support</h4>
              <nav className="flex flex-col gap-3">
                <Link href="/warranty-returns" className={navLinkClass}>Shipping &amp; Returns</Link>
                <Link href="/privacy-policy" className={navLinkClass}>Privacy Policy</Link>
                <Link href="/terms" className={navLinkClass}>Terms of Service</Link>
              </nav>
            </div>
          </div>

        </div>
      </div>

      {/* Instagram */}
      <div className="px-4 md:px-12 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Follow Our Instagram</h3>
            <span className="text-white/75 text-sm">@AdamjeeComputers</span>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {instagramPosts.map((src, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] rounded-2xl overflow-hidden bg-[#0e2240] shadow-lg cursor-pointer group relative"
                >
                  <img
                    src={src}
                    alt={`Gaming setup ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Play Button Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-[#0a1b2d] shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Gradient overlay to fade bottom edges */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0d2a52] to-transparent pointer-events-none" />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 pb-4">
            <div className="flex items-center gap-3">
              {[Instagram, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/30 hover:border-white flex items-center justify-center text-white transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-6 text-sm text-white/75">
              <Link href="/accessibility" className={navLinkClass}>Accessibility</Link>
              <Link href="/terms" className={navLinkClass}>Terms of Service</Link>
              <Link href="/privacy-policy" className={navLinkClass}>Privacy</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-12">
        <hr className="border-white/10" />
      </div>

      {/* Bottom bar */}
      <div className="px-4 md:px-12 py-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
          <p>
            &copy; 2026{" "}
            <span className="font-semibold text-white">Adamjee Computers</span>. All rights reserved.
          </p>

          <div className="flex items-center gap-1 cursor-pointer">
            <span className="text-white/80">United States ( USD $ )</span>
            <ChevronDown className="w-4 h-4 text-white/80" />
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white rounded text-[#1a1f71] font-black italic text-[11px]">VISA</span>
            <span className="px-2 py-1 bg-[#1a1919] rounded flex items-center gap-0.5">
              <span className="w-3.5 h-3.5 rounded-full bg-[#0a1b2d] block" />
              <span className="-ml-1.5 w-3.5 h-3.5 rounded-full bg-yellow-500 block" />
            </span>
            <span className="px-2 py-1 bg-[#016FD0] rounded text-white font-bold text-[9px] uppercase">AMEX</span>
            <span className="px-2 py-1 bg-[#003087] rounded text-white font-bold italic text-[10px]">
              Pay<span className="text-sky-300">Pal</span>
            </span>
            <span className="px-2 py-1 bg-[#0079C1] rounded text-white font-bold text-[9px] uppercase">DINERS</span>
            <span className="px-2 py-1 bg-white border border-gray-200 rounded text-[#f58220] font-bold text-[9px] uppercase">DISCOVER</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
