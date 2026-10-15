"use client";

import { useRef, useEffect } from "react";
import { ServiceCategoryData } from "@/types/services";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

interface CategoryNavigationProps {
  categories: ServiceCategoryData[];
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
}

export default function CategoryNavigation({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryNavigationProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  // Auto-slide to selected button when selectedCategory changes
  useEffect(() => {
    if (!swiperRef.current) return;
    const activeIndex =
      selectedCategory === "all"
        ? 0
        : categories.findIndex((c) => c.slug === selectedCategory) + 1;
    if (activeIndex >= 0) {
      swiperRef.current.slideTo(activeIndex, 300);
    }
  }, [selectedCategory, categories]);

  return (
    <div className="top-20 z-40 w-full bg-[#F7F1EB]/95 backdrop-blur-md border-y border-stone-200/90 shadow-xs py-3 transition-all">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center gap-2">
        {/* Left Navigation Chevron Button (Desktop) */}
        <button
          className="cat-nav-prev hidden sm:flex w-8 h-8 rounded-full border border-stone-300 items-center justify-center bg-white text-stone-800 hover:bg-stone-900 hover:text-white transition-all shadow-xs shrink-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous categories"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Swiper Categories Track */}
        <div className="flex-1 min-w-0">
          <Swiper
            modules={[FreeMode, Navigation]}
            navigation={{
              prevEl: ".cat-nav-prev",
              nextEl: ".cat-nav-next",
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            slidesPerView="auto"
            spaceBetween={8}
            freeMode={{
              enabled: true,
              sticky: false,
              momentumRatio: 0.8,
            }}
            grabCursor={true}
            className="w-full py-1"
          >
            {/* ALL Category Button */}
            <SwiperSlide className="!w-auto">
              <button
                data-slug="all"
                onClick={() => onSelectCategory("all")}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.18em] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  selectedCategory === "all"
                    ? "bg-stone-900 text-stone-50 shadow-xs"
                    : "bg-stone-200/60 text-stone-700 hover:bg-stone-300/60 hover:text-stone-900"
                }`}
              >
                ALL
              </button>
            </SwiperSlide>

            {/* Dynamic Categories */}
            {categories.map((category) => {
              const isSelected = selectedCategory === category.slug;
              return (
                <SwiperSlide key={category.id || category.slug} className="!w-auto">
                  <button
                    data-slug={category.slug}
                    onClick={() => onSelectCategory(category.slug)}
                    className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.18em] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? "bg-stone-900 text-stone-50 shadow-xs"
                        : "bg-stone-200/60 text-stone-700 hover:bg-stone-300/60 hover:text-stone-900"
                    }`}
                  >
                    {category.name}
                  </button>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Right Navigation Chevron Button (Desktop) */}
        <button
          className="cat-nav-next hidden sm:flex w-8 h-8 rounded-full border border-stone-300 items-center justify-center bg-white text-stone-800 hover:bg-stone-900 hover:text-white transition-all shadow-xs shrink-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next categories"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
