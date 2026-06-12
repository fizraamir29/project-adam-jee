import React from "react";
import { ArrowRight, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";

const razerMiceImg = "/images/razer_gaming_mice_1780227054333.png";
const headphonesImg = "/images/new_headphones_transparent.png";
const twsEarbudsImg = "/images/new_earbuds_transparent.png";

interface TechCategoriesProps {
  setIsBuilderOpen: (open: boolean) => void;
}

interface CategoryCard {
  id: string;
  title: string;
  count: number;
  subtext: string;
  image: string;
  dark: boolean;
  link?: string;
  action?: boolean;
  arrowIcon?: "right" | "down";
}

export default function TechCategories({ setIsBuilderOpen }: TechCategoriesProps) {
  const categories: CategoryCard[] = [
    {
      id: "mouse",
      title: "Mouse",
      count: 16,
      subtext: "Surrounded yourself in sound",
      image: razerMiceImg,
      dark: true,
      link: "#featured-arrivals",
      arrowIcon: "right"
    },
    {
      id: "headphones",
      title: "Headphones",
      count: 15,
      subtext: "Surrounded yourself in sound",
      image: headphonesImg,
      dark: false,
      action: true,
      arrowIcon: "down"
    },
    {
      id: "earphones",
      title: "Earphones",
      count: 8,
      subtext: "Surrounded yourself in sound",
      image: twsEarbudsImg,
      dark: false,
      link: "#featured-arrivals",
      arrowIcon: "right"
    }
  ];

  return (
    <section id="explore-categories" className="px-4 md:px-12 py-16 bg-white overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 reveal-up">
          <div className="space-y-2">
            <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#164475] block">
              FEATURED CATEGORIES
            </span>
            <div className="flex flex-col text-left">
              <h2 className="text-[44px] md:text-[56px] font-black text-black tracking-tight leading-[1.05]">
                Explore Top<br />
                Tech Categories
              </h2>
            </div>
          </div>

          {/* Slider controls */}
          <div className="flex items-center space-x-4 self-end select-none mb-2">
            <button className="w-12 h-12 rounded-full border border-gray-200 text-gray-400 flex items-center justify-center bg-white hover:bg-gray-50 hover:text-black transition cursor-pointer icon-hover-scale">
              <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
            </button>
            <button className="w-12 h-12 rounded-full bg-[#164475] text-white flex items-center justify-center hover:bg-[#0d2a52] transition shadow-md cursor-pointer icon-hover-scale">
              <ChevronRight className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* 3 cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {categories.map((cat, index) => {
            const delayClass = `delay-${(index + 1) * 100}`;
            
            if (cat.dark) {
              return (
                <div
                  key={cat.id}
                  className={`relative h-[422px] max-w-[368px] w-full mx-auto rounded-[24px] overflow-hidden group bg-[#111111] flex flex-col justify-end p-8 shadow-sm hover:shadow-xl transition-all duration-500 reveal-up ${delayClass}`}
                >
                  <img
                    src={cat.image}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    alt={cat.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  <div className="relative flex justify-between items-end text-white z-10 w-full">
                    <div className="space-y-1 text-left">
                      <h3 className="text-[28px] font-medium tracking-tight flex items-start gap-1">
                        {cat.title} <span className="text-[10px] mt-2 font-normal text-white/80">{cat.count}</span>
                      </h3>
                      <p className="text-[13px] text-white/80 font-normal">{cat.subtext}</p>
                    </div>
                    <a
                      href={cat.link}
                      className="text-white hover:text-gray-300 transition duration-300 mb-1 icon-hover-scale"
                      aria-label={`View ${cat.title}`}
                    >
                      <ArrowRight className="w-5 h-5 stroke-[2]" />
                    </a>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={cat.id}
                className={`relative h-[422px] max-w-[368px] w-full mx-auto rounded-[24px] overflow-hidden group bg-[#f8f9fa] hover:bg-[#f1f3f5] flex flex-col justify-between p-8 transition-all duration-500 reveal-up ${delayClass}`}
              >
                <div className="relative w-full flex-1 flex items-center justify-center">
                  <img
                    src={cat.image}
                    className="w-[260px] h-[260px] object-contain transition-transform duration-500 group-hover:scale-105 product-img-zoom"
                    alt={cat.title}
                  />
                </div>
                <div className="relative flex justify-between items-end text-black z-10 w-full pt-4">
                  <div className="space-y-1 text-left flex-1">
                    <h3 className="text-[28px] font-medium tracking-tight flex items-start gap-1">
                      <span className={cat.title === "Headphones" ? "border-b-2 border-black pb-0.5" : ""}>
                        {cat.title}
                      </span>
                      <span className="text-[10px] mt-2 font-normal text-gray-500">
                        {cat.count < 10 ? `0${cat.count}` : cat.count}
                      </span>
                    </h3>
                    <p className="text-[13px] text-gray-500 font-normal mt-1">{cat.subtext}</p>
                  </div>
                  {cat.action ? (
                    <button
                      onClick={() => setIsBuilderOpen(true)}
                      className="text-black hover:text-gray-600 transition duration-300 cursor-pointer bg-transparent border-none p-0 mb-1 icon-hover-scale"
                      aria-label={`Configure ${cat.title}`}
                    >
                      {cat.arrowIcon === "down" ? <ArrowDown className="w-5 h-5 stroke-[2]" /> : <ArrowRight className="w-5 h-5 stroke-[2]" />}
                    </button>
                  ) : (
                    <a
                      href={cat.link}
                      className="text-black hover:text-gray-600 transition duration-300 mb-1 icon-hover-scale"
                      aria-label={`View ${cat.title}`}
                    >
                      {cat.arrowIcon === "down" ? <ArrowDown className="w-5 h-5 stroke-[2]" /> : <ArrowRight className="w-5 h-5 stroke-[2]" />}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
