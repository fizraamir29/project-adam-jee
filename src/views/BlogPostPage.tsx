import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

export default function BlogPostPage() {
  const { id } = useParams() as { id: string };
  
  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#fafbfc]">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-[#64748b] hover:text-[#164475] font-bold mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
        
        <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="h-[400px] relative">
            <img 
              src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=80" 
              alt="Blog Header" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-8 md:p-16">
            <div className="flex items-center gap-4 text-sm text-[#64748b] font-semibold mb-6">
              <span className="bg-[#f8fafc] text-[#164475] px-3 py-1 rounded-full uppercase tracking-widest text-[10px]">Guides</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> May 10, 2026</span>
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> Adamjee Team</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0a1b2d] leading-tight mb-8">
              The Ultimate Guide to Building Your First Custom PC in 2026
            </h1>
            
            <div className="prose prose-lg max-w-none text-[#475569]">
              <p className="lead text-xl text-[#0a1b2d] font-medium mb-8">
                Building your own PC can seem daunting at first, but with the right guidance, it's an incredibly rewarding experience. This guide will walk you through everything you need to know.
              </p>
              
              <h2 className="text-2xl font-bold text-[#0a1b2d] mt-12 mb-4">1. Choosing the Right Components</h2>
              <p>
                The heart of any build is the processor (CPU) and the graphics card (GPU). Depending on whether you are gaming at 1080p, 1440p, or 4K, your requirements will vary drastically. In 2026, we are seeing incredible efficiency from both Intel and AMD's latest architectures.
              </p>
              
              <div className="bg-[#f8fafc] border-l-4 border-[#164475] p-6 my-8 rounded-r-xl">
                <p className="font-semibold italic text-[#0a1b2d] m-0">
                  "Always allocate at least 40% of your budget to the GPU if your primary goal is gaming. Don't bottleneck a high-end card with a budget CPU."
                </p>
              </div>
              
              <h2 className="text-2xl font-bold text-[#0a1b2d] mt-12 mb-4">2. Ensuring Compatibility</h2>
              <p>
                Once you have your core components, you need to ensure they fit together. The motherboard socket must match the CPU, the RAM must be the correct generation (DDR5 is standard now), and your power supply (PSU) must have enough wattage to handle spikes.
              </p>
              
              <h2 className="text-2xl font-bold text-[#0a1b2d] mt-12 mb-4">3. The Assembly Process</h2>
              <p>
                Take your time. Install the CPU, RAM, and NVMe SSD onto the motherboard before placing it into the case. Cable management isn't just for aesthetics; it improves airflow and thermals.
              </p>
            </div>
            
            <div className="border-t border-[#e2e8f0] mt-16 pt-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-bold text-[#0a1b2d]">Share:</span>
                <button className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#64748b] hover:bg-[#1da1f2] hover:text-white transition-colors"><Twitter className="w-4 h-4" /></button>
                <button className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#64748b] hover:bg-[#1877f2] hover:text-white transition-colors"><Facebook className="w-4 h-4" /></button>
                <button className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#64748b] hover:bg-[#0a66c2] hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
