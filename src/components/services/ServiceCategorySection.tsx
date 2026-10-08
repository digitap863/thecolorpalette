"use client";

import { useRef, useState, useEffect } from "react";
import TreatmentCard from "./TreatmentCard";
import { ServiceCategoryData, ServiceData } from "@/types/services";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ServiceCategorySectionProps {
  category: ServiceCategoryData;
  treatments: ServiceData[];
  index: number;
}

export default function ServiceCategorySection({
  category,
  treatments,
  index,
}: ServiceCategorySectionProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  if (treatments.length === 0) return null;

  const paddedIndex = String(index + 1).padStart(2, "0");

  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [treatments]);

  const handleScroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { clientWidth } = sliderRef.current;
      const scrollAmount = direction === "left" ? -clientWidth * 0.8 : clientWidth * 0.8;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id={category.slug}
      className="w-full py-7 sm:py-9 border-b border-stone-200/70 scroll-mt-36"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Category Header with Title, Description, and Swiper Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10 pb-4 border-b border-stone-200/60">
          
          <div className="border-l-2 border-stone-800 pl-4 sm:pl-6 max-w-3xl">
           

            {/* Title */}
            <h2 className="font-belleza text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 tracking-tight leading-tight mb-2">
              {category.name}
            </h2>

            {/* Description */}
            {category.shortDescription && (
              <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
                {category.shortDescription}
              </p>
            )}
          </div>

          {/* Swiper Arrow Buttons (Visible when treatments overflow or on desktop) */}
          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
            <button
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center transition-all cursor-pointer ${
                canScrollLeft
                  ? "bg-white text-stone-900 hover:bg-stone-900 hover:text-white hover:border-stone-900 shadow-xs"
                  : "bg-stone-100 text-stone-300 border-stone-200 cursor-not-allowed"
              }`}
              aria-label="Previous treatments"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center transition-all cursor-pointer ${
                canScrollRight
                  ? "bg-white text-stone-900 hover:bg-stone-900 hover:text-white hover:border-stone-900 shadow-xs"
                  : "bg-stone-100 text-stone-300 border-stone-200 cursor-not-allowed"
              }`}
              aria-label="Next treatments"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Treatments Swiper Row (4 cards per view on large screens) */}
        <div
          ref={sliderRef}
          onScroll={checkScroll}
          className="flex items-stretch gap-6 overflow-x-auto scroll-smooth pb-4 pt-1 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {treatments.map((treatment, cardIdx) => (
            <div
              key={treatment.id}
              className="w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] shrink-0 snap-start flex flex-col"
            >
              <TreatmentCard treatment={treatment} index={cardIdx} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
