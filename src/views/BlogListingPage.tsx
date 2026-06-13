import Link from 'next/link';
import React from 'react';

import { ArrowRight, Calendar, User } from 'lucide-react';

const BLOG_POSTS = [
  {
    id: '1',
    title: 'The Ultimate Guide to Building Your First Custom PC in 2026',
    excerpt: 'Everything you need to know about choosing the right components, ensuring compatibility, and putting it all together.',
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80',
    category: 'Guides',
    date: 'May 10, 2026',
    author: 'Adamjee Team'
  },
  {
    id: '2',
    title: 'NVIDIA RTX 50-Series: Performance Benchmarks & Review',
    excerpt: 'We tested the latest GPUs from NVIDIA across 20 different games at 4K resolution. Here are the shocking results.',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
    category: 'Reviews',
    date: 'May 08, 2026',
    author: 'Tech Reviewer'
  },
  {
    id: '3',
    title: 'Top 5 Mechanical Keyboards for Competitive Gaming',
    excerpt: 'From rapid triggers to custom switches, discover which keyboards give you the edge in competitive esports.',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
    category: 'Peripherals',
    date: 'May 05, 2026',
    author: 'Adamjee Team'
  },
  {
    id: '4',
    title: 'How to Optimize Windows 11 for Maximum FPS',
    excerpt: 'A step-by-step guide to disabling bloatware, tweaking registry settings, and getting every last frame out of your rig.',
    image: 'https://images.unsplash.com/photo-1626218174358-7769486c4b79?auto=format&fit=crop&w=800&q=80',
    category: 'Software',
    date: 'May 01, 2026',
    author: 'Performance Guru'
  }
];

export default function BlogListingPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#fafbfc]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0a1b2d] tracking-tight mb-4">Smart Tech Insights</h1>
          <p className="text-[#64748b] max-w-2xl mx-auto text-lg">
            Stay updated with the latest in tech, gaming hardware, and custom builds from our experts.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <Link href={`/blog/${BLOG_POSTS[0].id}`} className="group relative block rounded-3xl overflow-hidden bg-white border border-[#e2e8f0] shadow-sm hover:shadow-xl transition-all h-[500px]">
            <img src={BLOG_POSTS[0].image} alt={BLOG_POSTS[0].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white w-full md:w-2/3">
              <span className="inline-block bg-[#164475] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                {BLOG_POSTS[0].category}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight group-hover:text-[#164475] transition-colors">{BLOG_POSTS[0].title}</h2>
              <p className="text-gray-200 mb-6 line-clamp-2">{BLOG_POSTS[0].excerpt}</p>
              <div className="flex items-center gap-6 text-sm text-gray-300">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {BLOG_POSTS[0].date}</span>
                <span className="flex items-center gap-2"><User className="w-4 h-4" /> {BLOG_POSTS[0].author}</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.slice(1).map(post => (
            <Link key={post.id} href={`/blog/${post.id}`} className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col">
              <div className="aspect-video relative overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[#0a1b2d] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  {post.category}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-[#0a1b2d] mb-3 group-hover:text-[#164475] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-[#64748b] text-sm mb-6 line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#e2e8f0]">
                  <span className="text-xs text-[#64748b] font-semibold">{post.date}</span>
                  <span className="flex items-center gap-1 text-[#164475] text-sm font-bold group-hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="border-2 border-[#cbd5e1] text-[#0a1b2d] hover:border-[#164475] hover:text-[#164475] font-bold px-8 py-3 rounded-full transition-colors">
            Load More Articles
          </button>
        </div>
      </div>
    </div>
  );
}
