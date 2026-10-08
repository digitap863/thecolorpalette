"use client";

import { useRef, useEffect } from "react";
import { ServiceCategoryData } from "@/types/services";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll selected button into view on mobile / desktop scrollable bar
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector(
        `[data-slug="${selectedCategory}"]`
      );
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedCategory]);

  return (
    <div className=" top-20 z-40 w-full bg-[#F7F1EB]/95 backdrop-blur-md border-y border-stone-200/90 shadow-xs py-3.5 transition-all">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* ALL Button */}
          <button
            data-slug="all"
            onClick={() => onSelectCategory("all")}
            className={`shrink-0 px-4 py-2 rounded-full text-xs uppercase tracking-[0.18em] font-medium transition-all duration-200 cursor-pointer ${
              selectedCategory === "all"
                ? "bg-stone-900 text-stone-50 shadow-xs"
                : "bg-stone-200/60 text-stone-700 hover:bg-stone-300/60 hover:text-stone-900"
            }`}
          >
            ALL
          </button>

          {/* Dynamic Categories */}
          {categories.map((category) => {
            const isSelected = selectedCategory === category.slug;
            return (
              <button
                key={category.id || category.slug}
                data-slug={category.slug}
                onClick={() => onSelectCategory(category.slug)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs uppercase tracking-[0.18em] font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-stone-900 text-stone-50 shadow-xs"
                    : "bg-stone-200/60 text-stone-700 hover:bg-stone-300/60 hover:text-stone-900"
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
