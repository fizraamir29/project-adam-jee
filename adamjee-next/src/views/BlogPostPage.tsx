'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

const STATIC_POSTS: Record<string, any> = {
  '1': {
    title: 'The Ultimate Guide to Building Your First Custom PC in 2026',
    content: `Building your own PC can seem daunting at first, but with the right guidance, it's an incredibly rewarding experience. This guide will walk you through everything you need to know.

1. Choosing the Right Components
The heart of any build is the processor (CPU) and the graphics card (GPU). Depending on whether you are gaming at 1080p, 1440p, or 4K, your requirements will vary drastically. In 2026, we are seeing incredible efficiency from both Intel and AMD's latest architectures.

Always allocate at least 40% of your budget to the GPU if your primary goal is gaming. Don't bottleneck a high-end card with a budget CPU.

2. Ensuring Compatibility
Once you have your core components, you need to ensure they fit together. The motherboard socket must match the CPU, the RAM must be the correct generation (DDR5 is standard now), and your power supply (PSU) must have enough wattage to handle spikes.

3. The Assembly Process
Take your time. Install the CPU, RAM, and NVMe SSD onto the motherboard before placing it into the case. Cable management isn't just for aesthetics; it improves airflow and thermals.`,
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=80',
    category: 'Guides',
    date: 'May 10, 2026',
    author: 'Adamjee Team'
  },
  '2': {
    title: 'NVIDIA RTX 50-Series: Performance Benchmarks & Review',
    content: `We tested the latest GPUs from NVIDIA across 20 different games at 4K resolution. Here are the shocking results.

Unprecedented Power
The new RTX 50-series architecture delivers up to 2x ray tracing performance compared to its predecessor. With DLSS 4 frame generation, we saw frame rates exceed 140 FPS in Cyberpunk 2077 at native 4K max settings.

Thermal Performance
Thanks to the new 3nm process, power draw is significantly reduced, meaning cards run cooler and quieter under load.`,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80',
    category: 'Reviews',
    date: 'May 08, 2026',
    author: 'Tech Reviewer'
  },
  '3': {
    title: 'Top 5 Mechanical Keyboards for Competitive Gaming',
    content: `From rapid triggers to custom switches, discover which keyboards give you the edge in competitive esports.

1. SteelSeries Apex Pro
Featuring OmniPoint 2.0 adjustable hypermagnetic switches, this keyboard offers the fastest response time on the market.

2. Razer Huntsman V3 Pro
Analog optical switches with rapid trigger mode make this a favorite for tactical shooters like Valorant and Counter-Strike 2.`,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80',
    category: 'Peripherals',
    date: 'May 05, 2026',
    author: 'Adamjee Team'
  },
  '4': {
    title: 'How to Optimize Windows 11 for Maximum FPS',
    content: `A step-by-step guide to disabling bloatware, tweaking registry settings, and getting every last frame out of your rig.

Game Mode & Hardware Acceleration
Ensure Game Mode is turned on in Windows settings. This prioritizes game processes. Additionally, enable Hardware-Accelerated GPU Scheduling (HAGS) for improved latency.

Disable Background Apps
Turn off unnecessary startup programs and background services to free up system memory and CPU cycles.`,
    image: 'https://images.unsplash.com/photo-1626218174358-7769486c4b79?auto=format&fit=crop&w=1200&q=80',
    category: 'Software',
    date: 'May 01, 2026',
    author: 'Performance Guru'
  }
};

export default function BlogPostPage() {
  const { id } = useParams() as { id: string };
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (STATIC_POSTS[id]) {
      setPost(STATIC_POSTS[id]);
      setLoading(false);
    } else {
      fetch(`/api/blogs/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.blog) {
            setPost({
              title: data.blog.title,
              content: data.blog.content,
              image: data.blog.image || 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=80',
              category: data.blog.category || 'Guides',
              date: new Date(data.blog.publishedAt || data.blog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
              author: data.blog.author || 'Adamjee Team'
            });
          }
        })
        .catch(err => console.error("Failed to fetch blog post:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#fafbfc] flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-[#164475] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#fafbfc] text-center">
        <h1 className="text-2xl font-bold text-red-500">Blog post not found</h1>
        <Link href="/blog" className="text-[#164475] hover:underline mt-4 inline-block font-semibold">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#fafbfc]">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-[#64748b] hover:text-[#164475] font-bold mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
        
        <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="h-[400px] relative">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-8 md:p-16">
            <div className="flex items-center gap-4 text-sm text-[#64748b] font-semibold mb-6">
              <span className="bg-[#f8fafc] text-[#164475] px-3 py-1 rounded-full uppercase tracking-widest text-[10px]">{post.category}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.date}</span>
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> {post.author}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0a1b2d] leading-tight mb-8">
              {post.title}
            </h1>
            
            <div className="prose prose-lg max-w-none text-[#475569] whitespace-pre-wrap leading-relaxed">
              {post.content}
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
