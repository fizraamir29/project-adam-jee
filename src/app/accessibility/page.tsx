import React from 'react';
import Link from 'next/link';

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-12">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-8 font-medium">
          <Link href="/" className="hover:text-[#164475]">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#0a1b2d]">Accessibility</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-[#0a1b2d] mb-8 leading-tight">
          Accessibility Statement
        </h1>
        
        <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-[#0a1b2d] mb-4">Our Commitment</h2>
            <p>
              Adamjee Computers is committed to making our website's content accessible and user friendly to everyone. 
              If you are having difficulty viewing or navigating the content on this website, or notice any content, 
              feature, or functionality that you believe is not fully accessible to people with disabilities, please 
              call our Customer Service team at +92 300 0000000 or email our team at support@adamjeecomputers.com 
              with "Disabled Access" in the subject line and provide a description of the specific feature you feel is 
              not fully accessible or a suggestion for improvement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0a1b2d] mb-4">Feedback</h2>
            <p>
              We take your feedback seriously and will consider it as we evaluate ways to accommodate all of our 
              customers and our overall accessibility policies. Additionally, while we do not control such vendors, 
              we strongly encourage vendors of third-party digital content to provide content that is accessible 
              and user friendly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
