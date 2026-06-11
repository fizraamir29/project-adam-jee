import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Product } from "../types";
import { getProducts, toggleWishlist, isInWishlist } from "../utils/storage";
import { Star, ShieldCheck, Truck, RefreshCcw, Heart, Share2, Plus, Minus } from "lucide-react";

interface ProductListingPageProps {
  handleAddToCart: (product: Product, qty?: number) => void;
  formatPrice: (usdAmount: number) => string;
}

export default function ProductListingPage({ handleAddToCart, formatPrice }: ProductListingPageProps) {
  const { id } = useParams();
  
  // Find product from our data source
  const allProductsList = getProducts();
  const product = allProductsList.find(p => p.id === id) || allProductsList[0];
  
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product.image);
  const [isLiked, setIsLiked] = useState(isInWishlist(product.id || product._id || ''));

  // Variation States
  const [selectedRam, setSelectedRam] = useState(0); // 0, 1, 2 index for 16, 32, 64
  const [selectedStorage, setSelectedStorage] = useState(0); // 0, 1 index for 1TB, 2TB

  const ramOptions = [
    { label: '16GB', priceMod: 0 },
    { label: '32GB', priceMod: 50 },
    { label: '64GB', priceMod: 150 },
  ];

  const storageOptions = [
    { label: '1TB SSD', priceMod: 0 },
    { label: '2TB SSD', priceMod: 100 },
  ];

  const isAccessory = ["Headphones", "Earphones", "Speakers", "Accessories"].includes(product.category || "");

  // Dynamic Price
  const finalPrice = isAccessory ? product.price : product.price + ramOptions[selectedRam].priceMod + storageOptions[selectedStorage].priceMod;

  const images = [product.image, ...(product.additionalImages || [])];

  const handleAdd = () => {
    for(let i=0; i<quantity; i++) {
        // Here we could ideally pass variation info to handleAddToCart, but to match the current simplified App state we just pass product
        handleAddToCart({ ...product, price: finalPrice }); 
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-8 font-medium reveal-up">
          <Link to="/" className="hover:text-[#164475]">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/category/all" className="hover:text-[#164475]">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-[#0a1b2d]">{product.name}</span>
        </div>

        {/* Top Section: Images & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
          
          {/* Images Area */}
          <div className="space-y-6 reveal-up delay-100">
            <div className="bg-white rounded-3xl border border-gray-100 p-10 flex items-center justify-center aspect-square shadow-sm">
              <img src={mainImage} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setMainImage(img)}
                    className={`bg-white rounded-xl border p-2 aspect-square flex items-center justify-center transition-all ${mainImage === img ? 'border-[#164475] shadow-md' : 'border-gray-200 hover:border-[#164475]/50'}`}
                  >
                    <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Area */}
          <div className="flex flex-col justify-center reveal-up delay-200">
            <div className="mb-6">
              {product.tag && (
                <span className="inline-block bg-[#164475] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
                  {product.tag}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-black text-[#0a1b2d] leading-tight mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="text-gray-500 text-sm ml-2 font-medium">({product.rating} Reviews)</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">{product.code}</div>
              </div>

              {/* Variations */}
              {!isAccessory && (
                <div className="my-6 space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#0a1b2d] mb-2">Memory (RAM)</h4>
                    <div className="flex flex-wrap gap-3">
                      {ramOptions.map((ram, i) => (
                        <button 
                          key={i} 
                          onClick={() => setSelectedRam(i)}
                          className={`border text-sm font-semibold py-2 px-4 rounded-xl transition-colors ${selectedRam === i ? 'border-[#164475] bg-[#164475] text-white shadow-md' : 'border-[#cbd5e1] hover:border-[#164475] hover:bg-[#f8fafc] text-[#0a1b2d]'}`}
                        >
                          {ram.label} {ram.priceMod > 0 ? `(+$${ram.priceMod})` : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0a1b2d] mb-2">Storage</h4>
                    <div className="flex flex-wrap gap-3">
                      {storageOptions.map((storage, i) => (
                        <button 
                          key={i} 
                          onClick={() => setSelectedStorage(i)}
                          className={`border text-sm font-semibold py-2 px-4 rounded-xl transition-colors ${selectedStorage === i ? 'border-[#164475] bg-[#164475] text-white shadow-md' : 'border-[#cbd5e1] hover:border-[#164475] hover:bg-[#f8fafc] text-[#0a1b2d]'}`}
                        >
                          {storage.label} {storage.priceMod > 0 ? `(+$${storage.priceMod})` : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="text-3xl font-black text-[#164475] mb-6">
                {formatPrice(finalPrice)}
              </div>

              <p className="text-gray-600 font-medium leading-relaxed mb-8 whitespace-pre-wrap">
                {product.description || `Experience next-level performance with the ${product.name}. Designed for enthusiasts who demand the best, this product delivers exceptional reliability and power for your setup.`}
              </p>
            </div>

            <hr className="border-gray-200 mb-8" />

            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="flex items-center bg-white border border-gray-200 rounded-full h-14 w-36 shadow-sm">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-[#164475]"><Minus className="w-4 h-4"/></button>
                <div className="flex-1 text-center font-bold text-[#0a1b2d]">{quantity}</div>
                <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-[#164475]"><Plus className="w-4 h-4"/></button>
              </div>

              <button 
                onClick={handleAdd}
                className="flex-1 bg-[#164475] hover:bg-[#0d2a52] text-white h-14 rounded-full font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-xl transform active:scale-[0.98]"
              >
                ADD TO CART
              </button>

              <button 
                onClick={() => {
                  const added = toggleWishlist(product.id || product._id || '');
                  setIsLiked(added);
                }}
                className={`w-14 h-14 flex flex-shrink-0 items-center justify-center rounded-full bg-white border transition-colors shadow-sm ${
                  isLiked ? 'border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:text-[#0a1b2d]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current text-red-500' : ''}`} />
              </button>
            </div>

            {/* Quick Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <div className="w-10 h-10 rounded-full bg-[#164475]/10 text-[#164475] flex items-center justify-center"><ShieldCheck className="w-5 h-5" /></div>
                1 Year Warranty
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <div className="w-10 h-10 rounded-full bg-[#164475]/10 text-[#164475] flex items-center justify-center"><Truck className="w-5 h-5" /></div>
                Fast Delivery
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <div className="w-10 h-10 rounded-full bg-[#164475]/10 text-[#164475] flex items-center justify-center"><RefreshCcw className="w-5 h-5" /></div>
                7 Days Return
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section: Tabs */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-16 reveal-up delay-300">
          <div className="flex border-b border-gray-100">
            {["desc", "specs", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-6 text-sm font-bold tracking-widest uppercase transition-colors relative
                  ${activeTab === tab ? "text-[#164475]" : "text-gray-400 hover:text-[#164475]"}`}
              >
                {tab === "desc" ? "Description" : tab === "specs" ? "Specifications" : "Reviews"}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#164475]" />
                )}
              </button>
            ))}
          </div>
          <div className="p-10 lg:p-16">
            {activeTab === "desc" && (
              <div className="prose max-w-none text-gray-600 whitespace-pre-wrap">
                {product.description ? (
                  <p>{product.description}</p>
                ) : (
                  <>
                    <p>
                      Elevate your desktop setup to unprecedented levels with the {product.name}. 
                      Engineered using the finest components available, this model pushes the boundaries of modern performance. 
                      Whether you are rendering complex 3D environments, editing high-resolution video, or dominating the latest gaming titles, you will experience seamless, stutter-free execution.
                    </p>
                    <p className="mt-4">
                      The robust thermal design ensures that temperatures remain cool even under the heaviest workloads, prolonging the lifespan of the hardware. With intuitive software integration, adjusting aesthetics and performance profiles is easier than ever.
                    </p>
                  </>
                )}
              </div>
            )}
            {activeTab === "specs" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                {[
                  { label: "Model", value: product.code },
                  { label: "Color", value: "Matte Black / RGB" },
                  { label: "Weight", value: "2.5 kg" },
                  { label: "Dimensions", value: "14.2 x 9.8 x 1.1 in" },
                  { label: "Material", value: "Aluminum Alloy" },
                  { label: "Compatibility", value: "Universal" }
                ].map((spec, i) => (
                  <div key={i} className="flex border-b border-gray-100 py-3">
                    <span className="w-1/3 text-gray-500 font-medium">{spec.label}</span>
                    <span className="w-2/3 text-[#0a1b2d] font-bold">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="text-center py-10 text-gray-500">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-bold text-lg text-[#0a1b2d] mb-2">No Reviews Yet</h3>
                <p>Be the first to review this product!</p>
                <button className="mt-6 border border-[#164475] text-[#164475] font-bold px-8 py-3 rounded-full hover:bg-[#164475] hover:text-white transition-colors">
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
