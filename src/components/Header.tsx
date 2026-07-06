'use client';

import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  cartCount: number;
  onCartToggle: () => void;
  onBuildPcOpen: () => void;
}

export default function Header({ cartCount, onCartToggle, onBuildPcOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="main-navigation"
      className={`sticky top-0 z-50 bg-white px-4 md:px-12 py-5 flex justify-between items-center text-gray-800 transition-all duration-500 ease-out ${
        scrolled ? 'header-scrolled rounded-none shadow-md py-4' : 'rounded-t-[32px] md:rounded-t-[40px] mt-2 shadow-sm'
      }`}
    >
      <Link href="/" className="flex items-center gap-2 cursor-pointer select-none">
        <img
          src="/images/Mask group.png"
          alt="AC"
          className="h-9 w-auto object-contain"
        />
        <img
          src="/images/Mask group (1).png"
          alt="Adamjee Computers"
          className="h-7 w-auto object-contain"
        />
      </Link>

      <nav className="hidden lg:flex items-center gap-8 text-[13px] font-medium tracking-wide text-gray-600">
        <Link href="/category/all" className="text-[#164475] font-bold inline-flex items-center gap-1.5 nav-link-underline">
          <span className="w-1.5 h-1.5 rounded-full bg-[#164475] inline-block shrink-0" style={{ marginTop: '1px' }}></span>
          <span>Shop</span>
        </Link>
        <Link href="/category/best-sellers" className="nav-link-underline hover:text-[#164475] transition-colors">
          Best Sellers
        </Link>
        <Link
          href="/build-your-pc"
          className="nav-link-underline hover:text-[#164475] transition-colors cursor-pointer bg-transparent border-none text-gray-600 font-medium"
        >
          Build Your Custom PC
        </Link>
        <Link href="/benchmarks" className="nav-link-underline hover:text-[#164475] transition-colors">
          Benchmarks
        </Link>
        <Link href="/about" className="nav-link-underline hover:text-[#164475] transition-colors">
          Why Us
        </Link>
      </nav>

      <div className="flex items-center gap-5 text-gray-800">
        <Link href="/search" className="icon-hover-scale hover:text-[#164475] transition-colors cursor-pointer bg-transparent border-none p-0 flex items-center justify-center">
          <Search className="w-5 h-5 font-light" strokeWidth={1.5} />
        </Link>

        <button
          onClick={onCartToggle}
          className="icon-hover-scale relative hover:text-[#164475] transition-colors cursor-pointer bg-transparent border-none p-0"
        >
          <ShoppingCart className="w-5 h-5 font-light" strokeWidth={1.5} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#164475] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </button>

        <Link href="/login" className="icon-hover-scale hover:text-[#164475] transition-colors cursor-pointer bg-transparent border-none p-0 flex items-center justify-center">
          <User className="w-5 h-5 font-light" strokeWidth={1.5} />
        </Link>

      </div>
    </header>
  );
}
